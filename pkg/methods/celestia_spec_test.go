package specs_test

import (
	"os"
	"slices"
	"strings"
	"testing"

	specs "github.com/drpcorg/public/pkg/methods"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// celestia-node speaks the go-jsonrpc channel protocol: a subscribe call is
// acknowledged with a channel id, events arrive as xrpc.ch.val notifications,
// the node closes a channel with xrpc.ch.close and the client cancels one with
// xrpc.cancel naming the original request. The spec pins those names and the
// channel subscription type; a wrong value fails silently at runtime because
// frames are matched on the channel id, never on the method name.
func TestCelestiaWebsocketChannelSubscriptions(t *testing.T) {
	require.NoError(t, specs.NewMethodSpecLoader().Load())

	assert.Contains(t, specs.GetSpecConnectors("celestia"), specs.WebsocketConnector)
	assert.ElementsMatch(t, []string{"header.Subscribe", "blob.Subscribe"}, specs.GetSubMethods("celestia").ToSlice())

	for _, name := range []string{"header.Subscribe", "blob.Subscribe"} {
		assert.True(t, specs.IsSubscribeMethod("celestia", name), "%s is not a subscribe method", name)

		method := specs.GetSpecMethod("celestia", name)
		require.NotNil(t, method, "no spec method %s", name)
		require.NotNil(t, method.Subscription, "%s has no subscription settings", name)
		assert.Equal(t, specs.SubscriptionTypeChannel, method.Subscription.Type, "%s: wrong subscription type", name)
		assert.Equal(t, "xrpc.ch.val", method.Subscription.Method, "%s: wrong notification name", name)
		assert.False(t, method.IsCacheable(), "%s must not be cacheable", name)
		assert.Equal(t, []specs.ApiConnectorType{specs.WebsocketConnector}, method.GetApiConnectorTypes(), "%s: wrong connectors", name)

		unsub, ok := specs.GetUnsubscribeMethod("celestia", name)
		require.True(t, ok, "no unsubscribe method for %s", name)
		assert.Equal(t, "xrpc.cancel", unsub, "%s: wrong unsubscribe name", name)
	}

	cancel := specs.GetSpecMethod("celestia", "xrpc.cancel")
	require.NotNil(t, cancel)
	assert.True(t, cancel.IsLocal())
	assert.False(t, cancel.IsCacheable())
	assert.False(t, cancel.IsSubscribe())

	assert.Contains(t, wsMethods(t, "celestia"), "header.Subscribe")
	assert.NotContains(t, jsonRpcMethods(t, "celestia"), "header.Subscribe")
	assert.NotContains(t, wsMethods(t, "celestia"), "header.LocalHead")
}

// celestia-app registers its own gRPC services next to the SDK's: the Query
// services of its modules plus the app-level GasEstimator and Tx. Only the
// services a standard (non-fibre) celestia-appd build serves are declared -
// fibre and valaddr are behind the fibre build tag until v10, the Fibre shard
// service runs on the validators' separate fibre server, and Msg services
// are tx payloads, never RPCs. Plain cosmos chains must not see any of them.
func TestCelestiaGrpcServices(t *testing.T) {
	require.NoError(t, specs.NewMethodSpecLoader().Load())

	groups := specs.GetSpecMethodsByConnectors("celestia", []specs.ApiConnectorType{specs.GrpcConnector})
	require.NotNil(t, groups)

	var celestiaServices []string
	celestiaMethods := 0
	for name, method := range groups[specs.DefaultMethodGroup] {
		if !strings.HasPrefix(name, "/celestia.") {
			continue
		}
		celestiaMethods++
		assert.False(t, method.IsCacheable(), "%s must not be cacheable", name)
		assert.Equal(t, specs.GrpcCallTypeUnary, method.GrpcCallType(), name)
		assert.Nil(t, specs.GetSpecMethod("cosmos", name), "%s leaked into the cosmos bundle", name)

		service, _, found := strings.Cut(strings.TrimPrefix(name, "/"), "/")
		require.True(t, found, name)
		if !slices.Contains(celestiaServices, service) {
			celestiaServices = append(celestiaServices, service)
		}
	}
	slices.Sort(celestiaServices)

	assert.Equal(t, 18, celestiaMethods)
	assert.Equal(t, []string{
		"celestia.blob.v1.Query",
		"celestia.core.v1.gas_estimation.GasEstimator",
		"celestia.core.v1.tx.Tx",
		"celestia.forwarding.v1.Query",
		"celestia.minfee.v1.Query",
		"celestia.mint.v1.Query",
		"celestia.signal.v1.Query",
		"celestia.zkism.v1.Query",
	}, celestiaServices)
	assert.Subset(t, specs.GetGrpcServices(), celestiaServices)

	// The SDK half still comes from the cosmos import.
	assert.NotNil(t, specs.GetSpecMethod("celestia", "/cosmos.bank.v1beta1.Query/Params"))
}

// An absent type means the JSON-RPC subscription model every other websocket
// spec uses, so those specs need no change and consumers never see "".
func TestSubscriptionTypeDefaultsToBase(t *testing.T) {
	require.NoError(t, specs.NewMethodSpecLoader().Load())

	for specName, methodName := range map[string]string{
		"eth":      "eth_subscribe",
		"solana":   "slotSubscribe",
		"polkadot": "chain_subscribeNewHeads",
	} {
		method := specs.GetSpecMethod(specName, methodName)
		require.NotNil(t, method, "%s: no spec method %s", specName, methodName)
		require.NotNil(t, method.Subscription, "%s: %s has no subscription settings", specName, methodName)
		assert.Equal(t, specs.SubscriptionTypeBase, method.Subscription.Type, "%s.%s", specName, methodName)
	}
}

func TestLoadSpecSubscriptionTypes(t *testing.T) {
	require.NoError(t, specs.NewMethodSpecLoaderWithFs(os.DirFS("test_specs/subscription_types")).Load())

	for methodName, want := range map[string]specs.SubscriptionType{
		"eth_subscribe":           specs.SubscriptionTypeBase,
		"chain_subscribeNewHeads": specs.SubscriptionTypeBase,
		"header.Subscribe":        specs.SubscriptionTypeChannel,
	} {
		method := specs.GetSpecMethod("test", methodName)
		require.NotNil(t, method, "no spec method %s", methodName)
		require.NotNil(t, method.Subscription, "%s has no subscription settings", methodName)
		assert.Equal(t, want, method.Subscription.Type, methodName)
	}
}

func TestLoadSpecWrongSubscriptionTypeThenError(t *testing.T) {
	err := specs.NewMethodSpecLoaderWithFs(os.DirFS("test_specs/wrong_subscription_type")).Load()

	assert.ErrorContains(t, err, "couldn't read method specs: error during method 'header.Subscribe' of 'spec.json' validation, cause: unknown subscription type - stream")
}

// A Go-constructed method must see the same default as a loaded one.
func TestMethodWithSettingsDefaultsSubscriptionType(t *testing.T) {
	method := specs.MethodWithSettings("eth_subscribe", []specs.ApiConnectorType{specs.WebsocketConnector}, &specs.MethodSettings{
		Subscription: &specs.Subscription{IsSubscribe: true, Method: "eth_subscription", UnsubMethod: "eth_unsubscribe"},
	}, nil)
	require.NotNil(t, method)
	require.NotNil(t, method.Subscription)
	assert.Equal(t, specs.SubscriptionTypeBase, method.Subscription.Type)
}

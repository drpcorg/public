package specs_test

import (
	"strings"
	"testing"

	specs "github.com/drpcorg/public/pkg/methods"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// java-tron serves protocol.Wallet on the full-node gRPC port, protocol.WalletSolidity
// on the solidity port and protocol.Database on both; the tron bundle models that as
// grpc / grpc-additional / both. Counts are the service sizes at the pinned
// java-tron tag (chain-apis/tron.gen.yaml); a bump that changes them must change
// the specs and this test together.
const (
	tronWalletMethods         = 147
	tronWalletSolidityMethods = 47
	tronDatabaseMethods       = 4
)

var tronDatabaseMethodNames = []string{
	"/protocol.Database/getBlockReference",
	"/protocol.Database/GetDynamicProperties",
	"/protocol.Database/GetNowBlock",
	"/protocol.Database/GetBlockByNum",
}

func TestTronBundleConnectors(t *testing.T) {
	require.NoError(t, specs.NewMethodSpecLoader().Load())

	assert.Equal(t, []specs.ApiConnectorType{
		specs.JsonRpcConnector,
		specs.RestConnector,
		specs.GrpcConnector,
		specs.RestAdditional,
		specs.GrpcAdditional,
	}, specs.GetSpecConnectors("tron"))
}

func tronMethodsByService(t *testing.T, connector specs.ApiConnectorType) map[string][]string {
	t.Helper()
	groups := specs.GetSpecMethodsByConnectors("tron", []specs.ApiConnectorType{connector})
	require.NotNil(t, groups)

	byService := map[string][]string{}
	for name := range groups[specs.DefaultMethodGroup] {
		if !strings.HasPrefix(name, "/protocol.") {
			continue
		}
		service, _, found := strings.Cut(strings.TrimPrefix(name, "/"), "/")
		require.True(t, found, name)
		byService[service] = append(byService[service], name)
	}
	return byService
}

func TestTronGrpcBucketIsWalletAndDatabase(t *testing.T) {
	require.NoError(t, specs.NewMethodSpecLoader().Load())

	byService := tronMethodsByService(t, specs.GrpcConnector)
	assert.Len(t, byService["protocol.Wallet"], tronWalletMethods)
	assert.Len(t, byService["protocol.Database"], tronDatabaseMethods)
	assert.Empty(t, byService["protocol.WalletSolidity"], "solidity methods must not be routed on the full-node port")
	assert.Len(t, byService, 2)
}

func TestTronGrpcAdditionalBucketIsWalletSolidityAndDatabase(t *testing.T) {
	require.NoError(t, specs.NewMethodSpecLoader().Load())

	byService := tronMethodsByService(t, specs.GrpcAdditional)
	assert.Len(t, byService["protocol.WalletSolidity"], tronWalletSolidityMethods)
	assert.Len(t, byService["protocol.Database"], tronDatabaseMethods)
	assert.Empty(t, byService["protocol.Wallet"], "full-node methods must not be routed on the solidity port")
	assert.Len(t, byService, 2)
}

func TestTronDatabaseMethodsAreOnBothGrpcConnectors(t *testing.T) {
	require.NoError(t, specs.NewMethodSpecLoader().Load())

	for _, connector := range []specs.ApiConnectorType{specs.GrpcConnector, specs.GrpcAdditional} {
		methods := specs.GetSpecMethodsByConnectors("tron", []specs.ApiConnectorType{connector})[specs.DefaultMethodGroup]
		for _, name := range tronDatabaseMethodNames {
			assert.Contains(t, methods, name, "%s missing on %s", name, connector)
		}
	}
}

// Every java-tron RPC is unary and nothing is cacheable in v1, like sui-grpc.
func TestTronGrpcMethodsAreUnaryAndNotCacheable(t *testing.T) {
	require.NoError(t, specs.NewMethodSpecLoader().Load())

	seen := 0
	for _, connector := range []specs.ApiConnectorType{specs.GrpcConnector, specs.GrpcAdditional} {
		for _, names := range tronMethodsByService(t, connector) {
			for _, name := range names {
				method := specs.GetSpecMethod("tron", name)
				require.NotNil(t, method, name)
				assert.Equal(t, specs.GrpcCallTypeUnary, method.GrpcCallType(), name)
				assert.False(t, method.IsSubscribe(), name)
				assert.False(t, method.IsCacheable(), "%s must not be cacheable", name)
				seen++
			}
		}
	}
	assert.Equal(t, tronWalletMethods+tronWalletSolidityMethods+2*tronDatabaseMethods, seen)
}

func TestGetGrpcServicesListsAllTronServices(t *testing.T) {
	require.NoError(t, specs.NewMethodSpecLoader().Load())

	assert.Subset(t, specs.GetGrpcServices(), []string{
		"protocol.Database",
		"protocol.Wallet",
		"protocol.WalletSolidity",
	})
}

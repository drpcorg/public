package cosmos_test

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"google.golang.org/protobuf/reflect/protoreflect"
	"google.golang.org/protobuf/reflect/protoregistry"

	_ "github.com/drpcorg/public/pkg/cosmos"
	specs "github.com/drpcorg/public/pkg/methods"
)

// knownUnreflectable are the five spec methods with no descriptor, and they
// are not a packaging mistake: the fleet spans ibc-go v8 and v10, and these
// are v8-only RPCs that every current ibc-go release has removed. One
// generated descriptor set cannot hold both shapes of the same service, so
// these route (routing is a string match on the method name) but reflection
// for them has to come from the upstream node.
//
// Pinned by name on purpose: an ibc-go bump that brings any of them back
// fails this test instead of quietly leaving coverage unclaimed.
var knownUnreflectable = []string{
	"/ibc.applications.transfer.v1.Query/DenomTrace",
	"/ibc.applications.transfer.v1.Query/DenomTraces",
	"/ibc.core.channel.v1.Query/ChannelParams",
	"/ibc.core.channel.v1.Query/Upgrade",
	"/ibc.core.channel.v1.Query/UpgradeError",
}

// Every method in cosmos-grpc.json must resolve to a real service method
// among the descriptors this package registers, the five above excepted. A
// typo in the spec, or a dependency bump that drops a module, fails here
// rather than at runtime as an advertised service reflection cannot answer
// for.
func TestEveryCosmosGrpcSpecMethodHasADescriptor(t *testing.T) {
	require.NoError(t, specs.NewMethodSpecLoader().Load())

	groups := specs.GetSpecMethodsByConnectors("cosmos", []specs.ApiConnectorType{specs.GrpcConnector})
	require.NotNil(t, groups)
	methods := groups[specs.DefaultMethodGroup]
	require.Len(t, methods, 157)

	resolved := 0
	for name := range methods {
		serviceName, methodName, found := strings.Cut(strings.TrimPrefix(name, "/"), "/")
		require.True(t, found, name)

		descriptor, err := protoregistry.GlobalFiles.FindDescriptorByName(protoreflect.FullName(serviceName))
		require.NoError(t, err, "service %s is advertised but not registered", serviceName)

		service, ok := descriptor.(protoreflect.ServiceDescriptor)
		require.True(t, ok, "%s is not a service", serviceName)

		if service.Methods().ByName(protoreflect.Name(methodName)) != nil {
			resolved++
			continue
		}
		assert.Contains(t, knownUnreflectable, name, "%s has no descriptor and is not a known gap", name)
	}
	assert.Equal(t, len(methods)-len(knownUnreflectable), resolved)
}

// Cosmos gRPC carries no streaming RPC at all - not in the SDK, not in ibc-go,
// not in wasmd - which is why the spec needs no grpc.call-type annotation.
// Assert it against the descriptors, not the spec.
func TestNoCosmosGrpcMethodStreams(t *testing.T) {
	require.NoError(t, specs.NewMethodSpecLoader().Load())

	for _, serviceName := range specs.GetGrpcServices() {
		if strings.HasPrefix(serviceName, "sui.") {
			continue
		}
		descriptor, err := protoregistry.GlobalFiles.FindDescriptorByName(protoreflect.FullName(serviceName))
		require.NoError(t, err, serviceName)

		service := descriptor.(protoreflect.ServiceDescriptor)
		for i := range service.Methods().Len() {
			method := service.Methods().Get(i)
			assert.False(t, method.IsStreamingServer(), "%s/%s is server-streaming", serviceName, method.Name())
			assert.False(t, method.IsStreamingClient(), "%s/%s is client-streaming", serviceName, method.Name())
		}
	}
}

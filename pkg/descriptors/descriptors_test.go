package descriptors_test

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"google.golang.org/protobuf/reflect/protoreflect"
	"google.golang.org/protobuf/reflect/protoregistry"

	_ "github.com/drpcorg/public/pkg/cosmos"
	specs "github.com/drpcorg/public/pkg/methods"
	_ "github.com/drpcorg/public/pkg/sui"
	_ "github.com/drpcorg/public/pkg/tron/api"
)

// Reflection clients that resolve imports one at a time via file_by_filename
// (Postman does) fail the whole load with "proto: not found" on any import
// the registry cannot serve by path - unlike file_containing_symbol, which
// silently skips unresolvable imports (which is why grpcurl never catches
// this). Every file in the transitive import closure of every advertised
// gRPC service must therefore resolve through GlobalFiles.FindFileByPath.
func TestEveryGrpcImportResolvesByFilename(t *testing.T) {
	require.NoError(t, specs.NewMethodSpecLoader().Load())

	services := specs.GetGrpcServices()
	require.NotEmpty(t, services)

	checked := map[string]bool{}
	var walk func(path, importer string)
	walk = func(path, importer string) {
		if checked[path] {
			return
		}
		checked[path] = true
		file, err := protoregistry.GlobalFiles.FindFileByPath(path)
		if !assert.NoError(t, err, "%s (imported by %s) is not resolvable by filename - reflection clients fail the whole load on it", path, importer) {
			return
		}
		imports := file.Imports()
		for i := 0; i < imports.Len(); i++ {
			walk(imports.Get(i).Path(), path)
		}
	}

	for _, service := range services {
		descriptor, err := protoregistry.GlobalFiles.FindDescriptorByName(protoreflect.FullName(service))
		require.NoError(t, err, service)
		walk(descriptor.ParentFile().Path(), service)
	}
}

// Every /protocol.* method the tron bundle declares on either gRPC connector
// must resolve to a method descriptor from pkg/tron/api, with no known gaps:
// the specs are generated from api/api.proto at the same java-tron tag the
// package is generated from. A mismatch means the tag moved on one side only.
func TestEveryTronGrpcSpecMethodHasADescriptor(t *testing.T) {
	require.NoError(t, specs.NewMethodSpecLoader().Load())

	resolved := map[string]bool{}
	for _, connector := range []specs.ApiConnectorType{specs.GrpcConnector, specs.GrpcAdditional} {
		groups := specs.GetSpecMethodsByConnectors("tron", []specs.ApiConnectorType{connector})
		require.NotNil(t, groups)

		for name := range groups[specs.DefaultMethodGroup] {
			if !strings.HasPrefix(name, "/protocol.") {
				continue
			}
			serviceName, methodName, found := strings.Cut(strings.TrimPrefix(name, "/"), "/")
			require.True(t, found, name)

			descriptor, err := protoregistry.GlobalFiles.FindDescriptorByName(protoreflect.FullName(serviceName))
			require.NoError(t, err, "service %s is advertised but not registered", serviceName)

			service, ok := descriptor.(protoreflect.ServiceDescriptor)
			require.True(t, ok, "%s is not a service", serviceName)

			if assert.NotNil(t, service.Methods().ByName(protoreflect.Name(methodName)), "%s has no descriptor", name) {
				resolved[name] = true
			}
		}
	}
	// 147 Wallet + 47 WalletSolidity + 4 Database, each name once
	assert.Len(t, resolved, 198)
}

// java-tron has no streaming RPC; the specs carry no grpc.call-type because of
// it. Assert that against the descriptors, not the spec.
func TestNoTronGrpcMethodStreams(t *testing.T) {
	require.NoError(t, specs.NewMethodSpecLoader().Load())

	for _, serviceName := range specs.GetGrpcServices() {
		if !strings.HasPrefix(serviceName, "protocol.") {
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

// The reverse direction of TestEveryTronGrpcSpecMethodHasADescriptor: every
// RPC the generated descriptors carry for the three services must be declared
// by the specs. Otherwise a java-tron tag bump that adds an RPC regenerates
// pkg/tron, every test stays green, and the new method is silently unroutable.
func TestEveryTronDescriptorMethodIsInTheSpecs(t *testing.T) {
	require.NoError(t, specs.NewMethodSpecLoader().Load())

	declared := map[string]bool{}
	for _, connector := range []specs.ApiConnectorType{specs.GrpcConnector, specs.GrpcAdditional} {
		groups := specs.GetSpecMethodsByConnectors("tron", []specs.ApiConnectorType{connector})
		require.NotNil(t, groups)
		for name := range groups[specs.DefaultMethodGroup] {
			declared[name] = true
		}
	}

	for _, serviceName := range []string{"protocol.Wallet", "protocol.WalletSolidity", "protocol.Database"} {
		descriptor, err := protoregistry.GlobalFiles.FindDescriptorByName(protoreflect.FullName(serviceName))
		require.NoError(t, err, serviceName)
		service, ok := descriptor.(protoreflect.ServiceDescriptor)
		require.True(t, ok, "%s is not a service", serviceName)

		for i := range service.Methods().Len() {
			name := "/" + serviceName + "/" + string(service.Methods().Get(i).Name())
			assert.True(t, declared[name], "%s exists upstream but no tron spec declares it", name)
		}
	}
}

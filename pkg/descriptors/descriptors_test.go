package descriptors_test

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"google.golang.org/protobuf/reflect/protoreflect"
	"google.golang.org/protobuf/reflect/protoregistry"

	_ "github.com/drpcorg/public/pkg/cosmos"
	specs "github.com/drpcorg/public/pkg/methods"
	_ "github.com/drpcorg/public/pkg/sui"
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

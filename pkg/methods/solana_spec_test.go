package specs_test

import (
	"testing"

	specs "github.com/drpcorg/public/pkg/methods"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// getAgGenesisCert (Agave 4.3) is how clients detect the Alpenglow switch: null on
// TowerBFT, the genesis certificate after. The answer flips once, at migration, so
// it must not be cached.
func TestSolanaAlpenglowGenesisCert(t *testing.T) {
	require.NoError(t, specs.NewMethodSpecLoader().Load())

	method := specs.GetSpecMethod("solana", "getAgGenesisCert")
	require.NotNil(t, method)
	assert.False(t, method.IsCacheable())
}

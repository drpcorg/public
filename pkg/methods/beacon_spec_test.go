package specs_test

import (
	"testing"

	specs "github.com/drpcorg/public/pkg/methods"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestBeaconChainSpecLoadsAndMatchesRestPaths(t *testing.T) {
	require.NoError(t, specs.NewMethodSpecLoader().Load())

	rest := []specs.ApiConnectorType{specs.RestConnector}

	groups := specs.GetSpecMethodsByConnectors("eth-beacon-chain", rest)
	require.NotNil(t, groups)
	defaultGroup, ok := groups[specs.DefaultMethodGroup]
	require.True(t, ok)
	assert.Len(t, defaultGroup, 103)

	// Beacon responses are alias-addressed (head/finalized), so caching is off.
	for _, method := range defaultGroup {
		assert.False(t, method.IsCacheable())
	}

	cases := []struct {
		path         string
		wantTemplate string
		wantParams   []string
	}{
		{"GET#/eth/v1/beacon/headers/head", "GET#/eth/v1/beacon/headers/*", []string{"head"}},
		{"GET#/eth/v1/beacon/headers/finalized", "GET#/eth/v1/beacon/headers/*", []string{"finalized"}},
		{"GET#/eth/v2/beacon/blocks/12345", "GET#/eth/v2/beacon/blocks/*", []string{"12345"}},
		{"GET#/eth/v1/beacon/genesis", "GET#/eth/v1/beacon/genesis", nil},
		{"GET#/eth/v1/node/syncing", "GET#/eth/v1/node/syncing", nil},
		{"POST#/eth/v1/beacon/states/head/validator_balances", "POST#/eth/v1/beacon/states/*/validator_balances", []string{"head"}},
		{"GET#/eth/v1/beacon/states/head/validators/0", "GET#/eth/v1/beacon/states/*/validators/*", []string{"head", "0"}},
		// Beacon API v5.0.0-beta.0 (Gloas)
		{"GET#/eth/v2/validator/duties/proposer/131113", "GET#/eth/v2/validator/duties/proposer/*", []string{"131113"}},
		{"GET#/eth/v2/node/version", "GET#/eth/v2/node/version", nil},
		{"POST#/eth/v4/validator/blocks/42", "POST#/eth/v4/validator/blocks/*", []string{"42"}},
		{"GET#/eth/v1/beacon/states/head/ptc", "GET#/eth/v1/beacon/states/*/ptc", []string{"head"}},
		{"POST#/eth/v1/validator/duties/ptc/7", "POST#/eth/v1/validator/duties/ptc/*", []string{"7"}},
		{"GET#/eth/v1/validator/execution_payload_envelopes/42/0xab", "GET#/eth/v1/validator/execution_payload_envelopes/*/*", []string{"42", "0xab"}},
	}
	for _, c := range cases {
		template, params, ok := specs.MatchRestMethod("eth-beacon-chain", c.path)
		assert.True(t, ok, "expected %s to match", c.path)
		assert.Equal(t, c.wantTemplate, template, "template for %s", c.path)
		assert.Equal(t, c.wantParams, params, "params for %s", c.path)
	}
}

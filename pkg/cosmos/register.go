// Package cosmos registers the protobuf descriptors for every gRPC service
// that specs/cosmos-grpc.json can route, so that importing it (a blank import
// is enough) lets a gRPC ingress answer server reflection for them.
//
// The descriptors come from two different places, for one reason:
//
//   - cosmos.* comes from cosmossdk.io/api, the SDK's own published module.
//     Nothing is generated for it; this package only pins the version and the
//     service set. Any release that still ships all 16 packages works - v1.1.0
//     does not, it moved cosmos/params out into a separate module, as v1.0.0
//     already did for cosmos/nft. Check that before bumping.
//
//   - ibc.* and cosmwasm.* come from pkg/ibc and pkg/cosmwasm, which this
//     repository generates (make ibc-proto-gen, make cosmwasm-proto-gen). The
//     published Go modules for them - buf.build/gen/go/cosmos/ibc and
//     .../cosmwasm/wasmd - cannot be used: each ships its own copy of
//     amino.proto and the cosmos.* descriptors, which panics the process at
//     init against cosmossdk.io/api. The generation templates redirect those
//     shared files at cosmossdk.io/api instead, so only one copy is linked.
//
// The import list must stay in step with specs/cosmos-grpc.json; the spec is
// what GetGrpcServices advertises, and advertising a service whose descriptors
// are absent makes reflection fail for it. Five methods are knowingly absent -
// see TestEveryCosmosGrpcSpecMethodHasADescriptor.
package cosmos

import (
	_ "cosmossdk.io/api/cosmos/auth/v1beta1"
	_ "cosmossdk.io/api/cosmos/authz/v1beta1"
	_ "cosmossdk.io/api/cosmos/bank/v1beta1"
	_ "cosmossdk.io/api/cosmos/base/node/v1beta1"
	_ "cosmossdk.io/api/cosmos/base/tendermint/v1beta1"
	_ "cosmossdk.io/api/cosmos/consensus/v1"
	_ "cosmossdk.io/api/cosmos/distribution/v1beta1"
	_ "cosmossdk.io/api/cosmos/evidence/v1beta1"
	_ "cosmossdk.io/api/cosmos/feegrant/v1beta1"
	_ "cosmossdk.io/api/cosmos/gov/v1"
	_ "cosmossdk.io/api/cosmos/gov/v1beta1"
	_ "cosmossdk.io/api/cosmos/params/v1beta1"
	_ "cosmossdk.io/api/cosmos/slashing/v1beta1"
	_ "cosmossdk.io/api/cosmos/staking/v1beta1"
	_ "cosmossdk.io/api/cosmos/tx/v1beta1"
	_ "cosmossdk.io/api/cosmos/upgrade/v1beta1"

	_ "github.com/drpcorg/public/pkg/cosmwasm/wasm/v1"
	_ "github.com/drpcorg/public/pkg/ibc/applications/transfer/v1"
	_ "github.com/drpcorg/public/pkg/ibc/core/channel/v1"
	_ "github.com/drpcorg/public/pkg/ibc/core/client/v1"
	_ "github.com/drpcorg/public/pkg/ibc/core/connection/v1"
)

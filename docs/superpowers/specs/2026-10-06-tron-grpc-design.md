# Tron gRPC methods

Date: 2026-10-06
Status: approved, implemented (working tree, 2026-10-06)

## Goal

Let the `tron` bundle route the java-tron gRPC API the same way it already routes the
java-tron HTTP API: the FullNode service on the primary gRPC connector and the solidity
service on a second, additional one. Concretely:

1. a new `grpc-additional` api connector in the spec loader, the gRPC twin of
   `rest-additional`;
2. three new plain specs imported by the `tron` bundle: `tron-grpc` (`protocol.Wallet`
   on `grpc`), `tron-grpc-solidity` (`protocol.WalletSolidity` on `grpc-additional`) and
   `tron-grpc-database` (`protocol.Database` on both);
3. a generated descriptor package, `pkg/tron`, so a gRPC ingress can answer server
   reflection for those services.

Scope is **every** RPC of the three services, deprecated variants included. The
documentation page at <https://tronprotocol.github.io/documentation-en/api/rpc/> lists a
curated 82; the proto is the source of truth here, the page is not.

## Why

### The java-tron API is one process, three ports

A java-tron node serves gRPC from the same process as its HTTP and JSON-RPC APIs, on
separate ports: `node.rpc.port` (default 50051, `protocol.Wallet`), `node.rpc.solidityPort`
(default 50061, `protocol.WalletSolidity`, solidified state only) and a PBFT port (50071,
same service as solidity). `protocol.Database` is registered on all of them. The HTTP API
is a JSON rendering of the same protobuf messages, so `tron-rest` / `tron-rest-solidity`
already model exactly this split with `rest` / `rest-additional`. gRPC has no URL path to
tell the two servers apart: they are two service stubs on two ports, so they need two
connectors too.

Everything is unary. `api/api.proto` at the pinned tag has no `stream` RPC, so no
`grpc.call-type` settings are needed anywhere.

### There is no Go package to import

- No module for the Tron protos exists on the Buf Schema Registry.
- `github.com/tronprotocol/grpc-gateway`, the repo upstream's `go_package` options point
  at, is archived (last push 2023).
- `github.com/fbsobreira/gotron-sdk` has modern `protoc-gen-go` output, but it pulls
  go-ethereum into the module graph, its copy of `api.proto` still imports
  `google/api/annotations.proto`, and it registers the same file paths (`api/api.proto`,
  `core/Tron.proto`) into `protoregistry.GlobalFiles`. Any consumer that linked it next to
  our own descriptors would panic at init with "already registered" - the same failure
  class that keeps `buf.build/gen/go/cosmos/ibc` out of this module.

So the descriptors are generated here, like ibc, cosmwasm and celestia.

### Why the services are not on the documentation page's list

The page documents 82 methods, all on `protocol.Wallet`; only 29 of them also exist on
`protocol.WalletSolidity`, which has 18 more the page omits (market, exchange, shielded
notes, a few deprecated non-`2` variants). The REST solidity spec has 32 routes, five of
which have no gRPC solidity counterpart at all. "Mirror the REST spec" therefore cannot be
literal; the decision is to declare the full service surfaces and let the proto define
them.

## Decisions

| Question | Decision | Rationale |
|---|---|---|
| Solidity port modelling | New `grpc-additional` connector, second plain spec. | Mirrors `rest-additional`; a single `grpc` bucket cannot express two upstream ports. |
| Method set | All of `Wallet` (147), `WalletSolidity` (47), `Database` (4). | Owner's call. The proto is the source of truth; deprecated variants stay because nodes still serve them. |
| `Database` | Its own plain spec, `tron-grpc-database`, declaring `["grpc", "grpc-additional"]`. | java-tron registers it on every gRPC port. The loader rejects one method name coming from two same-level imports, so the four methods cannot sit in both of the other specs; a plain spec with two connectors is projected into both buckets, the way `eth-json-rpc` serves `json-rpc` and `websocket`. Verified against the loader with a `rest`/`rest-additional` fixture. |
| Omitted services | `Monitor`, `WalletExtension`, `Network`, `TronZksnark`. | Metrics-flag only / legacy SolidityNode mode only / empty / never registered by any server. |
| Proto source | `github.com/tronprotocol/java-tron`, tag `GreatVoyage-v4.8.2.3`, subdir `protocol/src/main/protos`. | buf `git_repo` input, no submodule, same as ibc/cosmwasm/celestia. |
| Generated files | `api/api.proto` and the `core/` tree. | Exact closure of the three services plus `Discover.proto`, which `Tron.proto` imports. `api/zksnark.proto` is not generated (unserved service). |
| Go package layout | `pkg/tron/api` and `pkg/tron/core`, with `core/contract/*.proto` **folded into** `pkg/tron/core`. | `core/Tron.proto` imports `core/contract/common.proto` and the contract files import `core/Tron.proto`. Legal in protobuf, an import cycle in Go. Upstream's own `go_package` puts both directories in one `core` package; we do the same. Verified to compile. |
| Cacheability | `cacheable: false` on every method. | Parity with `tron-rest`, `tron-rest-solidity` and `sui-grpc`, which have no cacheable method. |
| Descriptor registration | Blank import in `pkg/descriptors`' test, no register package. | Tron is not Cosmos; sui sets the precedent for a chain whose generated package is the whole story. |

## Target layout

```
chain-apis/tron.gen.yaml                        NEW  buf template, git_repo input
pkg/tron/api/api.pb.go                          NEW  generated: Wallet, WalletSolidity, Database, ... + request/response messages
pkg/tron/core/*.pb.go                           NEW  generated: Tron.proto, Discover.proto, TronInventoryItems.proto, contract/*.proto
pkg/methods/specs/tron-grpc.json                NEW  147 Wallet methods on grpc
pkg/methods/specs/tron-grpc-solidity.json       NEW  47 WalletSolidity methods on grpc-additional
pkg/methods/specs/tron-grpc-database.json       NEW  4 Database methods on grpc + grpc-additional
pkg/methods/specs/tron.json                     EDIT bundle imports the three new specs
pkg/methods/data.go                             EDIT GrpcAdditional connector; gRPC-family validation
pkg/methods/helpers.go                          EDIT GetGrpcServices unions both gRPC buckets
pkg/methods/test_specs/grpc_additional_*/       NEW  loader fixtures
pkg/methods/tron_spec_test.go                   NEW  bundle/connector/count/service assertions
pkg/methods/methods_spec_test.go                EDIT grpc-additional loader tests
pkg/descriptors/descriptors_test.go             EDIT blank-import pkg/tron/api; per-method descriptor test
docs/method-specs.md                            EDIT allowed connector values, connector table, tron bundle example
CLAUDE.md                                       EDIT pkg/tron, the contract fold, the gotron-sdk rule
```

`chains.yaml` needs nothing: the three Tron networks already have `grpcId`s and
`method-spec: "tron"`.

## Work item 1 - the `grpc-additional` connector

In `pkg/methods/data.go`:

- `GrpcAdditional ApiConnectorType` appended **after** `RestAdditional` so the
  best-connector ordering of existing types is unchanged. `String()` returns
  `"grpc-additional"`; `apiConnectors` maps the string back; `additionalApiConnectors`
  gains it so `IsAdditionalApiConnectorType` is true. It is **not** added to
  `plainApiConnectorTypes`, exactly like `RestAdditional`.
- `validateGrpcMethods` currently keys on `GrpcConnector` alone. Introduce a package-level
  set of gRPC-family connectors (`GrpcConnector`, `GrpcAdditional`) and key both checks on
  it: a spec declaring either connector gets the `/package.Service/Method` name-shape check
  and may carry `grpc` settings; a spec declaring neither still rejects `grpc` settings.

In `pkg/methods/helpers.go`, `GetGrpcServices` iterates the same set instead of the single
`GrpcConnector` bucket, so reflection advertises `protocol.WalletSolidity` as well.

Nothing in `method.go` changes: `GrpcCallType` and `IsServerStream` are per-method and
connector-agnostic.

Tests, in `methods_spec_test.go` with fixtures under `test_specs/`:

- a `grpc-additional` spec loads, its methods land in the `GrpcAdditional` bucket, and
  `GetSpecConnectors` reports it;
- a `grpc-additional` spec with a non-gRPC method name fails with the existing
  "invalid grpc method name" error;
- a `grpc-additional` method may carry `grpc` settings (the existing
  "has grpc settings but the spec has no grpc api connector" test keeps passing for
  non-gRPC specs);
- `GetGrpcServices` includes a service declared only under `grpc-additional`.

`docs/method-specs.md`: add `grpc-additional` to the allowed `api-connectors` values, the
"reserved for specs that augment an upstream" paragraph (it holds for both additional
types), the connector table, and the `tron` bundle example.

## Work item 2 - `pkg/tron` generation

`chain-apis/tron.gen.yaml`, same shape as `celestia.gen.yaml`:

```yaml
version: v2
managed:
  enabled: true
  override:
    - file_option: go_package_prefix
      value: github.com/drpcorg/public/pkg/tron
    - file_option: go_package
      path: core
      value: github.com/drpcorg/public/pkg/tron/core
    - file_option: go_package
      path: api
      value: github.com/drpcorg/public/pkg/tron/api
plugins:
  - local: ["go", "tool", "protoc-gen-go"]
    out: pkg
    opt:
      - module=github.com/drpcorg/public/pkg
inputs:
  - git_repo: https://github.com/tronprotocol/java-tron.git
    tag: GreatVoyage-v4.8.2.3
    subdir: protocol/src/main/protos
    paths:
      - api/api.proto
      - core
```

The `path: core` override is what folds `core/contract/*.proto` into the `core` Go package;
the header comment in the yaml must say so, and why (the import cycle). The upstream protos
import only `google/protobuf/any.proto` beyond themselves, so there are no `M` remaps.
`make tron-proto-gen` works through the existing pattern rule and gofmts `pkg/tron`.

`pkg/tron` is generated code: never hand-edited, regenerated only through the template.

## Work item 3 - the specs

`tron-grpc.json`:

```json
{
  "openrpc": "1.0.0",
  "info": {
    "title": "TRON full-node gRPC methods (protocol.Wallet)",
    "version": "1.0.0"
  },
  "spec": {
    "name": "tron-grpc",
    "api-connectors": ["grpc"],
    "type": "plain"
  },
  "methods": [ ... ]
}
```

`tron-grpc-solidity.json` is the same with `api-connectors: ["grpc-additional"]` and
`protocol.WalletSolidity`. `tron-grpc-database.json` declares
`api-connectors: ["grpc", "grpc-additional"]` (in that order: `grpc` is the preferred
connector) and the four `protocol.Database` methods. Every method entry is
`{"name", "params": [], "settings": {"cacheable": false}}` with every field on its own
line, per the repo rule. No `grpc` settings block anywhere: unary is the default.

Method lists are generated from `api/api.proto` at the pinned tag with a throwaway script,
never typed by hand, so the counts are exact: 147, 47 and 4. Names keep the proto's
casing, including `/protocol.Database/getBlockReference` (lower-case first letter;
`grpcMethodNamePattern` accepts it).

`tron.json` adds `"tron-grpc"`, `"tron-grpc-solidity"` and `"tron-grpc-database"` to
`spec-imports`.

## Work item 4 - tests

`pkg/methods/tron_spec_test.go`, modelled on `sui_spec_test.go`:

- the `tron` bundle's connectors are exactly `json-rpc`, `rest`, `grpc`, `rest-additional`,
  `grpc-additional`;
- `GetSpecMethodsByConnectors("tron", [grpc])` has 151 methods (Wallet + Database),
  `[grpc-additional]` has 51 (WalletSolidity + Database), every one named
  `/protocol.<Service>/<Method>` with the expected service;
- the four `protocol.Database` methods appear in both buckets, the Wallet ones only in
  `grpc`, the WalletSolidity ones only in `grpc-additional`;
- `GetGrpcServices()` contains `protocol.Database`, `protocol.Wallet`,
  `protocol.WalletSolidity`;
- no method of either spec streams, and none is cacheable.

`pkg/descriptors/descriptors_test.go`:

- blank-import `github.com/drpcorg/public/pkg/tron/api` so
  `TestEveryGrpcImportResolvesByFilename` walks the Tron closure;
- a new test asserting every `/protocol.` method in the `tron` bundle, across both gRPC
  buckets, resolves to a `protoreflect.MethodDescriptor`, with **no** known gaps (unlike
  cosmos' five), and that none of them streams. It lives here rather than next to the
  generated code because `pkg/tron` is not hand-edited.

`pkg/cosmos/register_test.go`'s `TestNoCosmosGrpcMethodStreams` iterates every advertised
service and skips only `sui.`; the cosmos test binary does not link `pkg/tron`, so it
must also skip `protocol.` (the Tron no-stream assertion moves to `pkg/descriptors`).

## Work item 5 - docs and rules

CLAUDE.md layout section gains `pkg/tron/` as generated via `make tron-proto-gen`. The rules
section gains:

- `pkg/tron/core` holds both `core/` and `core/contract/` protos on purpose (Go import
  cycle); keep the `path: core` override when touching the template;
- never import `github.com/fbsobreira/gotron-sdk`: it registers the same proto file paths
  and panics at init against `pkg/tron`;
- `grpc-additional` is the gRPC twin of `rest-additional` and must be treated as a
  gRPC-family connector wherever the loader keys on `grpc`.

## Verification

```
make tron-proto-gen      # regenerates pkg/tron, diff must be empty after the first commit
make test
make lint
```

Plus, with the template committed: deleting `pkg/tron` and regenerating yields the same
files, which is what makes the package reproducible from the tag.

## Risks

**Consumers must learn the connector.** A consumer running this loader will load the new
specs fine, but its upstream configuration has to be able to attach a second gRPC endpoint
under `grpc-additional`, the way it does for `rest-additional`. Until it does, the
`tron-grpc-solidity` methods are advertised but unroutable. Out of scope here; flagged.

**`Database` on two connectors.** The loader rejects one method name arriving from two
same-level imports, which is why Database has its own spec declaring both connectors
rather than being repeated in the Wallet and WalletSolidity specs. A plain spec's methods
are projected into every connector bucket it declares, so the bundle sees each name once
and both buckets hold the four methods. The tron spec test pins that.

**`protocol` is a generic proto package name.** No other descriptor this module registers
uses it, and the file paths (`api/api.proto`, `core/...`) are equally specific to Tron.
The collision risk is external (gotron-sdk), hence the CLAUDE.md rule.

**Upstream pin drift.** The `rpc` lines at `GreatVoyage-v4.8.2.3` are identical to
`develop` today. A future bump that adds or removes RPCs shows up as a descriptor-test
failure or as a spec count mismatch, both intentional.

## Follow-up work, explicitly out of scope

- Consumer-side support for `grpc-additional` upstream endpoints.
- `Monitor` / `WalletExtension`, should an operator-facing need appear.
- Method-level cacheability for the pure reads, once there is evidence it is wanted.

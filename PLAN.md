# `eth_getProof` historical-proof strategy — `drpcorg/public` part

Status: implemented in this branch. Diffs below are applied, generated code is regenerated, `make test` passes.

## 1. Applied change: `proto/blockchain.proto`

```diff
@@ enum LowerBoundType @@
     LOWER_BOUND_RECEIPTS = 10;
+    // upper bound of the historical proof store (op-reth debug_proofsSyncStatus.latest). Reuses the LowerBound message.
+    UPPER_BOUND_PROOF = 11;
 }
```

`LOWER_BOUND_PROOF = 7` (`proto/blockchain.proto:152`) and `LOWER_BOUND_RECEIPTS = 10` (`proto/blockchain.proto:155`) are unchanged. No new message: `LowerBound{lower_bound_timestamp, lower_bound_value, lower_bound_type}` (`proto/blockchain.proto:137-141`) carries the upper bound, and `LowerBoundEvent.lower_bounds` (`proto/blockchain.proto:373`) transports it.

```diff
@@ before message LowerHeightSelector @@
+// Matches nodes whose bound of `lower_bound_type` covers `height`.
+// For lower bound types the node must have `lower bound <= height`.
+// For UPPER_BOUND_PROOF the meaning is inverted: the node must have
+// `predicted upper bound >= height`.
 message LowerHeightSelector {
```

Selector shape is unchanged (`proto/blockchain.proto:291-296`): `height`, `lower_bound_type`, `time_offset`, `height_delta`.

## 2. Applied change: `pkg/methods/specs/eth-json-rpc.json`

```diff
@@ methods, before debug_storageRangeAt @@
+    {
+      "name": "debug_proofsSyncStatus",
+      "group": "debug",
+      "params": [],
+      "settings": {
+        "cacheable": false
+      }
+    },
     {
       "name": "debug_storageRangeAt",
```

Spec-format notes:

- The method spec format has no result schema and no "requires block tag" flag. Absence of `tag-parser` *is* "no block tag" (`docs/method-specs.md:103-121`).
- `cacheable: false` is explicit because the default is `true` (`docs/method-specs.md:79`).
- `MethodData` has no `params` field (`pkg/methods/data.go:46-51`), so `"params": []` is ignored on load; it is kept only to match the neighbouring `debug_*` entries.
- `group` is a free string, not an enum (`pkg/methods/method_groups.go:9-30`), so `debug` needs no registration.

Verified after the change: `specs.NewMethodSpecLoader().Load()` then `specs.GetSpecMethod(spec, "debug_proofsSyncStatus")` returns a method with `enabled=true cacheable=false` for specs `eth`, `eth-json-rpc` and `optimism`.

## 3. op-reth source verification — the contract's encoding claim is wrong

Source: `ethereum-optimism/optimism`, `rust/op-reth/crates/rpc/src/debug.rs:44-68` (declaration) and `:329-343` (implementation).

Method name and namespace confirmed:

```rust
#[cfg_attr(not(test), rpc(server, namespace = "debug"))]
pub trait DebugApiOverride<Attributes> {
    #[method(name = "proofsSyncStatus")]
    async fn proofs_sync_status(&self) -> RpcResult<ProofsSyncStatus>;
}
```

jsonrpsee concatenates namespace and method name, so the wire method is exactly `debug_proofsSyncStatus`. There is no `rename_all`.

Result type:

```rust
#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq)]
pub struct ProofsSyncStatus {
    earliest: Option<u64>,
    latest: Option<u64>,
}
```

Consequences that differ from the cross-repo contract text:

1. **`earliest` and `latest` are JSON numbers, not hex quantities.** The fields are plain `Option<u64>` with a default serde derive: no `alloy_primitives::U64`, no quantity wrapper, no `serde_with` hex. The docs page writes `<block>`, which is ambiguous; the source resolves it as decimal.
2. **Both fields are nullable.** `Err(OpProofsStorageError::NoBlocksFound)` maps to `ProofsSyncStatus { earliest: None, latest: None }`, i.e. `{"earliest":null,"latest":null}`. Any other storage error becomes a JSON-RPC internal error.
3. Exposure requires the `debug` namespace in `--http.api`/`--ws.api`. Registration goes through `ctx.modules.replace_configured(debug_ext.into_rpc())` in `rust/op-reth/crates/node/src/proof_history.rs:106-120`. `[INFERENCE]` on the exact gating semantics: `replace_configured` lives in an un-vendored upstream reth crate and was not read.
4. First version documented with historical proofs v2 is op-reth v2.2.3. The introducing commit was not confirmed by `git log` (shallow clone).

Action for the parsers, not for this repo: the nodecore detector must parse decimal numbers and treat `null` as "no proof window", not as block 0. Publishing `earliest=0`/`latest=0` from a `null` response would make every provider look like it covers block 0 and would poison routing.

Nothing in this repo encodes the result shape, so item 1 changes no file here. It is recorded because the contract text says "hex quantities".

## 4. Regeneration steps

The emerald protos are generated with `protoc`, not `buf` (`Makefile:24-39`).

```
PATH=<dir with pinned plugins>:$PATH make dshackle-proto-gen
```

Plugin versions must match the committed output headers, otherwise the diff fills with unrelated churn:

- `protoc-gen-go v1.36.12` — `pkg/dshackle/blockchain.pb.go:3`, and the same version is in `go.mod:19` (`google.golang.org/protobuf v1.36.12`, with `tool google.golang.org/protobuf/cmd/protoc-gen-go` at `go.mod:57`).
- `protoc-gen-go-grpc v1.6.1` — `pkg/dshackle/blockchain_grpc.pb.go:3`. Not pinned anywhere in `go.mod`; install it explicitly.
- `protoc v7.35.1` = `libprotoc 35.1`.

```
GOBIN=/tmp/pbbin go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.36.12
GOBIN=/tmp/pbbin go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.6.1
PATH=/tmp/pbbin:$PATH make dshackle-proto-gen
go fmt ./pkg/dshackle/
```

Two gotchas seen while doing it:

- The `dshackle-proto-gen` target does not run `gofmt` (unlike the `%-proto-gen` buf rule at `Makefile:16-18`), so run `go fmt ./pkg/dshackle/` after it. Use the Go 1.27 toolchain's `gofmt`; an older `gofmt` on `PATH` leaves the file unformatted.
- Regeneration rewrites seven struct-field doc comments from `// *` to `//*` in `pkg/dshackle/blockchain.pb.go`. That churn is unrelated to this change and was reverted to keep the diff to the enum. Whoever regenerates next should do the same or fix it repo-wide in a separate commit.

Resulting generated diff (only `blockchain.pb.go`; the gRPC stub is untouched because no service changed):

- `LowerBoundType_UPPER_BOUND_PROOF LowerBoundType = 11` in the const block.
- `11: "UPPER_BOUND_PROOF"` in `LowerBoundType_name`.
- `"UPPER_BOUND_PROOF": 11` in `LowerBoundType_value`.
- the new `LowerHeightSelector` doc comment.
- two `file_blockchain_proto_rawDesc` lines.

## 5. Version bump and release

Latest tag is `v1.2.1`. Consumers lag behind it:

- nodecore: `github.com/drpcorg/public v1.1.0` (nodecore `go.mod:16`, `go.sum:75-76`).
- dproxy: `github.com/drpcorg/public v1.0.0` (dproxy `go.mod:30`), no `replace`, no vendored copy.

Release is a semver tag on `main` (`README.md:273-280`):

```
git tag v1.3.0
git push origin v1.3.0
```

`v1.3.0`, minor: the change is additive (one enum value, one method spec entry), no field, message, service or existing enum value changed.

Consumer upgrades after the tag exists:

```
# nodecore and dproxy
go get github.com/drpcorg/public@v1.3.0
```

Order of merges: this repo and its tag first, then nodecore (publishes both bounds and the label), then aggregator, then dproxy.

## 6. Compatibility

Adding `UPPER_BOUND_PROOF = 11` is backward compatible for both Go consumers. Both use hand-written switches over the generated enum, and both fail soft.

**nodecore** — old binary, new value inbound:

- `mapDshackleLowerBoundType` (nodecore `internal/server/emerald/selector_mapper.go:124-148`) switches over the ten values it knows and returns `(protocol.UnknownBound, false)` in `default`.
- The caller (nodecore `internal/server/emerald/selector_mapper.go:112-115`) turns `ok == false` into `protocol.RequestUnsupportedSelector{Reason: fmt.Sprintf("lower bound type %s is not supported", selector.GetLowerBoundType().String())}`.
- So an old nodecore receiving a selector with `UPPER_BOUND_PROOF` rejects that one selector with a reason string. No panic, no connection error. It does not silently route as if the constraint were satisfied, and it does not map the value to `UNSPECIFIED` on this path.
- Outbound, `lowerBoundTypeToApi` (nodecore `internal/server/emerald/chain_event_mapper.go:131-156`) returns `LOWER_BOUND_UNSPECIFIED` in `default`, so a nodecore that gains an internal upper-bound type before its mapper is updated would publish `UNSPECIFIED` silently. Both switches must be extended in the same nodecore change.

**dproxy** — old binary, new value inbound:

- `mapLowerBoundType` (dproxy `pkg/lower_data/lower_data.go:184-206`) has `case dshackle.LowerBoundType_LOWER_BOUND_UNSPECIFIED: return Unknown` and `default: return Unknown`, so value 11 becomes `lower_data.Unknown` with no error and no log.
- `LowerBoundTypeFromString` (dproxy `pkg/lower_data/lower_data.go:48-70`) also returns `Unknown` in `default`; that path parses config strings, not the wire.
- Outbound, `LowerHeightSelector.MapToRequest` (dproxy `pkg/typedrpc/selectors.go:35-70`) has no `default` case and leaves `tp` at its initializer `dshackle.LowerBoundType_LOWER_BOUND_BLOCK` (dproxy `pkg/typedrpc/selectors.go:37`). An internal type that is not wired up is therefore sent as a **block** bound, not as unspecified. Whoever adds the dproxy side must add the case, not rely on the fallthrough.

No consumer rejects the unknown enum value with a hard error. One deviation from the contract's wording: nodecore's inbound path answers "unsupported selector" rather than mapping the value to `UNSPECIFIED`.

**dshackle (Kotlin)** was not inspected in this pass. Protobuf-JVM keeps unknown enum values as `UNRECOGNIZED`, and calling `.getNumber()` on `UNRECOGNIZED` throws, so the JVM side needs its own check before nodecore starts emitting the new value to it. `[INFERENCE]` — not verified against the dshackle source.

**Method spec entry**: adding `debug_proofsSyncStatus` to `eth-json-rpc.json` has no automatic effect on dproxy. dproxy never imports `github.com/drpcorg/public/pkg/methods`; its method catalog is hand-written Go (dproxy `pkg/typedrpc/methods.go`, `calls.go`, `groups.go`, `chain_tag_extractor.go`). Exposing the method to end users needs an explicit dproxy change, so item 4 of the strategy (public method) stays a product decision with a separate code change, and the spec entry alone exposes nothing.

For nodecore the spec entry is a prerequisite, not a trigger: `hasMethod` uses `specs.GetSpecMethod(specName, methodName) != nil` (nodecore `internal/upstreams/chains_specific/evm_specific/evm_chain_specific.go:154-161`), and the proof lower-bound detector is already gated on `hasMethod("eth_getProof")` there (`:148-150`). A `debug_proofsSyncStatus` detector can be gated the same way only after this spec entry ships in a tagged version.

The `historical_proofs=true` label needs no change in this repo and no code change in nodecore: `Label{name, value}` is a free key/value pair (`proto/blockchain.proto:243-246`), and `LabelsToApi` (nodecore `internal/server/emerald/chain_event_mapper.go:20-41`) copies labels one-to-one with no name special-casing.

## 7. Verification performed

- `go test -race -p 8 ./...` — all packages pass (`pkg/cosmos`, `pkg/descriptors`, `pkg/methods` ok; the rest have no test files).
- Spec load smoke test: `debug_proofsSyncStatus` resolves in specs `eth`, `eth-json-rpc`, `optimism` with `enabled=true`, `cacheable=false`.
- Generated diff reviewed line by line; `blockchain_grpc.pb.go` unchanged.
- `make lint` not run: `golangci-lint` is not installed here.

## 8. Out of scope for this repo

nodecore detector and label, aggregator capability `has_historical_proofs`, dproxy routing, removal of the `eth_getProof` per-chain hacks (dproxy `pkg/balancing/balancer.go:1344-1390`, dproxy `pkg/typedrpc/selectors.go:165-176`) and the Redis proof cache (dproxy `pkg/proof_cache/`). This repo only ships the contract.

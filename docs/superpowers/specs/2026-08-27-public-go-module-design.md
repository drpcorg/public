# Turning `drpcorg/public` into a Go module

Date: 2026-08-27
Status: approved, not yet implemented

## Goal

Make `github.com/drpcorg/public` a Go module that is the single source of truth for
three things this repository's consumers share today through three different mechanisms:

1. the chain registry data (`chains.yaml`, `chains-meta.yaml`, `compatible-clients.yaml`)
2. the blockchain RPC method specs and their loader, currently in `drpcorg/method-specs`
3. the emerald/dshackle gRPC protos and their generated Go stubs, currently in
   `drpcorg/emerald-grpc` and regenerated independently by each consumer

This document covers the work **in this repository only**. Migrating consumers onto the
module is deliberately out of scope; see "Follow-up work" at the end.

## Why

### The same data is delivered three different ways

This repository is consumed as a git submodule, mounted inside the consumer's own module
tree. The method specs are a separate Go module. The gRPC protos are a third repository,
from which each consumer regenerates its own copy of the Go stubs with its own `protoc`
invocation — invocations that differ from one another only in the `M`-flag module path.

The consequence is duplicated effort with no mechanism keeping the copies honest: each
consumer carries its own generated stubs, its own submodule pin, and its own parser over
the same embedded YAML.

### `chains.yaml` and `common.proto` are one dataset in two repos

`chains.yaml`'s `grpcId` and `common.proto`'s `ChainRef` are the same numbering, kept in
lockstep by hand:

```
common.proto                       chains.yaml
CHAIN_MOVA__MAINNET_V2  = 1173      grpcId: 1173   (line 3868)
CHAIN_STELLAR__MAINNET  = 1174
CHAIN_CELESTIA__MAINNET = 1175      grpcId: 1175   (line 4432)
CHAIN_CELESTIA__MOCHA   = 10209     grpcId: 10209  (line 4438)
```

`drpcorg/emerald-grpc`'s git log mirrors this repository's commit for commit — "Add sui",
"add celestia", "Stellar", "add mova-mainnet-v2" all appear in both as separate PRs.
Counts already differ (350 `grpcId`s vs 367 `ChainRef` values); some of that is
legitimately reserved or retired entries, but nothing enforces the correspondence.

### Adding `go.mod` here is not additive

`embed.go` (`package public`, no `go.mod`) compiles today as part of *the consumer's*
module, because this repository is mounted as a submodule inside that module's tree. That
is why `go.mod` was added and then removed in December 2025 (`a8be0e6` → `9db7079`): a
nested `go.mod` makes Go exclude the directory from the parent module's build.

Consequence: once `go.mod` lands here, a consumer must drop its submodule and switch to a
versioned `require` in one atomic commit. Since consumer migration is out of scope for
this change, **adding `go.mod` here breaks nothing immediately** — existing submodules
keep resolving to the commits they are pinned to, and a consumer only meets the change
when it deliberately moves its pin past this commit. That is the reason to land this
repository's work first and separately.

## Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Package scope | Byte accessors + method specs + dshackle stubs. No `chains.yaml` parser. | Consumers keep their own parsers for now; unifying the drifted resolved-chain types is a separate project. |
| Runtime config delivery | Unchanged. Consumers that fetch `compatible-clients.yaml` over HTTP with hot reload keep doing so. | Zero operational regression. The module is the source of truth for shape and specs, not for delivery. |
| Versioning | Manual semver tags, as `method-specs` does today. Start at `v1.0.0`. | Deliberate releases. `go get github.com/drpcorg/public@main` is the escape hatch when a chain is needed before someone tags. |
| `method-specs` migration | Plain file copy, no history merge. | Only 3 commits there, and the meaningful history of `pkg/methods` predates that repository. |
| `drpcorg/method-specs` repo | Left alive and untouched. Not archived, not shimmed. | Revisit after consumers migrate. |
| emerald protos | Copied in; this repository becomes the source of truth. | Collapses the `grpcId`/`ChainRef` two-PR problem. Cost accepted, see Risks. |
| `CODEOWNERS` | Left untouched. | The new Go and proto paths get no owner entry. |
| New CI tests | None. | Explicitly declined. |
| Consumer changes | None in this change. | Tracked separately, outside this repository. |

## Target layout

```
github.com/drpcorg/public                      module, go 1.27.0
├── embed.go                     package public  — UNCHANGED
├── chains.yaml, chains-meta.yaml, compatible-clients.yaml
├── chains.yamale.yaml, chains-meta.yamale.yaml, compatible-clients.yamale.yaml
├── icons/, top-banner/, get-meta/              untouched
├── proto/                       NEW — copied from drpcorg/emerald-grpc@12bacf3
│   ├── auth.proto  blockchain.proto  common.proto  insights.proto
│   └── market.proto  monitoring.proto  transaction.proto  transaction.message.proto
├── chain-apis/
│   ├── sui/                     submodule, MystenLabs/sui-apis (pinned)
│   └── sui.gen.yaml
├── pkg/
│   ├── methods/                 package specs      — copied from method-specs
│   ├── sui/                     package sui        — copied, generated
│   └── dshackle/                package dshackle   — NEW, generated
├── docs/
├── Makefile, go.mod, go.sum, .gitattributes, .gitmodules
├── README.md, CODEOWNERS, .gitignore        (CLAUDE.md is local, gitignored)
└── .github/
    ├── workflows/  yaml-lint.yml (existing) + lint.yml + test.yml (copied)
    └── actions/setup-go-project/action.yml (copied)
```

`embed.go` stays byte-for-byte as it is. Its three accessors —
`GetChainConfig()`, `GetChainMeta()`, `GetCompatibleClients()` — are already what
consumers call, so migration is an import-path swap rather than an API change.

Protos live at `proto/` rather than `proto/emerald/`: their imports are unqualified
(`import "common.proto"`), so the protoc include path must point straight at the
directory holding them, and mirroring the upstream layout keeps any future consumer
repoint to a one-line change.

## Work item 1 — copy method-specs in

Source: `drpcorg/method-specs`, `git ls-files` (162 tracked files).

Copied verbatim:

- `pkg/` — 148 files (`pkg/methods/`, `pkg/sui/`)
- `Makefile`
- `go.mod`, `go.sum`
- `.gitattributes` (`pkg/sui/*.pb.go linguist-generated=true`)
- `chain-apis/` — `sui.gen.yaml` plus the `sui` submodule gitlink
- `.gitmodules` — the `chain-apis/sui` entry
- `.github/workflows/lint.yml`, `.github/workflows/test.yml`,
  `.github/actions/setup-go-project/action.yml`

Merged rather than copied:

- `README.md` — add a "Go packages" section to this repository's existing README; do not
  overwrite it.
- `.gitignore` — add `.env`, `docs/superpowers/plans/` and `CLAUDE.md` to the existing
  `.idea/ .vscode/ node_modules .DS_Store`, matching `method-specs`.
- `CLAUDE.md` — gitignored, as in `method-specs`. Write a local one covering both the
  data files and the Go packages; it is not tracked.

**Scrubbed before copying.** `method-specs` tracks two files under `docs/`
(`method-specs.md` and `docs/superpowers/specs/2026-08-26-method-specs-extraction-design.md`),
and its `README.md` reads the same way: all of them discuss the extraction in terms of
named internal services, their file paths and their environment variables. This
repository is public. Copy `docs/method-specs.md` for the spec format reference, but
review and rewrite those references first, and leave the extraction design document
behind — its subject matter is entirely the internal history it would be disclosing.
Apply the same review to anything quoted into the new `README.md` and `CLAUDE.md`.

Not copied: `.idea/`.

`go.mod` changes:

- module path → `github.com/drpcorg/public`
- `go 1.27.0` unchanged — it already matches every consumer, so there is no toolchain
  friction
- existing requires unchanged, `tool google.golang.org/protobuf/cmd/protoc-gen-go` kept
- `go mod tidy` afterwards

## Work item 2 — repoint the sui codegen

`chain-apis/sui.gen.yaml` hardcodes `github.com/drpcorg/method-specs/pkg/sui` in two
places (the managed-mode `go_package` override and the `module=` plugin opt). Both become
`github.com/drpcorg/public/pkg/sui`.

Then regenerate with `make sui-proto-gen`, which needs `buf` on PATH (1.72.0 present)
and the `chain-apis/sui` submodule checked out. Both are available, so `pkg/sui` is
regenerated as part of this work rather than carried over with a stale path.

**Do not sed the generated `.pb.go` files** if regeneration is ever skipped. The import
path sits inside each file's serialized `FileDescriptorProto`, so a text substitution
corrupts the length prefixes — repoint the template and regenerate instead. (A stale
`go_package` would in any case be cosmetic: the Go package clause is `package sui`, all
generated files live in one Go package, and `go_package` is read by `protoc-gen-go` at
generation time, never at runtime.)

## Work item 3 — bring in the emerald protos

Copy the 8 `.proto` files from `drpcorg/emerald-grpc` at `origin/master` = `12bacf3`
("Add sui (#171)") into `proto/`. Note the default branch there is `master`, not `main`,
and that the two remotes seen in the wild (`p2p-org/…` and `drpcorg/…`) are the same
repository.

`emerald-grpc`'s `embed.go` (`package emerald_grpc`, `GetProtoEmbedded() fs.FS`) is
**not** copied. Nothing consumes it; consumers read the protos from a working tree at
generation time.

## Work item 4 — generate the dshackle stubs

Use `protoc`, not `buf`, even though `buf` is now available. Two reasons that stand on
their own: it mirrors the `dshackle-proto-gen` target consumers already run, and it keeps
the generated output maximally comparable to the copies they have committed — which is
what makes the equivalence check in Verification meaningful. Switching these protos to
`buf` would put a codegen change and a repository move in the same step. `buf` stays
confined to the sui protos; revisit unifying on it once consumers have migrated.

New explicit Makefile target, alongside the existing generic `%-proto-gen` rule (which
remains buf-based and serves `chain-apis/*.gen.yaml`):

```make
.PHONY: dshackle-proto-gen
dshackle-proto-gen:
	mkdir -p pkg/dshackle
	protoc -I ./proto \
		--proto_path=proto \
		--go_out=pkg/dshackle \
		--go-grpc_out=pkg/dshackle \
		--go_opt=paths=source_relative \
		--go_opt=Mblockchain.proto=github.com/drpcorg/public/pkg/dshackle \
		--go_opt=Mcommon.proto=github.com/drpcorg/public/pkg/dshackle \
		--go_opt=Mauth.proto=github.com/drpcorg/public/pkg/dshackle \
		--go-grpc_opt=paths=source_relative \
		--go-grpc_opt=Mblockchain.proto=github.com/drpcorg/public/pkg/dshackle \
		--go-grpc_opt=Mcommon.proto=github.com/drpcorg/public/pkg/dshackle \
		--go-grpc_opt=Mauth.proto=github.com/drpcorg/public/pkg/dshackle \
		blockchain.proto common.proto auth.proto
```

Identical to the target consumers use today except `-I ./proto` and the three `M`-flag
module paths. Same target name, so muscle memory carries over. It generates the same
three protos they generate and no more; the other five are committed but ungenerated, and
adding one is a line in this target.

`go.mod` gains one require: `google.golang.org/grpc`, because the generated
`*_grpc.pb.go` files import it. No new `tool` directive — the plugins come from PATH,
exactly as they do today.

Optional hardening, not part of this change: `method-specs` pins `protoc-gen-go` through
a `go.mod` `tool` directive so the generator and the protobuf runtime cannot drift. PATH
currently agrees with `go.mod` — `protoc-gen-go v1.36.12` against `protobuf v1.36.12` —
so there is nothing to fix today, but nothing enforces that either, and the PATH copy of
`protoc-gen-go-grpc` (1.6.1) has no `go.mod` counterpart at all. Pinning both plugins
would mean building them into a temp dir and prepending it to `PATH` in the target. Worth
doing if generated-code churn ever appears in a diff for no reason; deliberately skipped
now to keep the target identical to the one that already works.

## Work item 5 — CI and release

`.github/workflows/lint.yml` and `test.yml` are copied as-is and run alongside the
existing `yaml-lint.yml` on every PR. No path filters to start with: there have been zero
icon-only commits to `main` in 90 days (23 commits, 9 authors), and the Go jobs are fast.
Add filters later if data contributors find Go CI in their way.

`golangci-lint` is pinned to v2.13.1 inside the workflow; `method-specs` has no
`.golangci.yml`, so the defaults carry over.

Release: manual `git tag v1.0.0 && git push origin v1.0.0` once the module builds green.
This repository has no tags today, so there is no collision with `method-specs`' own
`v1.0.0`.

## Verification

No new tests were requested, so verification is a checklist run at implementation time:

1. `go build ./...`
2. `make test` (`go test -race -p 8 ./...`) — the suite copied from `method-specs`
3. `make lint`
4. `go mod tidy` leaves the file unchanged
5. yamale still green: `yamale -s chains.yamale.yaml chains.yaml` and the two others
6. `make dshackle-proto-gen` and `make sui-proto-gen` each reproduce their committed
   output with no diff. The sui run needs the `chain-apis/sui` submodule checked out
   (`git submodule update --init`).
7. **Equivalence check for the dshackle stubs.** Diff the generated
   `pkg/dshackle/{auth,blockchain,common}.pb.go` and `{auth,blockchain}_grpc.pb.go`
   against the copies consumers already have committed. Differences must be confined to
   the `go_package` and import-path lines. This is what proves the change is a no-op
   before anyone migrates. One-off manual check, not a committed test.

## Risks

**Three edits per chain until the JVM consumer repoints.** This repository becomes the
source of truth for the protos, but the JVM consumer keeps reading `emerald-grpc` until
it is repointed. In that window, adding a chain touches `chains.yaml`,
`proto/common.proto` *and* `emerald-grpc/proto/common.proto` — one more than today.
Mitigation: make the repoint the first follow-up, and until then treat `proto/` here as
authoritative and sync `emerald-grpc` from it, never the reverse, so there is one
direction of truth.

**Duplicate proto registration panics.** `blockchain.proto`, `common.proto` and
`auth.proto` register in `protoregistry.GlobalFiles` under bare filenames, and the sui
protos under `sui/rpc/v2/*.proto`. Any binary that links two generated copies of the same
proto file panics at init. This does not affect the present change — nothing new imports
`pkg/dshackle` yet — but it is what makes each consumer's migration necessarily atomic.

**This module now pulls in grpc.** Anything depending on it for `chains.yaml` alone
inherits `google.golang.org/grpc` in its module graph. Every current consumer already has
it, so the practical cost is nil today. If something ever wants only the data, the answer
is to split `pkg/dshackle` into a nested module, not to undo this.

**Go CI becomes a gate for data contributors.** Chain-data PRs from people who do not
write Go can now be blocked by a Go lint or test failure. Accepted; revisit with path
filters if it bites.

**No guard on `grpcId` ↔ `ChainRef`.** Declined for now. The two datasets sit in one
repository after this change, which makes drift visible in review but still does not
enforce it.

## Follow-up work, explicitly out of scope

- Migrate each Go consumer off its submodule and onto a versioned `require`, dropping its
  own generated stubs in the same atomic commit. Tracked outside this repository.
- Repoint the JVM consumer's proto source here, closing the three-edits-per-chain window.
- Unify the `chains.yaml` parsers. Each consumer carries its own merge and settings
  resolution, and their resolved-chain types have already drifted apart.
- Enforce the `grpcId` ↔ `ChainRef` correspondence in CI.
- Decide the fate of `drpcorg/method-specs` and `drpcorg/emerald-grpc` once nothing reads
  them.

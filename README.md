# Public configuration files

This README provides a comprehensive overview of the configuration files required for the functioning of rpc system.

## Table of Contents

- [Chain Settings Configuration](#chain-settings-configuration)
  - [Protocols](#protocols)
  - [Chain Details](#chain-details)
  - [Settings](#settings)
  - [Meta data](#meta-data)
- [Compatible clients list](#clients-compatibility-list)
  - [Blacklisting](#blacklisting)
  - [Whitelisting](#whitelisting)
- [Chain meta](#chain-meta)

# Chain Settings Configuration

The first of these files is `chains.yaml`, which specifies the settings for different blockchain protocols and their respective chains.

## Protocols

Each protocol section defines settings for a specific blockchain protocol, including protocol-specific parameters and a list of chains associated with that protocol.

### Example Structure

```yaml
protocols:
  - id: protocol1
    label: Protocol 1
    type: type1
    settings:
      parameter1: value1
      parameter2: value2
    chains:
      - id: mainnet
        priority: 100
        chain-id: chain-id1
        short-names: [shortname1, shortname2]
        code: CODE1
        grpcId: 1
      - id: testnet
        priority: 1
        chain-id: chain-id2
        short-names: [shortname3]
        code: CODE2
        grpcId: 2
  - id: protocol2
    label: Protocol 2
    type: type2
    settings:
      parameter3: value3
      parameter4: value4
    chains:
      - id: mainnet
        priority: 50
        chain-id: chain-id3
        short-names: [shortname4]
        code: CODE3
        grpcId: 3
```

### Field Descriptions

| Field      | Description                                  |
| ---------- | -------------------------------------------- |
| `id`       | Identifier for the protocol.                 |
| `label`    | Human-readable name for the protocol.        |
| `type`     | Type of the blockchain protocol.             |
| `settings` | Specific settings for the protocol.          |
| `chains`   | List of chains associated with the protocol. |

## Chain Details

Each chain under a protocol defines specific parameters and settings unique to that chain. These settings ensure that each chain operates correctly within the context of its protocol. As usual chains are mainnet and all testnets of that protocol.

### Example Structure

```yaml
chains:
  - id: chain-mainnet
    priority: 100
    chain-id: chain-id1
    short-names: [shortname1, shortname2]
    code: CODE1
    grpcId: 1
  - id: chain-testnet
    priority: 1
    chain-id: chain-id2
    short-names: [shortname3]
    code: CODE2
    grpcId: 2
```

### Field Descriptions

| Field         | Description                                                    |
| ------------- | -------------------------------------------------------------- |
| `id`          | Identifier for the chain.                                      |
| `priority`    | Priority of the chain. Used in UIs.                            |
| `chain-id`    | Identifier for the chain. Different types in different chains. |
| `short-names` | List of short names for the chain.                             |
| `code`        | Code used to identify the chain.                               |
| `grpcId`      | gRPC identifier for the chain from api module                  |
| `settings`    | Specific settings for the chain.                               |

## Settings

The settings section contains parameters that apply to specific chain. Global parameters located at top level as default, then more specific parameters defined in protocol section and last one could be specified on each chain separately. Chain settings overrides protocol settings, protocol settings overrides default settings.

```yaml
settings:
  expected-block-time: 1s
  options:
    validate-peers: false
  lags:
    syncing: 40
    lagging: 20
```

### Field Descriptions

| Field                        | Description                                 |
| ---------------------------- | ------------------------------------------- |
| `expected-block-time`        | Default expected time for block generation. |
| `lags.syncing`               | Number of blocks considered for syncing.    |
| `lags.lagging`               | Number of blocks considered for lagging.    |
| `options.validate-peers`     | Enable validation of peers for chains       |
| `options.validate-syncing`   | Enable validation of syncing state          |
| `options.disable-validation` | Disable all validations                     |

## Meta data

### Icons

Icons are stored in the `/icons` directory. To add a new icon, place a `.svg` or `.png` file into the `/icons` folder. Ensure the filename corresponds to the identifier for the protocol.

Next, register the icon in the Icons map within the `/icons/getChainIcon.ts` file.

**Example:**

```typescript
import Ethereum from "./Ethereum.svg";

const Icons: Record<string, React.ComponentType> = {
  // existing icons
  ethereum: Ethereum,
  // add new icons here
};
```

If you are adding or modifying an .svg icon, ensure to compress it using [SVGOMG](https://jakearchibald.github.io/svgomg/).

### Descriptions

Each chain's description is displayed on the `https://drpc.org/chainlist/*` pages (e.g., https://drpc.org/chainlist/ethereum). To add a description for a new chain, insert the corresponding text into the `CHAIN_DESCRIPTION` map in the `./chain_descriptions.tsx` file.

# Clients compatibility list

File `compatible-clients.yaml` describes compatible clients of blockchains for drpc. It contains of list of clients, optional list of chains and enumeration of allowed or disallowed versions of clients.

Each chain could accept or discard new clients and it should be specified in chains.yaml (tbd)

Example:

```yaml
rules:
  - client: erigon
    networks:
      - ethereum
    blacklist:
      - v2.40.0
```

## Blacklisting

The first, default mode is blacklisting. In case client have non compatible versions, it should be specified as blacklist:

```yaml
rules:
  - client: client_with_blacklist
    blacklist:
      - v1
      - v2
      - v4
```

This means that all clients except v1, v2, and v4 are allowed for usage.

## Whitelisting

The second mode is whitelisting. In case there are specified white list - all other versions become gray. Gray versions means it could be used in tests but not in production requests. Therefore all new versions adds to graylist and could be manually added to white or black list.

```yaml
rules:
  - client: client_with_whitelist
    whitelist:
      - v3
    blacklist:
      - v1
      - v2
```

# Chain meta

chains-meta.yaml is autogenerated file that contains additional information about ethereum-like chains - currency and links to explorers.

To regenrate this file you can run tool from get-meta folder.

# Go module

This repository is also a Go module, `github.com/drpcorg/public`. Alongside the
configuration files documented above it ships the blockchain RPC method specs
and the generated protobuf types.

| Import path | Package | Contents |
| --- | --- | --- |
| `github.com/drpcorg/public` | `public` | `GetChainConfig()`, `GetChainMeta()`, `GetCompatibleClients()` — the three YAML files above, embedded, returned as bytes. |
| `github.com/drpcorg/public/pkg/methods` | `specs` | `specs/*.json` (embedded), the loader (`NewMethodSpecLoader().Load()`) and the lookup helpers (`GetSpecMethod`, `IsSubscribeMethod`, …). |
| `github.com/drpcorg/public/pkg/dshackle` | `dshackle` | Generated message types and gRPC stubs for `blockchain.proto`, `common.proto` and `auth.proto` from `proto/`. |
| `github.com/drpcorg/public/pkg/sui` | `sui` | Generated `sui.rpc.v2` message types from the `chain-apis/sui` submodule (MystenLabs/sui-apis). Importing it registers the descriptors in `protoregistry.GlobalFiles`. |
| `github.com/drpcorg/public/pkg/cosmos` | `cosmos` | Blank imports of every package behind `cosmos-grpc` — `cosmossdk.io/api` for `cosmos.*`, plus `pkg/ibc` and `pkg/cosmwasm`. Importing it registers all of their descriptors in `protoregistry.GlobalFiles`. |
| `github.com/drpcorg/public/pkg/ibc` | per proto package | Generated `ibc.*` message types from `cosmos/ibc-go` (tagged release). Reached through `pkg/cosmos`; import directly only if you need the types. |
| `github.com/drpcorg/public/pkg/cosmwasm` | per proto package | Generated `cosmwasm.wasm.v1` message types from `CosmWasm/wasmd` (tagged release). Same. |

## Using it

```go
import (
	"github.com/drpcorg/public"
	specs "github.com/drpcorg/public/pkg/methods"
)

func main() {
	if err := specs.NewMethodSpecLoader().Load(); err != nil {
		log.Fatal(err)
	}
	chains := public.GetChainConfig()
	_ = chains
}
```

`Load()` fills a package-level registry. Call it once at startup; it is not safe
to call concurrently, and two independent callers in one binary overwrite each
other. To serve extra or overriding specs from a directory, pass it with
`specs.NewMethodSpecLoaderWithExtraFs(os.DirFS(path))`. The library reads no
environment variables itself.

Spec format: [docs/method-specs.md](docs/method-specs.md).

## Chain ids in two places

A chain's numeric id appears twice: as `grpcId` in `chains.yaml` and as a
`ChainRef` enum value in `proto/common.proto`. They are the same numbering, and a
new chain needs both entries with the same number. Nothing enforces this yet.

## Development

```
make test                # go test -race -p 8 ./...
make lint                # golangci-lint run ./...
make dshackle-proto-gen  # regenerate pkg/dshackle from proto/ (needs protoc)
make sui-proto-gen       # regenerate pkg/sui from chain-apis/sui (needs buf)
make ibc-proto-gen       # regenerate pkg/ibc from the pinned ibc-go tag (needs buf)
make cosmwasm-proto-gen  # regenerate pkg/cosmwasm from the pinned wasmd tag (needs buf)
```

Clone with `--recursive` (or run `git submodule update --init`) if you need to
regenerate the sui protos; the ibc and cosmwasm templates pull their sources by
git tag and need network instead. Builds and tests use the committed output and
need none of it.

## Releasing

A release is a semver tag pushed to `main`:

```
git tag vX.Y.Z
git push origin vX.Y.Z
```

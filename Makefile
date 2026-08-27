.PHONY: lint
lint:
	golangci-lint run ./...

.PHONY: test
test:
	go test -race -p 8 ./...

# One pattern rule serves every vendored chain API: per-chain differences
# (proto root inside the vendor repo, subtree to generate, output path) live
# in chain-apis/<chain>.gen.yaml, never here. `make sui-proto-gen` today; a
# future chain adds its submodule + yaml and its target already works.
# Needs `buf` on PATH; protoc-gen-go comes from go.mod (tool directive).
%-proto-gen:
	buf generate --template chain-apis/$*.gen.yaml
	gofmt -w pkg/$*

# The emerald protos are owned by this repo (proto/), not vendored, and are
# generated with protoc rather than buf: this mirrors the target consumers ran
# before the move, which keeps the output diffable against the copies they
# already have committed.
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

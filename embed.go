package public

import _ "embed"

//go:embed chains.yaml
var chainConfig []byte

//go:embed chains-meta.yaml
var chainMeta []byte

//go:embed compatible-clients.yaml
var compatibleClients []byte

func GetChainConfig() []byte {
	return chainConfig
}
func GetChainMeta() []byte {
	return chainMeta
}
func GetCompatibleClients() []byte {
	return compatibleClients
}

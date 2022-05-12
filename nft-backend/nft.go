package nft

// Nft Struct (Model)
type NftItem struct {
	Id          string        `json:"id"`
	name        string        `json:"name"`
	description string        `json:"description"`
	image       string        `json:"image"`
	edition     int           `json:"edition"`
	attributes  []*Attributes `json:"attributes"`
}

// Nft Attributes
type Attributes struct {
	trait_type string
	value      string
}

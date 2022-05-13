package nft

import "go.mongodb.org/mongo-driver/bson/primitive"

// Nft Struct (Model)
type NftItem struct {
	Id          primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	name        string             `json:"name,omitempty" bson:"name,omitempty"`
	description string             `json:"description,omitempty" bson:"description,omitempty"`
	image       string             `json:"image bson:"image,omitempty""`
	edition     int                `json:"edition bson:"edition,omitempty""`
	attributes  []*Attributes      `json:"attributes bson:"attributes,omitempty""`
}

// Nft Attributes
type Attributes struct {
	trait_type string `json:"trait_type,omitempty" bson:"trait_type,omitempty"`
	value      string `json:"value,omitempty" bson:"value,omitempty"`
}

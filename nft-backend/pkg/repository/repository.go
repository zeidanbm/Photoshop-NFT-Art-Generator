package repository

import (
	"github.com/zeidanbm/nft-backend"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type NftItem interface {
	GetItem(id primitive.ObjectID) (nft.NftItem, error)
	GetItems(pageNumber int64, nPerPage int64) ([]nft.NftItem, error)
}

type Repository struct {
	NftItem
}

func NewRepository(db *mongo.Database) *Repository {
	return &Repository{
		NftItem: NewNftItemMongo(db),
	}
}

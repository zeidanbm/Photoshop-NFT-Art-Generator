package repository

import "go.mongodb.org/mongo-driver/mongo"

type NftItem interface {
}

type Repository struct {
	NftItem
}

func NewRepository(db *mongo.Database) *Repository {
	return &Repository{}
}

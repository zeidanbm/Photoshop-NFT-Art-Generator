package repository

import (
	"context"
	"time"

	"github.com/sirupsen/logrus"
	"github.com/zeidanbm/nft-backend"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type NftItemMongo struct {
	db *mongo.Database
}

func NewNftItemMongo(db *mongo.Database) *NftItemMongo {
	return &NftItemMongo{db: db}
}

func (r *NftItemMongo) GetItem(id primitive.ObjectID) (nft.NftItem, error) {
	filter := bson.D{{Key: "_id", Value: id}}
	var result nft.NftItem
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err := r.db.Collection(nftCollection).FindOne(ctx, filter).Decode(&result)
	return result, err
}

func (r *NftItemMongo) GetItems(pageNumber int64, nPerPage int64) ([]nft.NftItem, error) {
	opts := options.Find()
	var skip int64 = 0
	var nftList []nft.NftItem
	if pageNumber > 0 {
		skip = (pageNumber - 1) * nPerPage
	}
	opts.SetSort(bson.D{{Key: "_id", Value: -1}})
	opts.SetSkip(skip)
	opts.SetLimit(10)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	cursor, err := r.db.Collection(nftCollection).Find(ctx, bson.M{}, opts)
	if err != nil {
		logrus.Fatal(err)
	}
	defer cursor.Close(ctx)

	if err = cursor.All(ctx, &nftList); err != nil {
		logrus.Fatal(err)
	}
	return nftList, err
}

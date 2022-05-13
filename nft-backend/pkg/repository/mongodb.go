package repository

import (
	"context"
	"time"

	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

const (
	nftCollection      = "nfts"
	nftCollectionIndex = ""
)

type Config struct {
	URI    string
	DBName string
}

func NewMongoDB(cfg Config) (*mongo.Database, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(cfg.URI))
	if err != nil {
		return nil, err
	}
	defer func() {
		if err = client.Disconnect(ctx); err != nil {
			logrus.Fatalf("Database disconnected due to error: %s", err.Error())
		}
	}()

	err = client.Ping(ctx, readpref.Primary())
	if err != nil {
		return nil, err
	}

	collection := client.Database(cfg.DBName)

	return collection, nil
}

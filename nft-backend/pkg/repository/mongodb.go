package repository

import (
	"context"

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
	// ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	// defer cancel()
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(cfg.URI))
	if err != nil {
		return nil, err
	}
	defer func() {
		if err = client.Disconnect(context.TODO()); err != nil {
			logrus.Fatalf("Database disconnected due to error: %s", err.Error())
		}
	}()

	err = client.Ping(context.TODO(), readpref.Primary())
	if err != nil {
		return nil, err
	}

	db := client.Database(cfg.DBName)

	return db, nil
}

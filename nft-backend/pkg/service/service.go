package service

import (
	"github.com/zeidanbm/nft-backend"
	"github.com/zeidanbm/nft-backend/pkg/repository"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type NftItem interface {
	GetItem(id primitive.ObjectID) (nft.NftItem, error)
	GetItems(pageNumber int64, nPerPage int64) ([]nft.NftItem, error)
}

type Service struct {
	NftItem
}

func NewService(repos *repository.Repository) *Service {
	return &Service{
		NftItem: NewNftItemService(repos.NftItem),
	}
}

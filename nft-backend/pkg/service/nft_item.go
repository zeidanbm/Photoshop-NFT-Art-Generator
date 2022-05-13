package service

import (
	"github.com/zeidanbm/nft-backend"
	"github.com/zeidanbm/nft-backend/pkg/repository"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type NftItemService struct {
	repo repository.NftItem
}

func NewNftItemService(repo repository.NftItem) *NftItemService {
	return &NftItemService{repo: repo}
}

func (s *NftItemService) GetItem(id primitive.ObjectID) (nft.NftItem, error) {
	return s.repo.GetItem(id)
}

func (s *NftItemService) GetItems(pageNumber int64, nPerPage int64) ([]nft.NftItem, error) {
	return s.repo.GetItems(pageNumber, nPerPage)
}

package service

import "github.com/zeidanbm/nft-backend/pkg/repository"

type NftItem interface {
}

type Service struct {
	NftItem
}

func NewService(repos *repository.Repository) *Service {
	return &Service{}
}

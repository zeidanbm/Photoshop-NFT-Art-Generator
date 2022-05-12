package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/zeidanbm/nft-backend/pkg/service"
)

type Handler struct {
	services *service.Service
}

func NewHandler(services *service.Service) *Handler {
	return &Handler{services: services}
}

func (h *Handler) InitRoutes() *gin.Engine {
	router := gin.New()

	api := router.Group("/api")
	{
		lists := api.Group("/nfts")
		{
			lists.GET("/", h.getPaginatedItems)
			lists.GET("/:id", h.getItemById)
			lists.DELETE("/:id", h.deleteItemById)

		}
		bulk := api.Group("/bulk")
		{
			bulk.DELETE("/:ids", h.deleteItemsByIds)
		}
	}

	return router
}

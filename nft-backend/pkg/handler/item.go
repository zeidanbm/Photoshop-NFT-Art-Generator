package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/zeidanbm/nft-backend"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type getPaginatedItemsResponse struct {
	Data []nft.NftItem `json:"data"`
}

func (h *Handler) getPaginatedItems(c *gin.Context) {
	nPerPage, err := strconv.ParseInt(c.Query("nPerPage"), 10, 64)

	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, "invalid nPerPage param")
		return
	}

	pageNumber, err := strconv.ParseInt(c.Query("pageNumber"), 10, 64)

	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, "invalid pageNumber param")
		return
	}

	items, err := h.services.GetItems(pageNumber, nPerPage)

	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, getPaginatedItemsResponse{
		Data: items,
	})
}

func (h *Handler) getItemById(c *gin.Context) {

	paramsId := c.Param("id")
	id, err := primitive.ObjectIDFromHex(paramsId)

	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, "invalid id param")
		return
	}

	item, err := h.services.GetItem(id)

	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, item)
}

// func (h *Handler) getItemsCount(c *gin.Context) {

// }

// func (h *Handler) deleteItemById(c *gin.Context) {

// }

// func (h *Handler) deleteItemsByIds(c *gin.Context) {

// }

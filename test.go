package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	// "math/rand"
	// "strconv"
)

// Nft Struct (Model)
type Nft struct {
	ID          string       `json:"id"`
	name        string       `json:"name"`
	description string       `json:"description"`
	image       string       `json:"image"`
	edition     int          `json:"edition"`
	attributes  []*Attributes `json:"attributes"`
}

// Init nfts var as a slice Nft struct
var nfts []Nft

// Nft Attributes
type Attributes struct {
	trait_type string
	value      string
}

// Get all nfts
func getNfts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	// get all nfts from mongodb
	json.NewEncoder(w).Encode(nfts)
}

// Get nft
func getNft(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	// get nft from mongodb
	//json.NewEncoder(w).Encode(nft)
}

// Get nft
func deleteNft(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	// delete nft from database
	// remove image and metadata files
}

func main() {
	// Init Router
	r := mux.NewRouter()

	// Mock Data
	nfts = append(nfts, Nft{ID: 1,name:"Cyber Genie NFT #2","description":"",image:"To be replaced",edition:2,attributes:[&Attributes{"trait_type":"Top lid","value":"T-Middle"},&Attributes{"trait_type":"Bottom lid","value":"B-Middle"},&Attributes{"trait_type":"Shine","value":"Shapes"},&Attributes{"trait_type":"Iris","value":"Ir-Small"},&Attributes{"trait_type":"Eye Color","value":"Eye-Red"},&Attributes{"trait_type":"Eyeball","value":"Eyeball-Red"},&Attributes{"trait_type":"Background","value":"Bg-Red"}]})

	// Route Handlers / Endpoints
	r.HandleFunc("/api/nfts", getNfts).Methods("GET")
	r.HandleFunc("/api/nfts/{id}", getNft).Methods("GET")
	r.HandleFunc("/api/nfts/{id}", deleteNft).Methods("DELETE")

	log.Fatal(http.ListenAndServe(":8080", r))
}

FROM --platform=linux/amd64 golang:1.18 as builder

LABEL author Cyber Genie Team

# Where our file will be in the docker container
WORKDIR  /app

# Copying the source code of Application into the container dir
COPY ./nft-backend ./

# Download modules and build executable
RUN go mod download
RUN go mod verify
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -o /api ./cmd/main.go

# Install Air for hot reload
# RUN go install github.com/cosmtrek/air@latest

# final stage
FROM --platform=linux/amd64 alpine:latest

# RUN apk update && apk add dos2unix

COPY nft-backend/configs/ configs/
COPY ./nft-backend/.env ./

COPY --from=builder /api ./
# RUN dos2unix /api
RUN chmod +x ./api

# Container exposed network port number
EXPOSE 8075

# Start the binary
CMD  ["/api"]
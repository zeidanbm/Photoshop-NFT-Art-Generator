FROM --platform=linux/amd64 golang:latest as builder

LABEL author Cyber Genie Team

RUN go install github.com/githubnemo/CompileDaemon@latest

# Where our file will be in the docker container
WORKDIR  /app

COPY ./nft-backend /app

RUN go mod download

RUN go env GOPATH

# Container exposed network port number
EXPOSE 8075

# CMD exec /bin/bash -c "trap : TERM INT; sleep infinity & wait"
ENTRYPOINT /go/bin/CompileDaemon --polling=true --build="go build cmd/main.go" --command=./main
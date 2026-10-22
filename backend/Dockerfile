FROM golang:1.26-alpine AS builder
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/utero-api ./cmd/server

FROM alpine:3.22
RUN apk add --no-cache ca-certificates && addgroup -S app && adduser -S app -G app
WORKDIR /app
COPY --from=builder /out/utero-api /usr/local/bin/utero-api
RUN mkdir /data && chown app:app /data
USER app
EXPOSE 8080
CMD ["utero-api"]

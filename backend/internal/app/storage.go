package app

import (
	"context"
	"fmt"
	"io"
	"path"
	"strings"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type ObjectStorage struct {
	client *minio.Client
	bucket string
}

func OpenObjectStorage(ctx context.Context, cfg Config) (*ObjectStorage, error) {
	client, err := minio.New(cfg.S3Endpoint, &minio.Options{Creds: credentials.NewStaticV4(cfg.S3AccessKey, cfg.S3SecretKey, ""), Secure: cfg.S3UseSSL})
	if err != nil {
		return nil, err
	}
	storage := &ObjectStorage{client: client, bucket: cfg.S3Bucket}
	exists, err := client.BucketExists(ctx, cfg.S3Bucket)
	if err != nil {
		return nil, err
	}
	if !exists {
		if err = client.MakeBucket(ctx, cfg.S3Bucket, minio.MakeBucketOptions{}); err != nil {
			return nil, err
		}
	}
	return storage, nil
}
func (s *ObjectStorage) Put(ctx context.Context, key, contentType string, reader io.Reader, size int64) error {
	_, err := s.client.PutObject(ctx, s.bucket, key, reader, size, minio.PutObjectOptions{ContentType: contentType})
	return err
}
func (s *ObjectStorage) Get(ctx context.Context, key string) (*minio.Object, error) {
	return s.client.GetObject(ctx, s.bucket, key, minio.GetObjectOptions{})
}
func (s *ObjectStorage) Delete(ctx context.Context, key string) error {
	return s.client.RemoveObject(ctx, s.bucket, key, minio.RemoveObjectOptions{})
}
func safeObjectKey(key string) (string, error) {
	clean := path.Clean("/" + key)
	if strings.Contains(clean, "..") || clean == "/" {
		return "", fmt.Errorf("invalid object key")
	}
	return strings.TrimPrefix(clean, "/"), nil
}

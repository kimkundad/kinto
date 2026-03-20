#!/usr/bin/env sh
set -eu

: "${API_IMAGE:?API_IMAGE is required}"
: "${NGINX_IMAGE:?NGINX_IMAGE is required}"
: "${IMAGE_TAG:?IMAGE_TAG is required}"

docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d --force-recreate --remove-orphans
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"

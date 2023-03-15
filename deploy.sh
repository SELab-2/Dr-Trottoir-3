#!/bin/bash
cd caddy
docker compose -f docker-compose.prod.yml -p drtrottoir build
docker compose -f docker-compose.prod.yml -p drtrottoir up -d --force-recreate
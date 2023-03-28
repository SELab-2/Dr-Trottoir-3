#!/bin/bash
cd caddy || exit
docker compose -f docker-compose.prod.yml -p drtrottoir build
docker compose -f docker-compose.prod.yml -p drtrottoir up -d --force-recreate
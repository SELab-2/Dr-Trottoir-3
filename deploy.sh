#!/bin/bash
echo Not ready for deployment
exit 1
cd caddy || exit
docker compose -f docker-compose.prod.yml -p drtrottoir build
docker compose -f docker-compose.prod.yml -p drtrottoir up -d --force-recreate
#!/bin/bash
cd caddy
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d --force-recreate
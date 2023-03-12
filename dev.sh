#!/bin/bash

cd caddy/ || exit

echo "Starting development stack ..."
echo "Frontend can be reached via http://localhost or http://localhost:3000"
echo "Backend can be reached via http://localhost/api/ or http://localhost:8000"
echo "Database can be accessed via http://localhost:5432"
echo

docker compose -f docker-compose.dev.yml up

#!/bin/bash

build=false
if [[ $# -eq 2 && $2 == "--build" ]]; then
  build=true
fi

# Parse the command line arguments and run the appropriate subcommand
case $1 in
    full)
        echo Starting entire development stack ...
        cd caddy || exit 1
        if [ "$build" = true ]; then
          echo "Building image"
          docker compose -f docker-compose.dev.yml -p full-dev build
        fi
        docker compose -f docker-compose.dev.yml -p full-dev up
        ;;
    docs)
        echo Starting docs only ...
        cd backend/docs || exit 1
        if [ "$build" = true ]; then
          echo "Building image"
          docker compose -p docs build
        fi
        docker compose -p docs up
        ;;
    backend)
        echo Starting backend only ...
        cd backend || exit 1
        if [ "$build" = true ]; then
          echo "Building image"
          docker compose -f docker-compose.dev.yml -p backend-dev build
        fi
        docker compose -f docker-compose.dev.yml -p backend-dev up
        ;;
    frontend)
        echo Starting frontend only ...
        cd frontend || exit 1
        if [ "$build" = true ]; then
          echo "Building image"
          docker compose -f docker-compose.dev.yml -p frontend-dev build
        fi
        docker compose -f docker-compose.dev.yml -p frontend-dev up
        ;;
    *)
        echo "Usage: $0 {full|docs|backend|frontend}"
        exit 1
        ;;
esac

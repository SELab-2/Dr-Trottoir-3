#!/bin/bash

build=false
if [[ $# -eq 2 && $2 == "--build" ]]; then
  build=true
fi

# Parse the command line arguments and run the appropriate subcommand
case $1 in
    backend)
        echo Testing backend ...
        cd backend || exit 1
        if [ "$build" = true ]; then
          echo "Building image"
          docker compose -f docker-compose.test.yml -p backend-test up --abort-on-container-exit --exit-code-from backend --build --renew-anon-volumes
          else docker compose -f docker-compose.test.yml -p backend-test up --abort-on-container-exit --exit-code-from backend
        fi
        ;;
    frontend)
        echo Testing frontend ...
        cd frontend || exit 1
        if [ "$build" = true ]; then
          echo "Building image"
          docker compose -f docker-compose.test.yml -p frontend-test up --build --renew-anon-volumes --exit-code-from frontend
          else docker compose -f docker-compose.test.yml -p frontend-test up --exit-code-from frontend
        fi
        ;;
    *)
        echo "Usage: $0 {full|backend|frontend}"
        exit 1
        ;;
esac

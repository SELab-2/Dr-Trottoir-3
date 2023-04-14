#!/bin/bash
set -a
source .env.dev

# Parse the command line arguments and run the appropriate subcommand
case $1 in
full)
  echo Starting entire development stack ...
  cd caddy || exit 1
  BASE_CMD="docker compose -f docker-compose.dev.yml -p full-dev"
  case $2 in
  --build)
    $BASE_CMD build
    ;;&
  mockdata)
    echo -n "Password for test user: "
    read MOCK_PASS
    $BASE_CMD run backend sh -c "python manage.py wait_for_db && python manage.py migrate && python manage.py mockdata $MOCK_PASS"
    ;;
  down)
    $BASE_CMD down -v
    ;;
  *)
    $BASE_CMD up
    ;;
  esac
  ;;
docs)
  echo Starting docs only ...
  cd backend/docs || exit 1
  BASE_CMD="docker compose -p docs-dev"
  case $2 in
  --build)
    $BASE_CMD build
    ;;&
  down)
    $BASE_CMD down -v
    ;;
  *)
    $BASE_CMD up
    ;;
  esac
  ;;
backend)
  echo Starting backend only ...
  cd backend || exit 1
  BASE_CMD="docker compose -f docker-compose.dev.yml -p backend-dev"
  case $2 in
  --build)
    echo "Building image"
    $BASE_CMD build
    ;;&
  mockdata)
    echo -n "Password for test user: "
    read MOCK_PASS
    $BASE_CMD run backend sh -c "python manage.py wait_for_db && python manage.py migrate && python manage.py mockdata $MOCK_PASS"
    ;;
  down)
    $BASE_CMD down -v
    ;;
  *)
    $BASE_CMD up
    ;;
  esac
  ;;
frontend)
  echo Starting frontend only ...
  cd frontend || exit 1
  BASE_CMD="docker compose -f docker-compose.dev.yml -p frontend-dev"
  case $2 in
  --build)
    echo "Building image"
    $BASE_CMD build
    ;;&
  down)
    $BASE_CMD down -v
    ;;
  *)
    $BASE_CMD up
    ;;
  esac
  ;;
*)
  echo "Usage: $0 {full|docs|backend|frontend} [--build|down]"
  exit 1
  ;;
esac

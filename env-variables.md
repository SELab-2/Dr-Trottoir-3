# Environment variables

A list of the required and optional environment variables.

## Backend

| Variable Name   | Default Value  | Required/Optional | Description                                                                   |
|-----------------|----------------|-------------------|-------------------------------------------------------------------------------|
| DEBUG           | 1              | Optional          | Set to 0 to disable DEBUG mode (required in production to disable)            |
| SECRET_KEY      | insecure       | Optional          | Main secret for Django (required in production)                               |
| BASE_PATH       | /              | Optional          | Base path for the URL                                                         |
| DATABASE        |                | Optional          | Set to "postgres" to use postgres, uses sqlite by default                     |
| DB_HOST         |                | Optional          | Postgres host                                                                 |
| DB_NAME         |                | Optional          | Name of the database in postgres                                              |
| DB_USER         |                | Optional          | Username for postgres                                                         |
| DB_PASS         |                | Optional          | Password for postgres                                                         |
| ALLOWED_HOSTS   | []             | Optional          | Comma seperated list of allowed hostnames. When DEBUG=1 and this is left empy |
| STATIC_DATA_DIR | ./static_files | Optional          | Directory to store static files                                               |

When `DEBUG` is True and `ALLOWED_HOSTS` is empty, the host is validated against `['.localhost', '127.0.0.1', '[::1]']`.

## Frontend

| Variable Name         | Default Value | Required/Optional | Description                    |
|-----------------------|---------------|-------------------|--------------------------------|
| NEXT_API_URL          |               | Required          | URL pointing to next.js        |
| NEXT_INTERNAL_API_URL |               | Required          | URL pointing to django backend |


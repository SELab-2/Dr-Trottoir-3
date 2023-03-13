# Development

## Entire stack

To start the development environment, run

```shell
./dev.sh full
```

The frontend will be available at [http://localhost/](http://localhost/), the api at [http://localhost/api/](http://localhost/api/), and the docs at [http://localhost/docs/](http://localhost/docs/).

Services can also be reached directly via the ports specified here:

| Service  | Port |
|----------|------|
| Frontend | 8000 |
| Backend  | 8001 |
| Docs     | 8002 |
| Postgres | 5432 |

## Individual services

To just run frontend, backend, or docs, run
```shell
./dev.sh {frontend|backend|docs}
```

## Rebuilding image
To rebuild a docker image, add `--build`. This is necessary in some cases, for example when the dependencies changed. Docs will also only be updated when rebuilding the image.

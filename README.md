# Dr-Trottoir-3

## Rolverdeling
**Projectleider**: Maxim Stockmans

**Systeembeheerder**: Joris Peeters

**API beheerder**: Jef Roosens

**Test beheerder**: Pim Pieters

**Documentatiebeheerder**: Jahid Chetti

**Customer Relations Officer**: Bavo Verstraeten

**UI/UX**: Lander Durie


## GitHub Branch Rules

**Main**: contains a fully functional version that has no half implemented features and is production ready. Only accepts changes from the development branch.

**Development**: also needs to be a fully functional version, personal development branches are merged into this branch. Once this branch is fully tested it can be moved up to main.

**Personal development branches**: use the following naming convention: "firstnamelastname/githubissuenumber-description". 
A branch created by Maxim Stockmans for creating the domain model (issue #2) would be the following: "maximstockmans/2-create-domain-model".
After this is done and the branch is finished, a pull request from this branch to development should be made, where it will be reviewed by at least two other developers.

## Documentation

The documentation for both the backend and frontend are automatically generated based on the comments in the files. The docs of the backend and frontend are seperated, so you will need to build them independently. For generating and reading them, see the README.md files in `backend/docs` and `frontend/docs`.

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

# Testing

Run 
```shell
./test.sh {frontend|backend}
```
to run the tests in docker. Optionally add `--build` to rebuild the image if needed.

# Dr-Trottoir-3

## User Guide

The user guide is available [here](user_guide/guide.md).

## OneDrive
All non code related files are stored in following OneDrive directory. This includes functional analysis, use cases, endpoint guides, figma designs...
[OneDrive](https://ugentbe-my.sharepoint.com/personal/bart_mesuere_ugent_be/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbart%5Fmesuere%5Fugent%5Fbe%2FDocuments%2FOnderwijs%2FSELab2%2F2022%2D2023%2FMappen%20studenten%2Fgroep3&ct=1676648071488&or=OWA%2DNT&cid=0d2049e3%2Dfcb1%2Df225%2Dcaee%2Df2b258c1f843&ga=1)

## Roles
**Project Leader**: Maxim Stockmans

**System Admin**: Joris Peeters

**API Manager**: Jef Roosens

**Test Manager**: Pim Pieters

**Documentation Manager**: Jahid Chetti

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

The frontend will be available at [http://localhost/](http://localhost/), the api at [http://localhost/backend/](http://localhost/backend/), and the docs at [http://localhost/docs/](http://localhost/docs/).

Services can also be reached directly via the ports specified here:

| Service  | Port |
|----------|------|
| Frontend | 8000 |
| Backend  | 8001 |
| Docs     | 8002 |
| Postgres | 5432 |

### Mock data

To load mock data, run 

```shell
./dev/sh full mockdata
```

## Individual services

To just run frontend, backend, or docs, run
```shell
./dev.sh {frontend|backend|docs} [--build|down]
```

## Rebuilding image
To rebuild a docker image, add `--build`. This is necessary in some cases, for example when the dependencies changed. Docs will also only be updated when rebuilding the image.

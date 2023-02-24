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

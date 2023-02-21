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

### Requirements

Install the following python packages:
- ```pip install mkdocs```
- ```pip install mkdocstrings-python```

### Viewing docs

You can view the docs using 

`python -m mkdocs serve`

which will start a local server. This server automatically relaunches as you change the documentation, so the docs will be up to date.

You can also build a static version of the website using

```python -m mkdocs build```

which will create files in the site/ folder.

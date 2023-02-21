# Dr Trottoir

For full documentation visit [mkdocs.org](https://www.mkdocs.org).

For Python, we're going to use the Google documentation style for the documentation, [an example can be found here](https://sphinxcontrib-napoleon.readthedocs.io/en/latest/example_google.html).

For Javascript (Typescript), I recommend the JSDoc style, [see here](https://google.github.io/styleguide/jsguide.html#jsdoc).

## Important note

It's possible to automatically write the Python documentation based on the documentation in the .py files, thanks to mkdocstrings. This is NOT possible however for Typescript, because I can't find such a converter (handler). The documentation for the frontend will need to be written manually(until I find a solution).

# How to use

## Installation

### Requirements

Install the following python packages:
- ```pip install mkdocs```
- ```pip install mkdocstrings-python```

## Viewing documentation

You can view the docs using 

`python -m mkdocs serve`

which will start a local server. This server automatically relaunches as you change the documentation, so the docs will be up to date.

**Note:** You can use `python -m mkdocs serve --dirty-reload` for faster updating when editing pages, but this produces problems when moving files.

You can also build a static version of the website using

```python -m mkdocs build```

which will create files in the `site/` folder.

## Adding documentation

In the `docs/` folder, add a .md file where appropriate to add a new documentation file. This should represent a new page on the documentation. In the `mkdocs.yml` file, add the page name and md path where appropriate in the tree structure. 

MkDocs uses markdown, which should be self-explanatory. [A basic overview can be found here](https://www.markdownguide.org/basic-syntax/). For automatically generating documentation for the Python files using mkdocstrings, you include the file using

```::: python.path```

For example:

```::: backend.drtrottoir.test```

for the file `test.py` located in folder `backend/drtrottoir/`.  

You can also add header modifiers (e.g. ```## ::: backend.drtrottoir.test```).

## More information

- https://mkdocstrings.github.io/usage/
- https://mkdocstrings.github.io/
- https://github.com/mkdocstrings/mkdocstrings
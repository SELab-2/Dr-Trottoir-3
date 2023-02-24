The backend documentation is built using [Sphinx](https://www.sphinx-doc.org/en/master/). Sphinx uses the [reStructuredText markup language](https://docutils.sourceforge.io/rst.html), which isn't very complicated. Additionally, Sphinx allows user commands, which are explained below.

Sphinx automatically builds your code, but you have to manually tell it where to 

## Requirements

Install Sphinx with the following commands:

```
pip install sphinx
pip install sphinx_rtd_theme
```

With your installation using pip, Sphinx will download several executable files. These are located in your Python bin folder (`{python-path}/bin` on Unix, `{python-path}/Scripts` on Windows). **Make sure these are on your PATH**.

Sphinx is succesfully installed if you can run

```
sphinx-build --version 
```

without error.

## Building

To build, run:

```
make html
```

The resulting docs will be located in `_build/html`.

## Commands in Sphinx

Commands in Sphinx are preceded with two dots, a space, and the command name. The name of the command is thus **three spaces**. If the command has options or arguments, these have to be on the same indentation as the command name (thus, also **three spaces**). If they are not aligned, it will not interpret the option or argument.

## Adding documentation

To add documentation, create a new .rst file in the docs folder. Add the following lines to it:

```
.. automodule:: drtrottoir.[file_name]
   :members:
```

If you want your documentation to also appear in the side navigation bar, add your file to `index.rst` (again make sure three spaces).

You can add additional information to your documentation rst file as you see fit.

## Tips

If you're experience strange behavior, it's useful to run 

```
make clean
make html
```

to rebuild your docs from scratch.
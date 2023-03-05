# =====CONFIG=====
PYTHON  := python3
VENV    := venv
SRC     := drtrottoir


# =====GENERAL=====
## By default, create the venv
.PHONY: all
all: venv
	
## Remove any temporary files
.PHONY: clean
clean:
	@ rm -rf '$(VENV)'


# =====BACKEND=====
## VENV
### Create the venv
$(VENV)/bin/activate:
	@ '$(PYTHON)' -m venv '$(VENV)'
	@ '$(VENV)'/bin/pip install -r requirements.txt -r requirements-dev.txt


### Convenient alias for the venv
.PHONY: venv
venv: $(VENV)/bin/activate


## Formatting & linting
### Format the codebase using black
.PHONY: format
fmt:
	@ '$(VENV)'/bin/isort $(SRC)
	@ '$(VENV)'/bin/black $(SRC)

### Lint using black & flake8
.PHONY: lint
lint:
	@ '$(VENV)'/bin/black --check $(SRC)
	@ '$(VENV)'/bin/flake8 $(SRC)
	@ '$(VENV)'/bin/isort --check $(SRC)
	@ '$(VENV)'/bin/mypy  $(SRC)

.PHONY: test
test:
	'$(VENV)'/bin/pytest --cov --cov-config=.coveragerc drtrottoir/tests

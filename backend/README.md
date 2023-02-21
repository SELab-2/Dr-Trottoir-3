# Backend

## Venv

The virtual environment can be created by running `python -m venv venv` in the
current directory.

## Testing & linting

A convenience Makefile is provided that can be used as follows:

```sh
# Create the virtual environment
make venv

# Check for linting errors
make lint

# Format code
make fmt

# Test code
make test
```

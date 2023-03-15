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

## Changing the database schema

The database models are defined in `drtrottoir/models.py`. If changes to the
database schema are required, you can add/remove/edit models in this file and
then generate a migration. To do this, run the following in your virtual
environment:

```sh
python manage.py makemigrations drtrottoir
```

This will create a new migration in the migrations folder. These migrations
should then be committed to Git. To apply these migrations, run `python
manage.py migrate`.

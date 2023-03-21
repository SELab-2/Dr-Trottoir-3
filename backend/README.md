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

## Generating mock data

An admin command is provided to populate the database with some mock data for
testing:

```sh
python manage.py mockdata [password]
```

Here, the `password` argument is used to create a student, superstudent, admin
and syndicus with the given password (with emails `student@drtrottoir.be`,
...), which can then be used to log into the system. For public test
deployments, make sure this is a **good password**.

This script does not support being ran multiple times. If you wish to reset the
database, use `python manage.py flush` first, and then re-run the above
command.

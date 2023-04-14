# pull official base image
FROM python:3.10-alpine

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# set work directory
WORKDIR /app

# copy project
COPY . .
COPY ./scripts /scripts

# install psycopg2 dependencies
RUN apk update && \
    apk add postgresql-dev gcc python3-dev musl-dev libffi-dev zlib-dev jpeg-dev linux-headers pcre pcre-dev && \
    python -m venv /py && \
    /py/bin/pip install --upgrade pip && \
    /py/bin/pip install -r requirements.txt && \
    adduser --disabled-password --no-create-home app && \
    mkdir -p /vol/web/static && \
    mkdir -p /vol/web/media && \
    chown -R app:app /vol && \
    chmod -R 755 /vol && \
    chmod -R +x /scripts

ENV PATH="/scripts:/py/bin:$PATH"

USER app

#TODO move to compose file
CMD ["run.sh"]

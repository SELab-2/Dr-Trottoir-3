FROM python:3.10-alpine AS builder
WORKDIR /app/docs
COPY . /app
RUN apk update && \
    apk add postgresql-dev gcc python3-dev musl-dev libffi-dev zlib-dev jpeg-dev linux-headers make && \
    python -m venv /py && \
    /py/bin/pip install --upgrade pip && \
    /py/bin/pip install -r ../requirements.txt -r ../requirements-dev.txt

ENV PATH="/py/bin:$PATH"
RUN make html

FROM nginx
COPY --from=builder /app/docs/_build/html /usr/share/nginx/html

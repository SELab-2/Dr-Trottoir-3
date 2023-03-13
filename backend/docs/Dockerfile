FROM sphinxdoc/sphinx AS builder
WORKDIR /docs
RUN pip3 install sphinx_rtd_theme
COPY . .
RUN make html

FROM nginx
COPY --from=builder /docs/_build/html /usr/share/nginx/html

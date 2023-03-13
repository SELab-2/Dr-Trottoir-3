server {
    listen ${LISTEN_PORT};

    location /${BASE_PATH}static {
        alias /vol/static;
    }

    location /${BASE_PATH} {
        uwsgi_pass              ${APP_HOST}:${APP_PORT};
        include                 /etc/nginx/uwsgi_params;
        client_max_body_size    100M;
    }
}

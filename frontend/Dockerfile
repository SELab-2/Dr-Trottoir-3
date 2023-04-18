# get the base node image
FROM node:18-alpine as builder

# set the working dir for container
WORKDIR /frontend

# copy project files
COPY . .


# install npm dependencies
RUN apk update && \
    apk add rsync && \
    npm install

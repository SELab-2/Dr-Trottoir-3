# get the base node image
FROM node:18-alpine as builder

# set the working dir for container
WORKDIR /frontend

# copy project files
COPY --chown=node:node . .

# install npm dependencies
RUN npm install

USER node

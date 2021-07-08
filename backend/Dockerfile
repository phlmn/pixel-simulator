# syntax=docker/dockerfile:1
FROM node:alpine
WORKDIR /pixel_backend/
RUN apk add --no-cache make gcc g++ python3
COPY . .
RUN yarn
CMD yarn start

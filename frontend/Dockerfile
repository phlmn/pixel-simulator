# syntax=docker/dockerfile:1
FROM node:alpine AS build
WORKDIR /pixel_frontend/
COPY . .
RUN yarn
RUN yarn build 

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /pixel_frontend/dist/ /var/www/
#COPY dist/ /var/www/

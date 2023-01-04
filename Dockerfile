FROM node:16 as build-stage
WORKDIR /app

COPY ./frontend/package*.json ./
RUN npm install
COPY ./frontend/ .
RUN npm run build

FROM nginx:1-alpine as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app

COPY nginx.conf.template /etc/nginx/templates/default.conf.template

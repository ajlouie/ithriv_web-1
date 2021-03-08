FROM node:13-alpine as node
LABEL maintainer="rkc7h@virginia.edu"
ARG BUILD_ENV
ENV APP_LOC /ithriv_web
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh python3 python2
WORKDIR $APP_LOC
COPY package*.json ./
RUN npm config set unsafe-perm true \
    && npm install bootstrap \
    && npm install -g @angular/cli@8.3.23 \
    && npm install \
    && npm list -g --depth=1 \
    && node -v \
    && ng --version \
    && npm install source-map-explorer --save-dev --save-exact \
    && npm config set unsafe-perm false
RUN node -v
RUN ng --version
COPY . .
RUN npm run lint
RUN npm run "build_$BUILD_ENV"
RUN npm run test
RUN npm prune --production

FROM nginx:alpine
LABEL maintainer="rkc7h@virginia.edu"
ENV APP_LOC /ithriv_web
RUN rm -rf /usr/share/nginx/html/*
# RUN apk --no-cache add ca-certificates
COPY --from=node $APP_LOC/dist /usr/share/nginx/html
COPY ./nginx_app.conf /etc/nginx/conf.d/default.conf
EXPOSE 4200

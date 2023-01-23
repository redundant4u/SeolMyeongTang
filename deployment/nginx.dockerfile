FROM nginx:1.23-alpine

WORKDIR /home

ENV NODE_ENV=prod
ENV TZ=Asia/Seoul

RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone

COPY default.conf /etc/nginx/conf.d/default.conf

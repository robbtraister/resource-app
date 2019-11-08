ARG USER=nodejs
ARG PROJECT=${USER}


FROM alpine as build

RUN \
    apk update && \
    apk upgrade && \
    apk add --no-cache --update \
            nodejs-npm \
            && \
    rm -rf /var/cache/apk/* && \
    npm i -g npm && \
    node -v && \
    npm -v

ARG PROJECT
WORKDIR /opt/${PROJECT}

COPY package*.json ./
RUN npm ci

COPY . ./

RUN \
    npm run test && \
    npm run build -- -p


FROM alpine

RUN \
    apk update && \
    apk upgrade && \
    apk add --no-cache --update \
            nodejs \
            && \
    rm -rf /var/cache/apk/* && \
    node -v

ARG USER
RUN \
    (addgroup -S ${USER} 2> /dev/null || true) && \
    (adduser -S ${USER} -G ${USER} -s /bin/sh 2> /dev/null || true)

COPY ./public ./public

ARG PROJECT
COPY --from=build /opt/${PROJECT}/build ./build

ENTRYPOINT ["node"]
CMD ["./build/server"]

ENV NODE_ENV=production

USER ${USER}

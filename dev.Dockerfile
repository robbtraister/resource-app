FROM alpine

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

ARG USER=nodejs
ARG PROJECT=${USER}
WORKDIR /opt/${PROJECT}

COPY package*.json ./
RUN npm ci

COPY . ./

ENTRYPOINT ["npm", "run"]
CMD ["dev"]

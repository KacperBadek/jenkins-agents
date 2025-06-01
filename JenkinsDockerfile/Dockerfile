FROM jenkins/inbound-agent:alpine

USER root
RUN apk update && apk add --no-cache \
    nodejs \
    npm \
    git \
    curl \
    jq \
    docker-cli \
    bash \
    && npm install -g jest

WORKDIR /home/jenkins/agent

USER jenkins

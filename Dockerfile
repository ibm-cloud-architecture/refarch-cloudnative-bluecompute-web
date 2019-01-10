FROM node:6

ADD https://github.com/stedolan/jq/releases/download/jq-1.5/jq-linux64 /usr/local/bin/jq
RUN chmod +x /usr/local/bin/jq
RUN npm -g install bower

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin
ENV NODE_ENV production

ADD StoreWebApp /home/node/StoreWebApp
COPY startup.sh /home/node/StoreWebApp
WORKDIR /home/node/StoreWebApp

RUN chown -R node:node /home/node
USER node

RUN npm install --verbose

EXPOSE 8000 9000

ENTRYPOINT ["./startup.sh"]
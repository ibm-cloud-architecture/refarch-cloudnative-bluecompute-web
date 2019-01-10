FROM node:6

ADD https://github.com/stedolan/jq/releases/download/jq-1.5/jq-linux64 /usr/local/bin/jq
RUN chmod +x /usr/local/bin/jq

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin
ENV NODE_ENV production

RUN mkdir -p /home/node/app/node_modules /home/node/app/public/resources/bower_components && chown -R node:node /home/node

WORKDIR /home/node/app

COPY StoreWebApp/package*.json StoreWebApp/bower.json StoreWebApp/.bowerrc ./
RUN ls -la; cat bower.json; cat .bowerrc

USER node
RUN npm install --verbose
USER root

RUN ls -la public/resources/bower_components; ls -la

COPY startup.sh ./
COPY StoreWebApp .
COPY --chown=node:node StoreWebApp .

USER node

EXPOSE 8000 9000

ENTRYPOINT ["./startup.sh"]
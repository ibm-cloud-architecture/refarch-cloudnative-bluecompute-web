FROM node:6

ADD StoreWebApp /StoreWebApp

WORKDIR /StoreWebApp

ADD https://github.com/stedolan/jq/releases/download/jq-1.5/jq-linux64 /usr/local/bin/jq
RUN chmod a+x /usr/local/bin/jq

RUN npm install
RUN npm -g install bower
RUN bower --allow-root install --force

COPY startup.sh startup.sh

ENTRYPOINT ["./startup.sh"]
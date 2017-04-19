from node:6

ADD StoreWebApp /StoreWebApp

WORKDIR /StoreWebApp

RUN npm install
RUN npm -g install bower
RUN bower --allow-root install --force

CMD [ "npm", "start" ]

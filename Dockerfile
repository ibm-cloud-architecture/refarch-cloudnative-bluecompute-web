FROM node:6-alpine

# Install Extra Packages
RUN apk --update add git less openssh jq bash bc ca-certificates curl && \
    rm -rf /var/lib/apt/lists/* && \
    rm -rf /var/cache/apk/

# Set Environment Variables
ENV NPM_CONFIG_PREFIX=/home/blue/.npm-global
ENV PATH=$PATH:/home/blue/.npm-global/bin
ENV NODE_ENV production

# Create app directory
ENV APP_HOME=/app
RUN mkdir -p $APP_HOME/node_modules $APP_HOME/public/resources/bower_components
WORKDIR $APP_HOME

# Copy package.json, bower.json, and .bowerrc files
COPY StoreWebApp/package*.json StoreWebApp/bower.json StoreWebApp/.bowerrc ./

# Create user, chown, and chmod
RUN adduser -u 2000 -G root -D blue \
	&& chown -R 2000:0 $APP_HOME

# Install Dependencies
USER 2000
RUN npm install
USER 0

COPY startup.sh startup.sh
COPY StoreWebApp .

# Chown
RUN chown -R 2000:0 $APP_HOME

# Cleanup packages
RUN apk del git less openssh

# Switch back to non-root
USER 2000

EXPOSE 8000 9000
ENTRYPOINT ["./startup.sh"]
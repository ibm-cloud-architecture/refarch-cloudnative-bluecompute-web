# BlueCompute Web Application by IBM Cloud

*This project is part of the 'IBM Cloud Native Reference Architecture' suite, available at
https://github.com/ibm-cloud-architecture/refarch-cloudnative-kubernetes*

The sample Web application is built to demonstrate how to access the Omnichannel APIs hosted on IBM Cloud. The application provides the basic function to allow user to browse the Catalog items, make an Order and review profile. The Web application is built with AngularJS in Web 2.0 Single Page App style. It uses a Node.js backend to host the static content and implement the BFF (Backend for Frontend) pattern.

Here is an overview of the project's features:
- AngularJS SPA
- Node.js based BFF application to access APIs
- Authentication and Authorization through OAuth 2.0
- DevOps toolchain to build/deploy web app
- Distributed as Docker container and deployed to Kubernetes cluster on Bluemix

You need to have your local development environment properly configured with all the tools installed, for example, Docker and Kubernetes command line tool. Please reference [this instruction](https://github.com/ibm-cloud-architecture/refarch-cloudnative-kubernetes/tree/kube-int#step-1-environment-setup) to set up your local development environment.

## Run and test the Web application locally

1. Navigate to the web app folder `StoreWebApp` in the git repository.

2. Run the Web application

  The application uses [Bower](https://bower.io/) to manage the dependencies for Web front end library like AngularJS. It uses several other npm libraries such as Express.js. You need to install all the dependencies first:

   `$ cd StoreWebApp`  
   `$ npm install`  
   `$ npm start`    

This will start the Node.js application on your local environment and open a browser with app homepage.

## Run and test the Web application locally on Docker

To run the application in docker, we first need to define a Docker file.

#### Docker file

We are using Docker to containerize the application. With Docker, you can pack, ship, and run applications on a portable, lightweight container that can run anywhere virtually.

```
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
```

#### Running the application locally in a docker container

1. Build the docker image.

`docker build -t web:microprofile .`

Once this is done, you will see something similar to the below messages.
```
Successfully built ed2b22cda95b
Successfully tagged web:microprofile
```
You can see the docker images by using this command.

`docker images`

```
REPOSITORY                                      TAG                 IMAGE ID            CREATED             SIZE
web                                             microprofile        ed2b22cda95b        24 minutes ago      771MB
```
2. Run the docker image.

`docker run -p 8000:8000 -d --name web -t --link inventory:inventory --link elasticsearch:elasticsearch --link mysql:mysql --link rabbitmq:rabbitmq --link catalog:catalog --link auth:auth --link order:order web:microprofile`

When it is done, you can verify it using the below command.

`docker ps`

You will see something like below.

```
CONTAINER ID        IMAGE                               COMMAND                  CREATED             STATUS              PORTS                                                                             NAMES
cfca55fa3b17        web:microprofile                    "./startup.sh"           20 minutes ago      Up 20 minutes       0.0.0.0:8000->8000/tcp                                                            web
cf5fa61acfb5        orders:microprofile                 "/opt/ibm/wlp/bin/se…"   27 minutes ago      Up 27 minutes       0.0.0.0:9380->9080/tcp, 0.0.0.0:8443->9443/tcp                                    order
c5625f800e47        auth:microprofile                   "/opt/ibm/docker/doc…"   30 minutes ago      Up 30 minutes       0.0.0.0:9580->9080/tcp, 0.0.0.0:7443->9443/tcp                                    auth
7f50df9b03a3        catalog:microprofile                "/opt/ibm/wlp/bin/se…"   2 hours ago         Up 2 hours          9443/tcp, 0.0.0.0:9280->9080/tcp                                                  catalog
e1fe5ab7cfbc        ibmcase/bluecompute-elasticsearch   "/run.sh"                2 hours ago         Up 2 hours          0.0.0.0:9200->9200/tcp, 9300/tcp                                                  elasticsearch
3149cb57629f        inventory:microprofile              "/opt/ibm/wlp/bin/se…"   2 hours ago         Up 2 hours          9443/tcp, 0.0.0.0:9180->9080/tcp                                                  inventory
526f5c1e6cb2        rabbitmq                            "docker-entrypoint.s…"   2 hours ago         Up 2 hours          4369/tcp, 0.0.0.0:5672->5672/tcp, 5671/tcp, 25672/tcp, 0.0.0.0:15672->15672/tcp   rabbitmq
b87156ca98e5        mysql                               "docker-entrypoint.s…"   2 hours ago         Up 2 hours          0.0.0.0:9041->3306/tcp                                                            mysql
```

4. Access the application at http://localhost:8000/ 

5. Once you are done accessing the application, you can come out of the process. 

6. You can also remove the container if desired. This can be done in the following way.

`docker ps`

```
CONTAINER ID        IMAGE                        COMMAND                  CREATED             STATUS              PORTS                              NAMES
cfca55fa3b17        web:microprofile             "./startup.sh"           20 minutes ago      Up 20 minutes       0.0.0.0:8000->8000/tcp 
```

Grab the container id.

- Do `docker stop <CONTAINER ID>`
In this case it will be, `docker stop cfca55fa3b17`
- Do `docker rm <CONTAINER ID>`
In this case it will be, `docker rm cfca55fa3b17`


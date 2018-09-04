# refarch-cloudnative-bluecompute-web: Angular.JS Single Page Application with Node.JS backend

## Introduction
The sample Web application is built to demonstrate how to access the Omnichannel APIs hosted on Kubernetes Environment. The application provides the basic function to allow user to browse the Catalog items, make an Order and review profile. The Web application is built with AngularJS in Web 2.0 Single Page App style. It uses a Node.js backend to host the static content and implement the BFF (Backend for Frontend) pattern.

![Application Architecture](https://raw.githubusercontent.com/ibm-cloud-architecture/refarch-cloudnative-bluecompute-web/spring/static/imgs/2_catalog.png?raw=true)

Here is an overview of the project's features:
- AngularJS SPA.
- Node.js based BFF application to access APIs.
- Authentication and Authorization through OAuth 2.0.
- DevOps toolchain to build/deploy web app.
- Distributed as Docker container and deployed to Kubernetes cluster.

## Chart Source
The source for the `Web` chart can be found at:
* https://github.com/ibm-cloud-architecture/refarch-cloudnative-bluecompute-web/tree/master/spring/web

## Deploy Web Application to Kubernetes Cluster from CLI
To deploy the Web Chart and its MySQL dependency Chart to a Kubernetes cluster using Helm CLI, follow the instructions below:
```bash
# Clone web repository:
$ git clone -b spring --single-branch https://github.com/ibm-cloud-architecture/refarch-cloudnative-bluecompute-web.git

# Go to Chart Directory
$ cd refarch-cloudnative-bluecompute-web/chart/web

# Download MySQL Dependency Chart
$ helm dependency update

# Deploy Web and MySQL to Kubernetes cluster
$ helm upgrade --install web --set service.type=NodePort .
```
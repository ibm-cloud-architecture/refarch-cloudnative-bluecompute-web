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

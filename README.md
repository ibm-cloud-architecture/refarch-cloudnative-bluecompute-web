# BlueCompute Web Application by IBM Cloud

## Web Service

[![Build Status](https://api.travis-ci.org/ibm-cloud-architecture/refarch-cloudnative-bluecompute-web.svg?branch=microprofile)](https://travis-ci.org/ibm-cloud-architecture/refarch-cloudnative-bluecompute-web)

*This project is part of the 'IBM Cloud Native Reference Architecture' suite, available at
https://github.com/ibm-cloud-architecture/refarch-cloudnative-kubernetes*


* [Introduction](#introduction)
* [How it works](#how-it-works)
* [Deploying the Bluecompute App](#deploying-the-bluecompute-app)
* [Running the Web Application Locally](#running-the-web-application-locally)

## Introduction

The sample Web application is built to demonstrate how to access the omnichannel APIs hosted on IBM Cloud. The application provides the basic function to allow user to browse the Catalog items, make an Order and check the profile. The Web application is built with AngularJS in Web 2.0 Single Page App style. It uses a Node.js backend to host the static content and implement the BFF (Backend for Frontend) pattern.

Here is an overview of the project's features:
- AngularJS SPA
- Node.js based BFF application to access APIs
- Authentication and Authorization through Open ID Connect.
- Distributed as Docker container and deployed to Kubernetes cluster.

## How it works

Web Microservice serves 'IBM Cloud Native Reference Architecture' suite, available at https://github.com/ibm-cloud-architecture/refarch-cloudnative-kubernetes, Microservice-based reference application. Though it is a part of a bigger application, Web service itself is an application that serves as a user interface for BlueCompute.

## Deploying the Bluecompute App

To build and run the entire Bluecompute demo application, all the microservices must be spun up together. This is due to how we set up our Helm chart structure and how we dynamically produce our endpoints and URLs.

Further instructions are provided [here](https://github.com/ibm-cloud-architecture/refarch-cloudnative-kubernetes/tree/microprofile).

### IBM Cloud Private

To deploy it on IBM Cloud Private, please follow the instructions provided [here](https://github.com/ibm-cloud-architecture/refarch-cloudnative-kubernetes/blob/microprofile/docs/icp.md).

### Minikube

To deploy it on Minikube, please follow the instructions provided [here](https://github.com/ibm-cloud-architecture/refarch-cloudnative-kubernetes/blob/microprofile/docs/minikube.md).

## Running the Web Application Locally

To deploy the Web application locally...

#### Running the application on Minikube

1. Run the helm chart as below.
	
	`helm install --name=web chart/web`
	
	You will see a deployment message like below.
	
	```
	==> v1/Deployment
	NAME     READY  UP-TO-DATE  AVAILABLE  AGE
	web-web  0/1    1           0          0s
	```
	
	Please wait till your deployment is ready. To verify, run the below command and you should see the availability.
	
	`kubectl get deployments`
	
	You will see something like below.
	
	```
	NAME      READY   UP-TO-DATE   AVAILABLE   AGE
	web-web   1/1     1            1           2m
	```

2. You can access the application at `http://<MinikubeIP>:<PORT>`. To get the access url.

	- To get the IP, Run this command.
	
	`minikube ip`
	
	You will see something like below.
	
	```
	192.168.99.100
	```
	
	- To get the port, run this command.
	
	`kubectl get service web-web`
	
	You will see something like below.
	
	```
	NAME      TYPE       CLUSTER-IP    EXTERNAL-IP   PORT(S)        AGE
	web-web   NodePort   10.98.47.48   <none>        80:30894/TCP   3m
	```
	
	In the above case, the access url will be `http://192.168.99.100:30894/`.
	
	<p align="center">
	    <img src="https://github.com/ibm-cloud-architecture/refarch-cloudnative-kubernetes/blob/microprofile/static/imgs/bc_mp_ui.png">
	</p>

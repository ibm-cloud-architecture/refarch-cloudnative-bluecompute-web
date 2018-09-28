# refarch-cloudnative-bluecompute-web: Angular.JS Single Page Application with Node.JS backend
[![Build Status](https://travis-ci.org/ibm-cloud-architecture/refarch-cloudnative-bluecompute-web.svg?branch=spring)](https://travis-ci.org/ibm-cloud-architecture/refarch-cloudnative-bluecompute-web)

*This project is part of the 'IBM Cloud Native Reference Architecture' suite, available at
https://github.com/ibm-cloud-architecture/refarch-cloudnative-kubernetes/tree/spring*

## Table of Contents
  * [Introduction](#introduction)
  * [Pre-requisites:](#pre-requisites)
  * [Deploy Web Application to Kubernetes Cluster](#deploy-web-application-to-kubernetes-cluster)
    + [Setup: Install Microservice Charts](#setup-install-microservice-charts)
    + [Deploy Web Application Chart](#deploy-web-application-chart)
  * [Validate the Web Application](#validate-the-web-application)
  * [Deploy Web Application on Docker](#deploy-web-application-on-docker)
    + [Get the Microservices Endpoints](#get-the-microservices-endpoints)
    + [Deploy the Web Docker Container](#deploy-the-web-docker-container)
  * [Run Web Application on localhost](#run-web-application-on-localhost)
    + [Edit the Endpoints in the Config File](#edit-the-endpoints-in-the-config-file)
    + [Start the Web Application](#start-the-web-application)
  * [Optional: Setup CI/CD Pipeline](#optional-setup-cicd-pipeline)
  * [Conclusion](#conclusion)
  * [Contributing](#contributing)
    + [GOTCHAs](#gotchas)
    + [Contributing a New Chart Package to Microservices Reference Architecture Helm Repository](#contributing-a-new-chart-package-to-microservices-reference-architecture-helm-repository)

## Introduction
The sample Web application is built to demonstrate how to access the Omnichannel APIs hosted on Kubernetes Environment. The application provides the basic function to allow user to browse the Catalog items, make an Order and review profile. The Web application is built with AngularJS in Web 2.0 Single Page App style. It uses a Node.js backend to host the static content and implement the BFF (Backend for Frontend) pattern.

![Application Architecture](static/imgs/2_catalog.png?raw=true)

Here is an overview of the project's features:
- AngularJS SPA.
- Node.js based BFF application to access APIs.
- Authentication and Authorization through OAuth 2.0.
- DevOps toolchain to build/deploy web app.
- Distributed as Docker container and deployed to Kubernetes cluster.

## Pre-requisites:
* Create a Kubernetes Cluster by following the steps [here](https://github.com/ibm-cloud-architecture/refarch-cloudnative-kubernetes#create-a-kubernetes-cluster).
* Install the following CLI's on your laptop/workstation:
    + [`docker`](https://docs.docker.com/install/)
    + [`kubectl`](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
    + [`helm`](https://docs.helm.sh/using_helm/#installing-helm)
* Clone web repository:
```bash
$ git clone -b spring --single-branch https://github.com/ibm-cloud-architecture/refarch-cloudnative-bluecompute-web.git
$ cd refarch-cloudnative-bluecompute-web
```

## Deploy Web Application to Kubernetes Cluster
In order for the Web Application to fully work, you will need to do the following:
* Deploy all the microservice charts into your Kubernetes cluster.
* Install the web chart and set the endpoints for the microservices.

Note that you will need a cluster with about 8GB of available RAM to be able to deploy all of the microservices and also run the web application.

### Setup: Install Microservice Charts
The main benefit of leveraging the microservice helm charts is that the charts will take care of things such as initializing the database and checking that their dependency charts (i.e. MySQL, CouchDB, and Elasticsearch) are fully up and running before starting themselves.

The main thing to get right when installing the microservice charts is to make sure that the auth, customer (installed with auth), and orders charts share the same `HS256_KEY` secret, which is used to sign the JWT token that is used to make requests such as login, viewing profile, and making purchases.

To install the microservice charts, run the commands below:

```bash
# Set HS256_KEY secret, which will be used by the charts
HS256_KEY=E6526VJkKYhyTFRFMC0pTECpHcZ7TGcq8pKsVVgz9KtESVpheEO284qKzfzg8HpWNBPeHOxNGlyudUHi6i8tFQJXC8PiI48RUpMh23vPDLGD35pCM0417gf58z5xlmRNii56fwRCmIhhV7hDsm3KO2jRv4EBVz7HrYbzFeqI45CaStkMYNipzSm2duuer7zRdMjEKIdqsby0JfpQpykHmC5L6hxkX0BT7XWqztTr6xHCwqst26O0g8r7bXSYjp4a

# Add ibmcase-charts helm repo
helm repo add ibmcase-charts https://raw.githubusercontent.com/ibm-cloud-architecture/refarch-cloudnative-kubernetes/spring/docs/charts;

# Install catalog chart, which also installs inventory dependency chart
helm upgrade --install catalog --version 0.5.0 --set service.type=NodePort ibmcase-charts/catalog;

# Install auth chart, which also installs customer dependency chart
helm upgrade --install auth --version 0.5.0 --set service.type=NodePort,customer.service.type=NodePort --set hs256hey.secret=$HS256_KEY,customer.hs256hey.secret=$HS256_KEY ibmcase-charts/auth;

# Install orders chart
helm upgrade --install orders --version 0.5.0 --set service.type=NodePort --set hs256hey.secret=$HS256_KEY ibmcase-charts/orders;
```

To check if the charts were successfully deployed, you can run the following command:
```bash
helm list

NAME    REVISION  UPDATED                   STATUS    CHART         NAMESPACE
auth    1         Mon Sep  3 14:14:34 2018  DEPLOYED  auth-0.5.0    default
catalog 1         Mon Sep  3 14:14:29 2018  DEPLOYED  catalog-0.5.0 default
orders  1         Mon Sep  3 14:14:37 2018  DEPLOYED  orders-0.5.0  default
```

The above output shows that the charts themselves were deployed properly. However, the above output does not explain the state of the pods themselves. To check whether the pods themselves are running in a healthy state, run the following command:
```bash
kubectl get pods

NAME                                                        READY     STATUS      RESTARTS   AGE
auth-auth-5454cfdf46-dcgng                                  1/1       Running     0          2m
auth-customer-55f6495fbb-9x56k                              1/1       Running     0          2m
auth-customer-create-user-0jrwm-dnzxz                       0/1       Error       0          2m
auth-customer-create-user-0jrwm-zrr8v                       0/1       Completed   0          1m
bluecompute-catalog-elasticsearch-client-78b9dbcb69-r4z8z   1/1       Running     0          2m
bluecompute-catalog-elasticsearch-data-0                    1/1       Running     0          2m
bluecompute-catalog-elasticsearch-master-0                  1/1       Running     0          2m
bluecompute-catalog-elasticsearch-master-1                  1/1       Running     0          1m
bluecompute-customer-customercouchdb-0                      2/2       Running     0          2m
bluecompute-inventory-mysql-8474847fdb-45f9b                1/1       Running     0          2m
bluecompute-orders-mysql-79bb65b6f9-cxz9t                   1/1       Running     0          2m
catalog-catalog-5b5fd6ff5-mz2r2                             1/1       Running     0          2m
catalog-inventory-7c5977bcbd-lrpp8                          1/1       Running     0          2m
catalog-inventory-populate-mysql-acidq-9hs5b                0/1       Completed   0          2m
orders-orders-7f54ddd894-f7fnw                              1/1       Running     0          2m
```

The output above shows you all of the pods that were created by the `helm upgrade` commands. Here is a simple breakdown of what each of these pods are:
* The `auth-auth-` pod is the pod for the Auth microservice.
* The `auth-customer-` pod is the pod for the Customer microservice.
  + The reason for the `auth-` prefix is because it was installed as part of the Auth microservice chart.
* The `auth-customer-create-user-` are part of a job that attempts to create a user via the Customer microservice.
  + The reason you see more than 1 is because the Kubernetes Job will create new pods until the job (which runs in the pod) succeeds.
  + The pods, successful or not, are still left behind for debugging purposes.
* The `bluecompute-catalog-elasticsearch-` pods belong to the Elasticsearch instance that runs as part of the Catalog chart.
* The `bluecompute-customer-customercouchdb-` pod belongs to the CouchDB instance that runs as part of the Customer chart.
* The `bluecompute-inventory-mysql-` pod belongs to the MySQL instance that runs as part of the Inventory chart, which itself is included in the Catalog chart.
* The `bluecompute-orders-mysql-` pod belongs to the MySQL instance that runs as part of the Orders chart.
* The `catalog-catalog-` pod is the pod for the Catalog microservice.
* The `catalog-inventory-` pod is the pod for the Inventory microservice, which is included in the Catalog chart.
* The `catalog-inventory-populate-mysql-` is part of a job that attempts to populate the Inventory MySQL instance with inventory data.
* The `orders-orders-` pod is the pod for the Orders microservice.

The best way to tell that everything is working is that both Job pods (`create-user` and `populate-mysql`) have a status of `Completed` (even if a previous job failed) and all other pods have a status of `Running`.


### Deploy Web Application Chart
In this section, we are going to deploy the Web Application using Helm as well as setting the microservice endpoints to the right services in Kubernetes. To do so, follow the instructions below:
```bash
# Deploy Web and MySQL to Kubernetes cluster
helm upgrade --install web --set service.type=NodePort \
  --set services.auth.host=auth-auth,services.auth.port=8080 \
  --set services.catalog.host=catalog-catalog,services.catalog.port=8081 \
  --set services.customer.host=auth-customer,services.customer.port=8080 \
  --set services.orders.host=orders-orders,services.orders.port=8080 \
  chart/web
```

The last command will give you instructions on how to access/test the Web application. Please note that all other microservices must be fully up and running for the Web application to work properly.

To check and wait for the deployment status, you can run the following command:
```bash
$ kubectl get deployments -w
NAME                  DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
web-web   			      1         1         1            1           10h
```

The `-w` flag is so that the command above not only retrieves the deployment but also listens for changes. If you a 1 under the `CURRENT` column, that means that the web app deployment is ready.

## Validate the Web Application
Once the application is deployed, open a new web browser window and enter the following address:
* http://${IP_ADDRESS}:${PORT}

Where:
* `${IP_ADDRESS}` is either the Node IP address of one of your Kubernetes cluster's worker nodes or localhost (if running from your workstation).
* `${PORT}` is either the Node Port of one of your Kubernetes cluster's worker nodes or 8000 (if running from your workstation).

If successful, you should see the home page below:
![home](static/imgs/1_home.png?raw=true)

Now let's click the `Catalog` tab or the `BROWSE ITEM CATALOG` button to open catalog page, which should look like the following:
![catalog](static/imgs/2_catalog.png?raw=true)

If you are able to see the catalog above, then that means that the Catalog service was able to serve data from its Elasticsearch database, which gets populated by pulling data from the Inventory service.

Now, let's attempt to login using the Auth service, which will then allow us purchase items from the catalog. To start login, first click the `Log In` tab, which will bring the login below:
![login](static/imgs/3_login.png?raw=true)

If you see the above window, enter the following credentials and click `Sign in` button:
* **Username:** `user`
* **Password:** `passw0rd`

If login was successful, you will be taken back to the catalog page below, which now shows the `Profile` and `Logout` tabs in the top right bar:
![catalog_login](static/imgs/4_catalog_login.png?raw=true)

Now that we are logged in, let's attempt to purchase one of the items in the catalog. For this example, we are going to purchase the `Electric Card Collator`. To start the buying process, click on the `Electric Card Collator` image, which will take you to its details page:
![purchase](static/imgs/5_purchase.png?raw=true)

Once you get the page above, click on the dropdown button under the `Place your order here:` text, select `2`, and then click the `Buy` button. You should get the `* Your order was placed successfully!` green message, which means your order was successful.

To see the order details, let's go to the profile tab by clicking the `Profile` tab on the top right.
![purchase](static/imgs/6_profile.png?raw=true)

On the profile page above you will see 2 sections. The left section is the user profile section, which displays user data from the `Customer` microservice. The right section is the `Order History` section, which should display the `Electric Card Collator` order you just made. If that's the case, then that means that you have validated the web application!

Feel free to play around and explore the Web application.

## Deploy Web Application on Docker
You can also run the Web Application locally on Docker. Before we show you how to do so, you will need to do the following:
* Deploy all of the microservices in a Kubernetes cluster.
  + We are choosing to go this route for simplicity and to avoid deploying all of the microservices in your workstation and potentially overload it.
* Edit the [StoreWebApp/config/default.json](StoreWebApp/config/default.json) and add the endpoints for all the microservices.

### Get the Microservices Endpoints
The microservice endpoints are composed of a worker node IP address and a node port for each microservice.

To get the IP address of one of your worker nodes, run one of the following commands:
```bash
# IBM Cloud Kubernetes Service:
NODE_IP=$(bx cs workers $YOUR_CLUSTER_NAME | grep -v '^*' | egrep -v "(ID|OK)" | awk '{print $2;}' | head -n1)

# IBM Cloud Private:
NODE_IP=$PROXY_NODE_EXTERNAL_IP

# Minikube:
NODE_IP=$(minikube ip)

# Others:
NODE_IP=$(kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="ExternalIP")].address}' | awk '{print $1}')
```

To get the node ports for all the microservices, just run the following command:
```bash
# Auth
AUTH_PORT=$(kubectl --namespace default get service auth-auth -o jsonpath='{.spec.ports[0].nodePort}');
# Catalog
CATALOG_PORT=$(kubectl --namespace default get service catalog-catalog -o jsonpath='{.spec.ports[0].nodePort}');
# Customer
CUSTOMER_PORT=$(kubectl --namespace default get service auth-customer -o jsonpath='{.spec.ports[0].nodePort}');
# Auth
ORDERS_PORT=$(kubectl --namespace default get service orders-orders -o jsonpath='{.spec.ports[0].nodePort}');
```

The above commands assume that the service names for the microservices are as shown above (`auth-auth`, `catalog-catalog`, `auth-customer`, and `orders-orders`). It also assumes that all of the services are of type `NodePort`, which is the way they were deployed in the [Setup: Install Microservice Charts](#setup-install-microservice-charts) section. If your service names are different or you are in doubt of what they are, you can run the following command to confirm:

```bash
kubectl get services | grep NodePort

auth-auth                                     NodePort    172.21.167.156   <none>        8080:31355/TCP   3h
auth-customer                                 NodePort    172.21.106.167   <none>        8080:32376/TCP   3h
catalog-catalog                               NodePort    172.21.102.138   <none>        8081:30027/TCP   3h
orders-orders                                 NodePort    172.21.144.87    <none>        8080:31383/TCP   2h
```

The output above shows you the service names on the left column and their corresponding node ports in the 5th column between the `:` and the `/` (i.e. for `auth-auth`, the NodePort is 31355).

### Deploy the Web Docker Container
To deploy the Web container, run the following commands:
```bash
# Build the Docker Image
$ docker build -t web .

# Start the Web Container
$ docker run --name web \
  -e AUTH_HOST=$NODE_IP -e AUTH_PORT=$AUTH_PORT \
  -e CATALOG_HOST=$NODE_IP -e CATALOG_PORT=$CATALOG_PORT \
  -e CUSTOMER_HOST=$NODE_IP -e CUSTOMER_PORT=$CUSTOMER_PORT \
  -e ORDERS_HOST=$NODE_IP -e ORDERS_PORT=$ORDERS_PORT \
  -p 8000:8000 \
  -d web
```

Where:
* `$NODE_IP` is IP address of a Kubernetes cluster worker node.
* `$AUTH_PORT` is the node port for the Auth service.
* `$CATALOG_PORT` is the node port for the Catalog service.
* `$CUSTOMER_PORT` is the node port for the Customer service.
* `$ORDERS_PORT` is the node port for the Orders service.

Assuming everything was deployed correctly, you can follow the instructions in [Validate the Web Application](#validate-the-web-application) section to make sure everything works as expected.

That's it, you have successfully deployed and tested the Web microservice in Docker.

## Run Web Application on localhost
You can also run the Web Application locally on Docker. Before we show you how to do so, you will need to do the following:
* Deploy all of the microservices in a Kubernetes cluster as shown in [Setup: Install Microservice Charts](#setup-install-microservice-charts).
  + We are choosing to go this route for simplicity and to avoid deploying all of the microservices in your workstation and potentially overload it.
* Edit the [StoreWebApp/config/default.json](StoreWebApp/config/default.json) and add the endpoints for all the microservices.

### Edit the Endpoints in the Config File
Open the [StoreWebApp/config/default.json](StoreWebApp/config/default.json) file and enter the worker node IP and the node port in the `IP_ADDRESS:PORT` format for each microservice in the following fields:
* `APIs.catalog.service_name`
* `APIs.orders.service_name`
* `APIs.customer.service_name`
* `APIs.oauth20.service_name`
  + This one is the auth service, FYI.

Now save the file and you should be good to go.

### Start the Web Application

```bash
# Navigate to source folder
cd StoreWebApp;

# Install NPM and Bower dependencies
npm install;

# Start the application, which opens a new browser window
npm start;
```

Assuming everything was deployed correctly, you can follow the instructions in [Validate the Web Application](#validate-the-web-application) section to make sure everything works as expected.

That's it, you have successfully deployed and tested the Web microservice locally.

## Optional: Setup CI/CD Pipeline
If you would like to setup an automated Jenkins CI/CD Pipeline for this repository, we provided a sample [Jenkinsfile](Jenkinsfile), which uses the [Jenkins Pipeline](https://jenkins.io/doc/book/pipeline/) syntax of the [Jenkins Kubernetes Plugin](https://github.com/jenkinsci/kubernetes-plugin) to automatically create and run Jenkis Pipelines from your Kubernetes environment. 

To learn how to use this sample pipeline, follow the guide below and enter the corresponding values for your environment and for this repository:
* https://github.com/ibm-cloud-architecture/refarch-cloudnative-devops-kubernetes

## Conclusion
You have successfully deployed and tested the Web Microservice and a MySQL database both on a Kubernetes Cluster and in local Docker Containers.

To see the Web app working in a more complex microservices use case, checkout our Microservice Reference Architecture Application [here](https://github.com/ibm-cloud-architecture/refarch-cloudnative-kubernetes/tree/spring).

## Contributing
If you would like to contribute to this repository, please fork it, submit a PR, and assign as reviewers any of the GitHub users listed here:
* https://github.com/ibm-cloud-architecture/refarch-cloudnative-bluecompute-web/graphs/contributors

### GOTCHAs
1. We use [Travis CI](https://travis-ci.org/) for our CI/CD needs, so when you open a Pull Request you will trigger a build in Travis CI, which needs to pass before we consider merging the PR. We use Travis CI to test the following:
    * Building and running the Web app and run API tests.
    * Build and Deploy a Docker Container.
    * Run API tests against the Docker Container.
    * Deploy a minikube cluster to test Helm charts.
    * Package the Helm chart.
    * Deploy the Helm Chart into Minikube.
    * Run API tests against the Helm Chart.

2. We don't deploy all of the other microservices locally due to Travis CI only giving 4GB of memory and we need 6-8GB to test the whole thing.
    * Perhaps this can be improved upon in the future.

### Contributing a New Chart Package to Microservices Reference Architecture Helm Repository
To contribute a new chart version to the [Microservices Reference Architecture](https://github.com/ibm-cloud-architecture/refarch-cloudnative-kubernetes/tree/spring) helm repository, follow its guide here:
* https://github.com/ibm-cloud-architecture/refarch-cloudnative-kubernetes/tree/spring#contributing-a-new-chart-to-the-helm-repositories
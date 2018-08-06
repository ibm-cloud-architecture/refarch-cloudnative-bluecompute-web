***In this repo, the branches will be refactored within 14 days. The current branches will be condensed down to `master`, `spring`, `microprofile` and `tutorial`. Existing `master` will be renamed to `spring` and the new `master` will have documentation pointing to the relevant branches.***

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

3. Validate the application.

   The application is lunched in a browser at:

   [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

  ![BlueCompute List](static/imgs/bluecompute_web_home.png?raw=true)

  You wouldn't be able to validate the rest of the functions without deploying other Micservices locally.


## Deploy the application to Bluemix Kubernetes cluster:

You can deploy the web application to your Bluemix Kubernetes cluster as a Chart, or using the automated CI/CD or manually if you would like to get familiar with the detail. Make sure you have your environment configured based on the [setup your environment guide](https://github.com/ibm-cloud-architecture/refarch-cloudnative-kubernetes/tree/kube-int#step-1-environment-setup).

You need to have your Kubernetes cluster provisioned in Bluemix. If you haven't done so, please follow [instruction here](https://github.com/ibm-cloud-architecture/refarch-cloudnative-kubernetes/tree/kube-int#step-2-provision-a-kubernetes-cluster-on-ibm-bluemix-container-service). Then, point your local `kubectl` cli to the target Kubernetes cluster. For example:

```
  $ export KUBECONFIG=/Users/{yourusername}/.bluemix/plugins/cs-cli/clusters/my_cluster/{yourcluster}.yml
```

### Install as a Kubernetes Chart

We have packaged BlueCompute web application as a Kubernetes chart, you can simply install it as a Kubernetes chart into your cluster.

From the git repository root folder, issue following command:

    `$ cd docker`  

#### Lite cluster
If you provisioned a free Lite cluster on bluemix, install the web app free edition:

    `helm install chart/bluecompute-web-ce`   

#### Paid cluster
If you provisioned a paid cluster on bluemix, install the web app free edition:

    `helm install chart/bluecompute-web`   

### Deploy BlueCompute using the CI/CD pipeline

As part of the overall Bluemix CI/CD pipeline, you can build and deploy the BlueCompute web application using the Jenkins based pipeline. It will build the docker image, push to Bluemix docker registry, then deploy the application to your Kubernetes cluster.

You need to have the BlueCompute Jenkins based DevOps toolchains and pipeline configured, please follow this [setup instruction](https://github.com/ibm-cloud-architecture/refarch-cloudnative-devops-kubernetes).  

You can follow the [Create and Run a Sample CI/CD Pipeline](https://github.com/ibm-cloud-architecture/refarch-cloudnative-devops-kubernetes#create-and-run-a-sample-cicd-pipeline) instruction to setup the Pipeline for BlueCompute web app. Following is summary of steps:

1. Log into your Jenkins UI. From home page, click "New Item" from Left navigation menu.  
2. Name the new item `bluecompute-web`, then choose the "Pipeline" type. Click "Ok".  
3. In Pipeline configuration page, Chose "Pipeline script from SCM" from the definition drop down box. the select "**Git**" as SCM type. and Enter the git repository URL as `https://github.com/ibm-cloud-architecture/refarch-cloudnative-bluecompute-web`. Lastly, in the Script Path field, enter `Jenkinsfile`. Click Save.
4. You Pipeline should look like following. You are ready to run your pipeline.

![BlueCompute Web CI/CD](static/imgs/bluecompute_web_pipeline.png?raw=true)  


## Validate the deployment


Once the application is deployed successfully to Bluemix, you can browse your Web app at:

[http://{your_kube_cluster_name}.containers.mybluemix.net](http://{your_kube_cluster_name}.containers.mybluemix.net)

Replace the {your_kube_cluster_name} with your actual Kubernetes cluster name.

Click the "Browse Item Catalog" will load the list of items:

![BlueCompute Detail](static/imgs/bluemix_25.png?raw=true)

Click on one of the items will bring you to the detail page.

Click "login" and enter "user" as username and "passw0rd" as password. This should log you in.

Navigate to any of the item detail page, now you should see "Buy" and "Add review" buttons, as well as "Profile" menu item. Try to Buy some items.

![BlueCompute Buy](static/imgs/bluecompute_web_buy.png?raw=true)


Feel free to play around and explore the Web application.
**NOTE:** the review function is not supported in this version of the BlueCompute.

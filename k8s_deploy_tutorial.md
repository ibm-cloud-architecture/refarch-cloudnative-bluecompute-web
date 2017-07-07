# Update the Web Application using Kubernetes CLI

## Introduction
In this tutorial you will learn how to update the Web App Kubernetes deployment by updating the deployment's Docker images. You will get to see the deployment's history, and also how to rollback the deployment to a previously used Docker image.

## Pre-Requisites
* Complete up to [Step 5](https://cloudcontent.mybluemix.net/devops/method/tutorials/kubernetes?task=5) of Kubernetes Tutorial.

## Checkout STSA lab code
1. Checkout `stsa` branch:

```
$ cd ../refarch-cloudnative-bluecompute-web
$ git checkout stsa
```

2. Open the `StoreWebApp/public/resources/components/views/home.html` in your code editor to see the new changes.
    * You should see a header tag that says `Welcome to STSA!` instead of `BlueCompute Store!` 

## Update the Web App Deployment with a new Docker Image

### Typical Kubernetes Deployment
On a typical kubernetes deployment scenario, a developer will perform the following steps:

1. Make changes to application level code.
2. Build a new Docker image with new code changes.
3. Push the new Docker image to a Docker registry.
4. Deploy the new Docker image by updating the Kubernetes Deployment by doing the following:
    * `kubectl set image deployment/<deployment-name> <container-name>=<image-name>:<tag>`
        * `<deployment-name>` is the deployment name in the `deployment.yaml` file.
        * `<container-name>` is the container name in the `deployment.yaml` file.
        * `<image-name>` is the name of the new Docker image that was pushed to the Docker registry.
        * `<tag>` is the tag of the new Docker image that was pushed to the Docker registry.

To avoid spending too much time building docker images in this tutorial, we created and pushed a pre-built Docker image to the `ibmcase` registry in Docker Hub. You can check out the `stsa` image in Docker Hub [here](https://hub.docker.com/r/ibmcase/bluecompute-web/tags/).

### Check Docker image prior to updating
Before we update the web app deployment, let's take a look at the current Docker image in the existing deployment YAML by using the following command:

`$ kubectl get deployment bluecompute-web-deployment -o yaml | grep "image:"`

You should see the following output, which shows the docker image used in the Tutorial:

```
$ kubectl get deployment bluecompute-web-deployment -o yaml | grep "image:"
      - image: ibmcase/bluecompute-web:latest
```

### Update Docker image
Now let's update the deployment docker image as follows:

`$ kubectl set image deployment/bluecompute-web-deployment web-ce=ibmcase/bluecompute-web:stsa`

If successful, you should see the following output:

`deployment "bluecompute-web-deployment" image updated`

### Validate Deployment History
Let's validate that the new deployment registered in the deployment history, which means that we can perform a deployment version rollback if needed:

```
$ kubectl rollout history deployment/bluecompute-web-deployment
deployments "bluecompute-web-deployment"
REVISION    CHANGE-CAUSE
1       <none>
2       <none>
```

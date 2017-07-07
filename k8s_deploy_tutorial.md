# Update the Web Application using Kubernetes CLI

## Table of Contents
- **[Introduction](#introduction)**
- **[Pre-Requisites](#pre-requisites)**
- **[Checkout STSA lab code](#checkout-stsa-lab-code)**
- **[Update the Web App Deployment with a new Docker Image](#update-the-web-app-deployment-with-a-new-docker-image)**
    - [Typical Kubernetes Deployment](#typical-kubernetes-deployment)
    - [Check Docker image prior to updating](#check-docker-image-prior-to-updating)
    - [Update Docker image](#update-docker-image)
    - [Validate Deployment History](#validate-deployment-history)
- **[Scale Up Deployment Replicas](#scale-up-deployment-replicas)**
    - [Check existing deployment replicas](#check-existing-deployment-replicas)
    - [Update the number of replicas in deployment](#update-the-number-of-replicas-in-deployment)
    - [Validate the new number of replicas in deployment](#validate-the-new-number-of-replicas-in-deployment)
- **[Validate the Web App](#validate-the-web-app)**
- **[Rollback changes](#rollback-changes)**
    - [Scale down number of replicas in deployment](#scale-down-number-of-replicas-in-deployment)
    - [Validate the number of replicas in deployment](#validate-the-number-of-replicas-in-deployment)
    - [Rollback deployment](#rollback-deployment)
    - [Validate the Web App Rollback Changes](#validate-the-web-app-rollback-changes)

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

You should see more than one entry in the revisions table above, which means that the new deployment revision registered successfully.

## Scale Up Deployment Replicas

### Check existing deployment replicas
Now that we updated the deployment to a new Docker image, let's try to scale up the number of pod replicas in the deployment. Before doing so, let's check how many replicas the deployment currently has with the following command:

```
$ kubectl get deployment bluecompute-web-deployment
NAME                         DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
bluecompute-web-deployment   1         1         1            1           50m
```

Notice under the `CURRENT` column that the deployment currently has `1` replica. 

### Update the number of replicas in deployment
Now, let's scale it up to `2` replicas with the following command:

```
$ kubectl scale deployment bluecompute-web-deployment --replicas=2
deployment "bluecompute-web-deployment" scaled
```

If successful, you should see an output similar to the above.

### Validate the new number of replicas in deployment
Now let's validate that the deployment has `2` replicas with the following command:

```
$ kubectl get deployment bluecompute-web-deployment
NAME                         DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
bluecompute-web-deployment   2         2         2            2           54m
```

Notice under the `CURRENT` column that the deployment now has `2` replicas, which means that the new replica was created successfully!

## Validate the Web App
Now that we updated the deployment's image and replicas, let's open the web application in the browser and validate that the new code is running. To get the web app url, please copy and paste the following 3 lines into your terminal:

```
nodeip=$(kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="ExternalIP")].address}' | awk '{print $1}'); \
port=$(kubectl get service bluecompute-web -o jsonpath='{.spec.ports[0].nodePort}'); \
echo "http://${nodeip}:${port}"
```

Now, open a new browser window and paste the URL. If successful, you should see web page that looks like the following:

![BlueCompute List](static/bluecompute_stsa.png?raw=true)

You have successfully updated the Bluecompute Web App Deployment!


## Rollback changes
Now let's rollback the web application deployment to it's original conditions.

### Scale down number of replicas in deployment
Now, let's scale it down to `1` replica with the following command:

```
$ kubectl scale deployment bluecompute-web-deployment --replicas=1
deployment "bluecompute-web-deployment" scaled
```

If successful, you should see an output similar to the above.

### Validate the number of replicas in deployment
Now let's validate that the deployment has `1` replica with the following command:

```
$ kubectl get deployment bluecompute-web-deployment
NAME                         DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
bluecompute-web-deployment   1         1         1            1           1h
```

Notice under the `CURRENT` column that the deployment now has `1` replicas, which means that we scalled down the replica number successfully!

### Rollback deployment
Now let's rollback the Web App deployment to the original image with the following command:
```
$ kubectl rollout undo deployment/bluecompute-web-deployment
deployment "bluecompute-web-deployment" rolled back
```

If successful, you should see an output similar to above.

### Validate the Web App Rollback Changes
Now that we rolled back the deployment's image and replicas, let's open the web application in the browser and validate that the original code is running. To get the web app url, please copy and paste the following 3 lines into your terminal:

```
nodeip=$(kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="ExternalIP")].address}' | awk '{print $1}'); \
port=$(kubectl get service bluecompute-web -o jsonpath='{.spec.ports[0].nodePort}'); \
echo "http://${nodeip}:${port}"
```


Now, open a new browser window and paste the URL. If successful, you should see web page that looks like the following:

![BlueCompute List](static/bluecompute_stsa_original.png?raw=true)

You have successfully rolled back the Bluecompute Web App Deployment!
# BlueCompute Web Application by IBM Cloud

## Web Service

*This project is part of the 'IBM Cloud Native Reference Architecture' suite, available at
https://github.com/ibm-cloud-architecture/refarch-cloudnative-kubernetes*

1. [Introduction](#introduction)
2. [How it works](#how-it-works)
3. [Running the app and stopping it](#running-the-app-and-stopping-it)
    1. [Pre-requisites](#pre-requisites)
    2. [Locally in Minikube](#locally-in-minikube)
    3. [Remotely in ICP](#remotely-in-icp)
4. [References](#references)

### Introduction

The sample Web application is built to demonstrate how to access the Omnichannel APIs hosted on IBM Cloud . The application provides the basic function to allow user to browse the Catalog items, make an Order and check the profile. The Web application is built with AngularJS in Web 2.0 Single Page App style. It uses a Node.js backend to host the static content and implement the BFF (Backend for Frontend) pattern.

Here is an overview of the project's features:
- AngularJS SPA
- Node.js based BFF application to access APIs
- Authentication and Authorization through Open ID Connect.
- Distributed as Docker container and deployed to Kubernetes cluster.

### How it works

Web Microservice serves 'IBM Cloud Native Reference Architecture' suite, available at https://github.com/ibm-cloud-architecture/refarch-cloudnative-kubernetes, Microservice-based reference application. Though it is a part of a bigger application, Web service is itself an application that serves as User Interface for BlueCompute.

### Running the app and stopping it

#### Pre-requisites

To run the Web microservice, please complete the [Building the app](#building-the-app) section before proceeding to any of the following steps.

1. Locally in Minikube

To run the Web application locally on your laptop on a Kubernetes-based environment such as Minikube (which is meant to be a small development environment) we first need to get few tools installed:

- [Kubectl](https://kubernetes.io/docs/user-guide/kubectl-overview/) (Kubernetes CLI) - Follow the instructions [here](https://kubernetes.io/docs/tasks/tools/install-kubectl/) to install it on your platform.
- [Helm](https://github.com/kubernetes/helm) (Kubernetes package manager) - Follow the instructions [here](https://github.com/kubernetes/helm/blob/master/docs/install.md) to install it on your platform.

Finally, we must create a Kubernetes Cluster. As already said before, we are going to use Minikube:

- [Minikube](https://kubernetes.io/docs/getting-started-guides/minikube/) - Create a single node virtual cluster on your workstation. Follow the instructions [here](https://kubernetes.io/docs/tasks/tools/install-minikube/) to get Minikube installed on your workstation.

We not only recommend to complete the three Minikube installation steps on the link above but also read the [Running Kubernetes Locally via Minikube](https://kubernetes.io/docs/getting-started-guides/minikube/) page for getting more familiar with Minikube. We can learn there interesting things such as reusing our Docker daemon, getting the Minikube's ip or opening the Minikube's dashboard for GUI interaction with out Kubernetes Cluster.

2. Remotely in ICP

[IBM Cloud Private Cluster](https://www.ibm.com/cloud/private)

Create a Kubernetes cluster in an on-premise datacenter. The community edition (IBM Cloud private-ce) is free of charge.
Follow the instructions [here](https://www.ibm.com/support/knowledgecenter/en/SSBS6K_2.1.0.2/installing/install_containers_CE.html) to install IBM Cloud private-ce.

[Helm](https://github.com/kubernetes/helm) (Kubernetes package manager)

Follow the instructions [here](https://github.com/kubernetes/helm/blob/master/docs/install.md) to install it on your platform.
If using IBM Cloud Private version 2.1.0.2 or newer, we recommend you follow these [instructions](https://www.ibm.com/support/knowledgecenter/SSBS6K_2.1.0.2/app_center/create_helm_cli.html) to install helm.

### Locally in Minikube

#### Setting up your environment

1. Start your minikube. Run the below command.

`minikube start`

You will see output similar to this.

```
Setting up certs...
Connecting to cluster...
Setting up kubeconfig...
Starting cluster components...
Kubectl is now configured to use the cluster.
```
2. To install Tiller which is a server side component of Helm, initialize helm. Run the below command.

`helm init`

If it is successful, you will see the below output.

```
$HELM_HOME has been configured at /Users/user@ibm.com/.helm.

Tiller (the helm server side component) has been installed into your Kubernetes Cluster.
Happy Helming!
```
3. Check if your tiller is available. Run the below command.

`kubectl get deployment tiller-deploy --namespace kube-system`

If it available, you can see the availability as below.

```
NAME            DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
tiller-deploy   1         1         1            1           1m
```

4. Verify your helm before proceeding like below.

`helm version`

You will see the below output.

```
Client: &version.Version{SemVer:"v2.4.2", GitCommit:"82d8e9498d96535cc6787a6a9194a76161d29b4c", GitTreeState:"clean"}
Server: &version.Version{SemVer:"v2.5.0", GitCommit:"012cb0ac1a1b2f888144ef5a67b8dab6c2d45be6", GitTreeState:"clean"}
```

#### Running the application on Minikube

1. Build the docker image.

Before building the docker image, set the docker environment.

- Run the below command.

`minikube docker-env`

You will see the output similar to this.

```
export DOCKER_TLS_VERIFY="1"
export DOCKER_HOST="tcp://192.168.99.100:2376"
export DOCKER_CERT_PATH="/Users/user@ibm.com/.minikube/certs"
export DOCKER_API_VERSION="1.23"
# Run this command to configure your shell:
# eval $(minikube docker-env)
```
- For configuring your shell, run the below command.

`eval $(minikube docker-env)`

- Now run the docker build.

`docker build -t bc-web-mp:v1.0.0 .`

If it is a success, you will see the below output.

```
Successfully built fg1c34hab80d
Successfully tagged bc-web-mp:v1.0.0
```

2. Run the helm chart as below.

Before running the helm chart in minikube, access [values.yaml](https://github.com/ibm-cloud-architecture/refarch-cloudnative-bluecompute-web/blob/microprofile/chart/web/values.yaml) and replace the repository with the below.

`repository: bc-web-mp`

Then run the helm chart 

`helm install --name=web chart/web`

You will see message like below.

```
==> v1beta1/Deployment
NAME                       TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)                          AGE
bluecompute-web            NodePort    10.109.121.244   <none>        80:30628/TCP                     38m
```
Please wait till your deployment is ready. To verify run the below command and you should see the availability.

`kubectl get deployments`

You will see something like below.

```
==> v1beta1/Deployment
NAME                                        DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
bluecompute-web                             1         1         1            1           9m
```

3. You can access the application at `http://<MinikubeIP>:<PORT>/<WAR_CONTEXT>/<APPLICATION_PATH>/<ENDPOINT>`. To get the access url.

- To get the IP, Run this command.

`minikube ip`

You will see something like below.

```
192.168.99.100
```

- To get the port, run this command.

`kubectl get service bluecompute-web`

You will see something like below.

```
NAME              TYPE       CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
bluecompute-web   NodePort   10.109.28.66   <none>        80:30272/TCP   2m
```

In the above case, the access url will be http://192.168.99.100:30272/.

<p align="center">
    <img src="https://github.com/ibm-cloud-architecture/refarch-cloudnative-kubernetes/blob/microprofile/static/imgs/bc_mp_ui.png">
</p>

### Remotely in ICP

[IBM Cloud Private](https://www.ibm.com/cloud/private)

IBM Private Cloud has all the advantages of public cloud but is dedicated to single organization. You can have your own security requirements and customize the environment as well. Basically it has tight security and gives you more control along with scalability and easy to deploy options. You can run it externally or behind the firewall of your organization.

Basically this is an on-premise platform.

Includes docker container manager
Kubernetes based container orchestrator
Graphical user interface
You can find the detailed installation instructions for IBM Cloud Private [here](https://www.ibm.com/support/knowledgecenter/en/SSBS6K_2.1.0.2/installing/install_containers_CE.html)

#### Pushing the image to Private Registry

1. Now run the docker build.

`docker build -t bc-web-mp:v1.0.0 .`

If it is a success, you will see the below output.

```
Successfully built fg1c34hab80d
Successfully tagged bc-web-mp:v1.0.0
```

2. Tag the image to your private registry.

`docker tag bc-web-mp:v1.0.0 <Your ICP registry>/bc-web-mp:v1.0.0`

3. Push the image to your private registry.

`docker push <Your ICP registry>/bc-web-mp:v1.0.0`

You should see something like below.

```
v1.0.0: digest: sha256:3ddf30790ce5511f7592211df6d66c370fe22e2b7f561336fde48651551ab663 size: 3873
```

#### Running the application on ICP

1. Your [IBM Cloud Private Cluster](https://www.ibm.com/cloud/private) should be up and running.

2. Log in to the IBM Cloud Private. 

<p align="center">
    <img src="https://github.com/ibm-cloud-architecture/refarch-cloudnative-kubernetes/blob/microprofile/static/imgs/icp_dashboard.png">
</p>

3. Go to `admin > Configure Client`.

<p align="center">
    <img src="https://github.com/ibm-cloud-architecture/refarch-cloudnative-kubernetes/blob/microprofile/static/imgs/client_config.png">
</p>

4. Grab the kubectl configuration commands.

<p align="center">
    <img src="https://github.com/ibm-cloud-architecture/refarch-cloudnative-kubernetes/blob/microprofile/static/imgs/kube_cmds.png">
</p>

5. Run those commands in your terminal.

6. If successful, you should see something like below.

```
Switched to context "xxx-cluster.icp-context".
```
7. Run the below command.

`helm init --client-only`

You will see the below

```
$HELM_HOME has been configured at /Users/user@ibm.com/.helm.
Not installing Tiller due to 'client-only' flag having been set
Happy Helming!
```

8. Verify the helm version

`helm version --tls`

You will see something like below.

```
Client: &version.Version{SemVer:"v2.7.2+icp", GitCommit:"d41a5c2da480efc555ddca57d3972bcad3351801", GitTreeState:"dirty"}
Server: &version.Version{SemVer:"v2.7.2+icp", GitCommit:"d41a5c2da480efc555ddca57d3972bcad3351801", GitTreeState:"dirty"}
```
9. Before running the helm chart in minikube, access [values.yaml](https://github.com/ibm-cloud-architecture/refarch-cloudnative-micro-inventory/blob/microprofile/inventory/chart/inventory/values.yaml) and replace the repository with the your IBM Cloud Private .

`repository: <Your IBM Cloud Private Docker registry>`

Then run the helm chart 

`helm install --name=web chart/web --tls`

You will see message like below.

```
==> v1beta1/Deployment
NAME                                        DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
bluecompute-web                             1         1         1            0           2s
```
Please wait till your deployment is ready. To verify run the below command and you should see the availability.

`kubectl get deployments`

You will see something like below.

```
==> v1beta1/Deployment
NAME                                        DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
bluecompute-web                             1         1         1            1           1m      
```
**NOTE**: If you are using a version of ICP older than 2.1.0.2, you don't need to add the --tls at the end of the helm command.

10. You can access the application at `http://<YourClusterIP>:<PORT>/<WAR_CONTEXT>/<APPLICATION_PATH>/<ENDPOINT>`. To get the access url, do the following.

- To get the IP, Run this command.

`kubectl cluster-info`

You will see something like below.

```
Kubernetes master is running at https://172.16.40.4:8001
catalog-ui is running at https://172.16.40.4:8001/api/v1/namespaces/kube-system/services/catalog-ui/proxy
Heapster is running at https://172.16.40.4:8001/api/v1/namespaces/kube-system/services/heapster/proxy
icp-management-ingress is running at https://172.16.40.4:8001/api/v1/namespaces/kube-system/services/icp-management-ingress/proxy
image-manager is running at https://172.16.40.4:8001/api/v1/namespaces/kube-system/services/image-manager/proxy
KubeDNS is running at https://172.16.40.4:8001/api/v1/namespaces/kube-system/services/kube-dns/proxy
platform-ui is running at https://172.16.40.4:8001/api/v1/namespaces/kube-system/services/platform-ui/proxy
```

Grab the Kubernetes master ip and in this case, `<YourClusterIP>` will be `172.16.40.4`.

- To get the port, run this command.

- To get the port, run this command.

`kubectl get service bluecompute-web`

You will see something like below.

```
NAME              TYPE       CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
bluecompute-web   NodePort   10.109.28.66   <none>        80:30272/TCP   2m
```
In the above case, the access url will be http://172.16.40.4:30272/.

<p align="center">
    <img src="https://github.com/ibm-cloud-architecture/refarch-cloudnative-kubernetes/blob/microprofile/static/imgs/bc_mp_ui.png">
</p>

or

You can access the service from dashboard.

- **Menu > Network Access > Services**
- Find the service in the list and click on it.

<p align="center">
    <img src="https://github.com/ibm-cloud-architecture/refarch-cloudnative-kubernetes/blob/microprofile/static/imgs/webicp_service.png">
</p>

You can access the application by clicking on http link.

<p align="center">
    <img src="https://github.com/ibm-cloud-architecture/refarch-cloudnative-kubernetes/blob/microprofile/static/imgs/bc_mp_ui.png">
</p>

### References
1. [IBM Cloud Private](https://www.ibm.com/support/knowledgecenter/en/SSBS6K_2.1.0/kc_welcome_containers.html)
2. [IBM Cloud Private Installation](https://github.com/ibm-cloud-architecture/refarch-privatecloud)
3. [IBM Cloud Private version 2.1.0.2 Helm instructions](https://www.ibm.com/support/knowledgecenter/SSBS6K_2.1.0.2/app_center/create_helm_cli.html)


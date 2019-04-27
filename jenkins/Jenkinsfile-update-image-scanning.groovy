/*
    To learn how to use this sample pipeline, follow the guide below and enter the
    corresponding values for your environment and for this repository:
    - https://github.com/ibm-cloud-architecture/refarch-cloudnative-devops-kubernetes
*/

// Environment
def clusterURL = env.CLUSTER_URL
def clusterAccountId = env.CLUSTER_ACCOUNT_ID
def clusterCredentialId = env.CLUSTER_CREDENTIAL_ID ?: "cluster-credentials"

// Pod Template
def podLabel = "web"
def cloud = env.CLOUD ?: "kubernetes"
def registryCredsID = env.REGISTRY_CREDENTIALS ?: "registry-credentials-id"
def serviceAccount = env.SERVICE_ACCOUNT ?: "jenkins"
def tls = env.TLS ?: "" // Set to "--tls" for IBM Cloud Private

// Pod Environment Variables
def namespace = env.NAMESPACE ?: "default"
def registry = env.REGISTRY ?: "docker.io"
def imageName = env.IMAGE_NAME ?: "ibmcase/bluecompute-web"
def serviceLabels = env.SERVICE_LABELS ?: "app=web,tier=frontend" //,version=v1"
def microServiceName = env.MICROSERVICE_NAME ?: "web"
def servicePort = env.MICROSERVICE_PORT ?: "8000"
def managementPort = env.MANAGEMENT_PORT ?: "9000"

// Configuration of services that web app interacts with
def authProtocol = env.AUTH_PROTOCOL ?: "http"
def authHost = env.AUTH_HOST ?: "auth"
def authPort = env.AUTH_PORT ?: "8083"

def catalogProtocol = env.CATALOG_PROTOCOL ?: "http"
def catalogHost = env.CATALOG_HOST ?: "catalog"
def catalogPort = env.CATALOG_PORT ?: "8081"

def customerProtocol = env.CUSTOMER_PROTOCOL ?: "http"
def customerHost = env.CUSTOMER_HOST ?: "customer"
def customerPort = env.CUSTOMER_PORT ?: "8082"

def ordersProtocol = env.ORDERS_PROTOCOL ?: "http"
def ordersHost = env.ORDERS_HOST ?: "orders"
def ordersPort = env.ORDERS_PORT ?: "8084"

/*
  Optional Pod Environment Variables
 */
def helmHome = env.HELM_HOME ?: env.JENKINS_HOME + "/.helm"

podTemplate(label: podLabel, cloud: cloud, serviceAccount: serviceAccount, envVars: [
        envVar(key: 'CLUSTER_URL', value: clusterURL),
        envVar(key: 'CLUSTER_ACCOUNT_ID', value: clusterAccountId),
        envVar(key: 'NAMESPACE', value: namespace),
        envVar(key: 'REGISTRY', value: registry),
        envVar(key: 'IMAGE_NAME', value: imageName),
        envVar(key: 'SERVICE_LABELS', value: serviceLabels),
        envVar(key: 'MICROSERVICE_NAME', value: microServiceName),
        envVar(key: 'MICROSERVICE_PORT', value: servicePort),
        envVar(key: 'MANAGEMENT_PORT', value: managementPort),
        envVar(key: 'AUTH_PROTOCOL', value: authProtocol),
        envVar(key: 'AUTH_HOST', value: authHost),
        envVar(key: 'AUTH_PORT', value: authPort),
        envVar(key: 'CATALOG_PROTOCOL', value: catalogProtocol),
        envVar(key: 'CATALOG_HOST', value: catalogHost),
        envVar(key: 'CATALOG_PORT', value: catalogPort),
        envVar(key: 'CUSTOMER_PROTOCOL', value: customerProtocol),
        envVar(key: 'CUSTOMER_HOST', value: customerHost),
        envVar(key: 'CUSTOMER_PORT', value: customerPort),
        envVar(key: 'ORDERS_PROTOCOL', value: ordersProtocol),
        envVar(key: 'ORDERS_HOST', value: ordersHost),
        envVar(key: 'ORDERS_PORT', value: ordersPort),
        envVar(key: 'HELM_HOME', value: helmHome)
    ],
    volumes: [
        hostPathVolume(hostPath: '/var/run/docker.sock', mountPath: '/var/run/docker.sock')
    ],
    containers: [
        containerTemplate(name: 'nodejs', image: 'ibmcase/nodejs:6-alpine', ttyEnabled: true, command: 'cat'),
        containerTemplate(name: 'docker', image: 'ibmcase/docker:18.09', ttyEnabled: true, command: 'cat'),
        //containerTemplate(name: 'docker', image: 'ibmcase/docker:18.09-dind', privileged: true),
        containerTemplate(name: 'kubernetes', image: 'ibmcase/jenkins-slave-utils:3.1.2', ttyEnabled: true, command: 'cat')
  ]) {

    node(podLabel) {
        checkout scm

        // Docker
        container(name:'docker', shell:'/bin/bash') {
            stage('Docker - Build Image') {
                sh """
                #!/bin/bash

                # Get image
                if [ "${REGISTRY}" == "docker.io" ]; then
                    IMAGE=${IMAGE_NAME}:${env.BUILD_NUMBER}
                else
                    IMAGE=${REGISTRY}/${NAMESPACE}/${IMAGE_NAME}:${env.BUILD_NUMBER}
                fi

                docker build -t \${IMAGE} .
                """
            }

            stage('Aqua MicroScanner') {
                def image = registry + namespace + imageName + currentBuild.number
                aquaMicroscanner imageName: image, notCompliesCmd: 'exit 1', onDisallowed: 'fail', outputFormat: 'html'
            }

            stage('Docker - Push Image to Registry') {
                withCredentials([usernamePassword(credentialsId: registryCredsID,
                                               usernameVariable: 'USERNAME',
                                               passwordVariable: 'PASSWORD')]) {
                    sh """
                    #!/bin/bash

                    # Get image
                    if [ "${REGISTRY}" == "docker.io" ]; then
                        IMAGE=${IMAGE_NAME}:${env.BUILD_NUMBER}
                    else
                        IMAGE=${REGISTRY}/${NAMESPACE}/${IMAGE_NAME}:${env.BUILD_NUMBER}
                    fi

                    docker login -u ${USERNAME} -p ${PASSWORD} ${REGISTRY}

                    docker push \${IMAGE}
                    """
                }
            }
        }
    }
}
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
        envVar(key: 'NAMESPACE', value: namespace),
        envVar(key: 'REGISTRY', value: registry),
        envVar(key: 'IMAGE_NAME', value: imageName),
    ],
    containers: [
        containerTemplate(name: 'nodejs', image: 'ibmcase/nodejs:6', ttyEnabled: true, command: 'cat'),
        containerTemplate(name: 'podman', image: 'ibmcase/podman:ubuntu-16.04', ttyEnabled: true, command: 'cat', privileged: true),
        containerTemplate(name: 'kubernetes', image: 'ibmcase/jenkins-slave-utils:3.1.2', ttyEnabled: true, command: 'cat')
  ]) {

    node(podLabel) {
        checkout scm

        // Docker
        container(name:'podman', shell:'/bin/bash') {
            stage('Docker - Build Image') {
                sh """
                #!/bin/bash

                # Get image
                if [ "${REGISTRY}" == "docker.io" ]; then
                    IMAGE=${IMAGE_NAME}:${env.BUILD_NUMBER}
                else
                    IMAGE=${REGISTRY}/${NAMESPACE}/${IMAGE_NAME}:${env.BUILD_NUMBER}
                fi

                podman build -t \${IMAGE} .
                """
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

                    podman login -u ${USERNAME} -p ${PASSWORD} ${REGISTRY} --tls-verify=false

                    podman push \${IMAGE} --tls-verify=false
                    """
                }
            }
        }

        // Kubernetes
        container(name:'kubernetes', shell:'/bin/bash') {
            stage('Initialize helm') {
                sh """
                echo "Initializing Helm ..."
                export HELM_HOME=${HELM_HOME}
                helm init -c
                """
            }
            // Initialize cloudctl for IBM Cloud Private
            if (env.TLS && env.TLS == "--tls") {
                stage ('Initialize cloudctl') {
                    withCredentials([usernamePassword(credentialsId: clusterCredentialId,
                                                   passwordVariable: 'CLUSTER_PASSWORD',
                                                   usernameVariable: 'CLUSTER_USERNAME')]) {
                        sh """
                        echo "Login with cloudctl ..."
                        cloudctl login -a ${CLUSTER_URL} -u ${CLUSTER_USERNAME}  -p "${CLUSTER_PASSWORD}" -c ${CLUSTER_ACCOUNT_ID} -n ${NAMESPACE} --skip-ssl-validation
                        """
                    }
                }
            }
            stage('Kubernetes - Deploy new Docker Image') {
                sh """
                #!/bin/bash

                # Get image
                if [ "${REGISTRY}" == "docker.io" ]; then
                    IMAGE=${IMAGE_NAME}
                else
                    IMAGE=${REGISTRY}/${NAMESPACE}/${IMAGE_NAME}
                fi

                # Helm Parameters
                if [ "${DEPLOY_NEW_VERSION}" == "true" ]; then
                    NAME="${MICROSERVICE_NAME}-v${env.BUILD_NUMBER}"
                    VERSION_LABEL="--set labels.version=v${env.BUILD_NUMBER}"
                else
                    NAME="${MICROSERVICE_NAME}"
                fi

                echo "Installing chart/${MICROSERVICE_NAME} chart with name \${NAME} and waiting for pods to be ready"

                set +x
                helm upgrade --install \${NAME} --namespace ${NAMESPACE} \${VERSION_LABEL} \
                    --set fullnameOverride=\${NAME} \
                    --set image.repository=\${IMAGE} \
                    --set image.tag=${env.BUILD_NUMBER} \
                    --set service.externalPort=${MICROSERVICE_PORT} \
                    --set services.auth.protocol=${AUTH_PROTOCOL} \
                    --set services.auth.host=${AUTH_HOST} \
                    --set services.auth.port=${AUTH_PORT} \
                    --set services.catalog.protocol=${CATALOG_PROTOCOL} \
                    --set services.catalog.host=${CATALOG_HOST} \
                    --set services.catalog.port=${CATALOG_PORT} \
                    --set services.customer.protocol=${CUSTOMER_PROTOCOL} \
                    --set services.customer.host=${CUSTOMER_HOST} \
                    --set services.customer.port=${CUSTOMER_PORT} \
                    --set services.orders.protocol=${ORDERS_PROTOCOL} \
                    --set services.orders.host=${ORDERS_HOST} \
                    --set services.orders.port=${ORDERS_PORT} \
                    chart/${MICROSERVICE_NAME} --wait ${TLS}
                set -x
                """
            }
            stage('Kubernetes - Test') {
                sh """
                #!/bin/bash

                # Get deployment
                if [ "${DEPLOY_NEW_VERSION}" == "true" ]; then
                    QUERY_LABELS="${SERVICE_LABELS},version=v${env.BUILD_NUMBER}"
                else
                    QUERY_LABELS="${SERVICE_LABELS}"
                fi

                DEPLOYMENT=`kubectl --namespace=${NAMESPACE} get deployments -l \${QUERY_LABELS} -o name | head -n 1`

                # Wait for deployment to be ready
                kubectl --namespace=${NAMESPACE} rollout status \${DEPLOYMENT}

                # Port forwarding & logs
                kubectl --namespace=${NAMESPACE} port-forward \${DEPLOYMENT} ${MICROSERVICE_PORT} ${MANAGEMENT_PORT} &
                kubectl --namespace=${NAMESPACE} logs -f \${DEPLOYMENT} &
                echo "Sleeping for 3 seconds while connection is established..."
                sleep 3

                # Let the application start
                bash scripts/health_check.sh "http://127.0.0.1:${MANAGEMENT_PORT}"

                # Run tests
                bash scripts/api_tests.sh 127.0.0.1 ${MICROSERVICE_PORT}

                # Kill port forwarding
                killall kubectl || true
                """
            }
        }
    }
}

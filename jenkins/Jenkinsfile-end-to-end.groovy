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
        emptyDirVolume(mountPath: '/var/lib/docker', memory: false)
    ],
    containers: [
        containerTemplate(name: 'nodejs', image: 'ibmcase/nodejs:6-alpine', ttyEnabled: true, command: 'cat'),
        containerTemplate(name: 'docker', image: 'ibmcase/docker:18.09-dind', privileged: true),
        containerTemplate(name: 'kubernetes', image: 'ibmcase/jenkins-slave-utils:3.1.2', ttyEnabled: true, command: 'cat')
  ]) {

    node(podLabel) {
        checkout scm

        // Local
        container(name:'nodejs', shell:'/bin/bash') {
            stage('Local - Build and Unit Test') {
                sh """
                #!/bin/bash
                # Go to source directory
                cd StoreWebApp

                # Install dependencies
                npm install

                # Perform linting
                jshint app.js
                jshint routes/

                cd ..
                """
            }
            stage('Local - Run and Test') {
                sh """
                #!/bin/bash

                # Go to source directory
                cd StoreWebApp

                # Start Application
                node ./bin/www &
                PID=`echo \$!`

                # Wait for the Web app to start accepting connections
                sleep 10

                # Get back to root folder
                cd ..

                # Let the application start
                bash scripts/health_check.sh "http://127.0.0.1:${MANAGEMENT_PORT}"

                # Run tests
                bash scripts/api_tests.sh 127.0.0.1 ${MICROSERVICE_PORT}

                # Kill process
                kill \${PID}
                """
            }
        }

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
            stage('Docker - Run and Test') {
                sh """
                #!/bin/bash

                # Get image
                if [ "${REGISTRY}" == "docker.io" ]; then
                    IMAGE=${IMAGE_NAME}:${env.BUILD_NUMBER}
                else
                    IMAGE=${REGISTRY}/${NAMESPACE}/${IMAGE_NAME}:${env.BUILD_NUMBER}
                fi

                # Kill Container if it already exists
                docker kill ${MICROSERVICE_NAME} || true
                docker rm ${MICROSERVICE_NAME} || true

                # Start Container
                echo "Starting ${MICROSERVICE_NAME} container"
                set +x
                docker run --name ${MICROSERVICE_NAME} -d \
                    -p ${MICROSERVICE_PORT}:${MICROSERVICE_PORT} \
                    -p ${MANAGEMENT_PORT}:${MANAGEMENT_PORT} \
                    -e SERVICE_PORT=${MICROSERVICE_PORT} \
                    \${IMAGE}
                set -x

                # Check that application started successfully
                docker ps

                # Check the logs
                docker logs -f ${MICROSERVICE_NAME} &
                PID=`echo \$!`

                # Get the container IP Address
                CONTAINER_IP=`docker inspect ${MICROSERVICE_NAME} | jq -r '.[0].NetworkSettings.IPAddress'`

                # Let the application start
                bash scripts/health_check.sh "http://\${CONTAINER_IP}:${MANAGEMENT_PORT}"

                # Run tests
                bash scripts/api_tests.sh \${CONTAINER_IP} ${MICROSERVICE_PORT}

                # Kill process
                kill \${PID}

                # Kill Container
                docker kill ${MICROSERVICE_NAME} || true
                docker rm ${MICROSERVICE_NAME} || true
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

                    docker login -u ${USERNAME} -p ${PASSWORD} ${REGISTRY}

                    docker push \${IMAGE}
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

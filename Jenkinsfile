/*
    To learn how to use this sample pipeline, follow the guide below and enter the
    corresponding values for your environment and for this repository:
    - https://github.com/ibm-cloud-architecture/refarch-cloudnative-devops-kubernetes
*/

// Pod Template
def podLabel = "web"
def cloud = env.CLOUD ?: "kubernetes"
def registryCredsID = env.REGISTRY_CREDENTIALS ?: "registry-credentials-id"
def serviceAccount = env.SERVICE_ACCOUNT ?: "jenkins"

// Pod Environment Variables
def namespace = env.NAMESPACE ?: "default"
def registry = env.REGISTRY ?: "docker.io"
def imageName = env.IMAGE_NAME ?: "ibmcase/bluecompute-web"
def deploymentLabels = env.DEPLOYMENT_LABELS ?: "app=web,tier=backend,version=v1"
def podName = env.POD_NAME ?: "web"

podTemplate(label: podLabel, cloud: cloud, serviceAccount: serviceAccount, namespace: namespace, envVars: [
        envVar(key: 'NAMESPACE', value: namespace),
        envVar(key: 'REGISTRY', value: registry),
        envVar(key: 'IMAGE_NAME', value: imageName),
        envVar(key: 'DEPLOYMENT_LABELS', value: deploymentLabels),
        envVar(key: 'POD_NAME', value: podName)
    ],
    volumes: [
        hostPathVolume(hostPath: '/etc/docker/certs.d', mountPath: '/etc/docker/certs.d'),
        hostPathVolume(hostPath: '/var/run/docker.sock', mountPath: '/var/run/docker.sock')
    ],
    containers: [
        containerTemplate(name: 'kubectl', image: 'lachlanevenson/k8s-kubectl', ttyEnabled: true, command: 'cat'),
        containerTemplate(name: 'docker' , image: 'docker:17.06.1-ce', ttyEnabled: true, command: 'cat')
  ]) {

    node(podLabel) {
        checkout scm
        container('docker') {
            stage('Build Docker Image') {
                sh """
                #!/bin/bash
                if [ "${env.REGISTRY}" = "docker.io" ]; then
                    echo 'Building Docker Hub Image'
                    docker build -t ${env.IMAGE_NAME}:${env.BUILD_NUMBER} .
                else
                    echo 'Building Private Registry Image'
                    docker build -t ${env.REGISTRY}/${env.NAMESPACE}/${env.IMAGE_NAME}:${env.BUILD_NUMBER} .
                fi
                """
            }
            stage('Push Docker Image to Registry') {
                withCredentials([usernamePassword(credentialsId: registryCredsID,
                                               usernameVariable: 'USERNAME',
                                               passwordVariable: 'PASSWORD')]) {
                    sh """
                    #!/bin/bash\

                    docker login -u ${USERNAME} -p ${PASSWORD} ${env.REGISTRY}

                    if [ "${env.REGISTRY}" = "docker.io" ]; then
                        echo 'Pushing to Docker Hub'
                        docker push ${env.IMAGE_NAME}:${env.BUILD_NUMBER}
                    else
                        echo 'Pushing to Private Registry'
                        docker push ${env.REGISTRY}/${env.NAMESPACE}/${env.IMAGE_NAME}:${env.BUILD_NUMBER}
                    fi
                    """
                }
            }
        }
        container('kubectl') {
            stage('Deploy new Docker Image') {
                sh """
                #!/bin/bash
                DEPLOYMENT=`kubectl --namespace=${env.NAMESPACE} get deployments -l ${env.DEPLOYMENT_LABELS} -o name`
                kubectl --namespace=${env.NAMESPACE} get \${DEPLOYMENT}
                if [ \${?} -ne "0" ]; then
                    # No deployment to update
                    echo 'No deployment to update'
                    exit 1
                fi

                # Get image
                if [ "${env.REGISTRY}" = "docker.io" ]; then
                    IMAGE=${env.IMAGE_NAME}:${env.BUILD_NUMBER}
                else
                    IMAGE=${env.REGISTRY}/${env.NAMESPACE}/${env.IMAGE_NAME}:${env.BUILD_NUMBER}
                fi

                # Update deployment and check rollout status
                kubectl --namespace=${env.NAMESPACE} set image \${DEPLOYMENT} ${env.POD_NAME}=\${IMAGE}
                kubectl --namespace=${env.NAMESPACE} rollout status \${DEPLOYMENT}
                """
            }
        }
    }
}

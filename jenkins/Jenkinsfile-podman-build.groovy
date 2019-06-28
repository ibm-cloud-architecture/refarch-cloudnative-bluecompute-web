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

/*
  Optional Pod Environment Variables
 */
def helmHome = env.HELM_HOME ?: env.JENKINS_HOME + "/.helm"

podTemplate(label: podLabel, cloud: cloud, serviceAccount: serviceAccount, envVars: [
        envVar(key: 'NAMESPACE', value: namespace),
        envVar(key: 'REGISTRY', value: registry),
        envVar(key: 'IMAGE_NAME', value: imageName)
    ],
    containers: [
        containerTemplate(name: 'podman', image: 'ibmcase/podman:ubuntu-16.04', ttyEnabled: true, command: 'cat', privileged: true)
  ]) {

    node(podLabel) {
        checkout scm

        // Docker
        container(name:'podman', shell:'/bin/bash') {
            stage('Docker - Build Image') {
                sh """
                #!/bin/bash

                # Construct Image Name
                IMAGE=${REGISTRY}/${NAMESPACE}/${IMAGE_NAME}:${env.BUILD_NUMBER}

                podman build -t \${IMAGE} .
                """
            }

            stage('Docker - Push Image to Registry') {
                withCredentials([usernamePassword(credentialsId: registryCredsID,
                                               usernameVariable: 'USERNAME',
                                               passwordVariable: 'PASSWORD')]) {
                    sh """
                    #!/bin/bash

                    # Construct Image Name
                    IMAGE=${REGISTRY}/${NAMESPACE}/${IMAGE_NAME}:${env.BUILD_NUMBER}

                    podman login -u ${USERNAME} -p ${PASSWORD} ${REGISTRY} --tls-verify=false

                    podman push \${IMAGE} --tls-verify=false
                    """
                }
            }
        }
    }
}
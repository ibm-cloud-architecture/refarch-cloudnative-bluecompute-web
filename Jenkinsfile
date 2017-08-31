podTemplate(label: 'mypod',
    volumes: [
        hostPathVolume(hostPath: '/var/run/docker.sock', mountPath: '/var/run/docker.sock'),
        secretVolume(secretName: 'registry-account', mountPath: '/var/run/secrets/registry-account'),
        configMapVolume(configMapName: 'registry-config', mountPath: '/var/run/configs/registry-config')
    ],
    containers: [
        containerTemplate(name: 'kubectl', image: 'lachlanevenson/k8s-kubectl', ttyEnabled: true, command: 'cat'),
        containerTemplate(name: 'docker' , image: 'docker:17.06.1-ce', ttyEnabled: true, command: 'cat')
  ]) {

    node('mypod') {
        checkout scm
        container('docker') {
            stage('Build Docker Image') {
                sh """
                #!/bin/bash
                NAMESPACE=`cat /var/run/configs/registry-config/namespace`
                REGISTRY=`cat /var/run/configs/registry-config/registry`

                cp -ar StoreWebApp docker/StoreWebApp
                cd docker

                if [ "\${REGISTRY}" == "dockerhub" ]; then
                    # Docker Hub
                    echo 'Building against Docker Hub'
                    docker build -t \${NAMESPACE}/bluecompute-ce-web:${env.BUILD_NUMBER} .
                else
                    # Private Repository
                    echo 'Building against Private Registry'
                    docker build -t \${REGISTRY}/\${NAMESPACE}/bluecompute-ce-web:${env.BUILD_NUMBER} .
                fi

                docker build -t \${REGISTRY}/\${NAMESPACE}/bluecompute-ce-web:${env.BUILD_NUMBER} .
                rm -r StoreWebApp
                """
            }
            stage('Push Docker Image to Registry') {
                sh """
                #!/bin/bash
                NAMESPACE=`cat /var/run/configs/registry-config/namespace`
                REGISTRY=`cat /var/run/configs/registry-config/registry`

                set +x
                DOCKER_USER=`cat /var/run/secrets/registry-account/username`
                DOCKER_PASSWORD=`cat /var/run/secrets/registry-account/password`

                if [ "\${REGISTRY}" == "dockerhub" ]; then
                    # Docker Hub
                    echo 'Login into Docker Hub'
                    docker login -u=\${DOCKER_USER} -p=\${DOCKER_PASSWORD}
                else
                    # Private Repository
                    echo 'Login into Private Registry'
                    docker login -u=\${DOCKER_USER} -p=\${DOCKER_PASSWORD} \${REGISTRY}
                fi
                set -x

                if [ "\${REGISTRY}" == "dockerhub" ]; then
                    # Docker Hub
                    echo 'Pushing to Docker Hub'
                    docker push \${NAMESPACE}/bluecompute-ce-web:${env.BUILD_NUMBER}
                else
                    # Private Repository
                    echo 'Pushing to Private Registry'
                    docker push \${REGISTRY}/\${NAMESPACE}/bluecompute-ce-web:${env.BUILD_NUMBER}
                fi
                """
            }
        }
        container('kubectl') {
            stage('Deploy new Docker Image') {
                sh """
                #!/bin/bash
                set +e
                NAMESPACE=`cat /var/run/configs/registry-config/namespace`
                REGISTRY=`cat /var/run/configs/registry-config/registry`

                kubectl get deployments bluecompute-web

                if [ \${?} -eq "0" ]; then
                    # Update Deployment
                    kubectl set image deployment/bluecompute-web web=\${REGISTRY}/\${NAMESPACE}/bluecompute-ce-web:${env.BUILD_NUMBER}
                    kubectl rollout status deployment/bluecompute-web
                else
                    # No deployment to update
                    echo 'No deployment to update'
                    exit 1
                fi
                """
            }
        }
    }
}
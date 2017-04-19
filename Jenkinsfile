podTemplate(label: 'pod',
    volumes: [hostPathVolume(hostPath: '/var/run/docker.sock', mountPath: '/var/run/docker.sock'),
              secretVolume(secretName: 'bx-auth-secret', mountPath: '/var/run/secrets/bx-auth-secret'),
              secretVolume(secretName: 'bluemix-default-secret', mountPath: '/var/run/secrets/bluemix-default-secret')],
    containers: [
        containerTemplate(
            name: 'slave-container',
            image: 'fabiogomezdiaz/bc-jenkins-slave:v10',
            alwaysPullImage: true,
            ttyEnabled: true,
            command: 'cat'
    )]) {

    node ('pod') {
        container('slave-container') {
            stage ('Build Docker Image') {
                checkout scm
                sh """
                #!/bin/bash
                cp -ar StoreWebApp docker/StoreWebApp
                cd docker
                docker build -t cloudnative/bluecompute-web .
                rm -r StoreWebApp
                """
            }
            stage ('Push Docker Image to Registry') {
                sh """
                #!/bin/bash
                cd docker
                ./push_to_docker.sh ${env.BUILD_NUMBER}
                """
            }
            stage ('Deploy to Kubernetes') {
                sh """
                #!/bin/bash
                #cd catalog/scripts
                #./deploy.sh ${env.BUILD_NUMBER}
                #"""
            }
        }
    }
}

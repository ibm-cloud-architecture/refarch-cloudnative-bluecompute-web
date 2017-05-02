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
            command: 'cat',
            envVars: [
              containerEnvVar(key: 'BMX_DOCKER_NAMESPACE', value:'chrisking'),
              containerEnvVar(key: 'POSTGRES_USER', value: 'runner')
            ]
    )]) {

    node ('pod') {
        container('slave-container') {
            stage ('Build Docker Image') {
                checkout scm
                sh """
                #!/bin/bash
                #cp -ar StoreWebApp docker/StoreWebApp
                #cd docker
                #docker build -t cloudnative/bluecompute-web .
                #rm -r StoreWebApp
                """
            }
            stage ('Push Docker Image to Registry') {
                sh """
                #!/bin/bash
                cd docker
                echo "Show the variable"
                echo ${env.BMX_DOCKER_NAMESPACE}
                #./push_to_docker.sh ${env.BUILD_NUMBER} ${env.docker_registry_namespace}
                """
            }
            stage ('Deploy to Kubernetes') {
                sh """
                #!/bin/bash
                #cd docker
                #./deploy.sh ${env.BUILD_NUMBER}
                """
            }
        }
    }
}

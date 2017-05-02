#!/bin/bash

build_number=$1
docker_namespace=$2
cf_email=$(cat /var/run/secrets/bx-auth-secret/CF_EMAIL)
cf_password=$(cat /var/run/secrets/bx-auth-secret/CF_PASSWORD)
cf_account=$(cat /var/run/secrets/bx-auth-secret/CF_ACCOUNT)
cf_org=$(cat /var/run/secrets/bx-auth-secret/CF_ORG)
cf_space=$(cat /var/run/secrets/bx-auth-secret/CF_SPACE)

set -x

# Install plugins
bx plugin install container-service -r Bluemix
bx plugin install container-registry -r Bluemix

# Login to Bluemix and init plugins
bx login -a api.ng.bluemix.net -u $cf_email -p $cf_password -c $cf_account -o $cf_org -s $cf_space
bx cs init
bx cr login

echo "Push to registry ${docker_namespace}"

docker tag cloudnative/bluecompute-web registry.ng.bluemix.net/${docker_namespace}/bluecompute-web:${build_number}
docker push registry.ng.bluemix.net/chrisking/bluecompute-web:${build_number}

set +x

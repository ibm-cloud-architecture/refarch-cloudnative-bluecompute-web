#!/bin/bash

function get_elastic_secret {
	echo $(kubectl --token=${token} get secrets | grep "compose-for-elasticsearch" | awk '{print $1}')
}

set -x

build_number=$1
image_name="registry.ng.bluemix.net/chrisking/catalog:${build_number}"
token=$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)
cluster_name=$(cat /var/run/secrets/bx-auth-secret/CLUSTER_NAME)

# Check if elasticsearch secret exists
elastic_secret=$(get_elastic_secret)

if [[ -z "${elastic_secret// }" ]]; then
	echo "elasticsearch secret does not exist. Creating"
	elastic_service="\"$(bx service list | grep "compose-for-elasticsearch" | head -1 | sed -e 's/compose-for-elasticsearch.*//' | sed 's/[[:blank:]]*$//')\""

	if [[ -z "${elastic_secret// }" ]]; then
		echo "Cannot create secret. No service instance exists for compose-for-elasticsearch."
		exit 1
	fi

	echo "Creating secret from ${elastic_service}"
	bx cs cluster-service-bind $cluster_name default $elastic_service

	if [ $? -ne 0 ]; then
	  echo "Could not create secret for ${elastic_service} service."
	  exit 1
	fi

	elastic_secret=$(get_elastic_secret)

	if [[ -z "${elastic_secret// }" ]]; then
		echo "Cannot retrieve secret for ${elastic_service} service."
		exit 1
	fi
fi

cd ../kube

# Delete previous service
# Do rolling update here
catalog_service=$(kubectl get services | grep catalog | head -1 | awk '{print $1}')

# Check if service does not exist
if [[ -z "${catalog_service// }" ]]; then
	# Deploy service
	echo -e "Deploying Catalog for the first time"

	# Enter secret and image name into yaml
	sed -i.bak s%binding-compose-for-elasticsearch%${elastic_secret}%g service.yml
	sed -i.bak s%registry.ng.bluemix.net/chrisking/catalog:v1%${image_name}%g service.yml

	# Do the deployment
	kubectl --token=${token} create -f service.yml

else
	# Do rolling update
	echo -e "Doing a rolling update on Catalog Deployment"
	kubectl set image deployment/catalog-deployment catalog=${image_name}

	# Watch the rollout update
	kubectl rollout status deployment/catalog-deployment
fi


IP_ADDR=$(kubectl --token=${token} get services | grep catalog | head -1 | awk '{print $3}')
PORT=$(kubectl --token=${token} get services | grep catalog | head -1 | awk '{print $4}' | sed 's/:.*//')

echo "View the catalog at http://$IP_ADDR:$PORT/micro/items"

cd ../scripts
set +x
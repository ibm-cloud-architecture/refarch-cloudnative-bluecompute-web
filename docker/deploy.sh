#!/bin/bash
set -x

BUILD_NUMBER=$1
REGISTRY_NAME=$2
REGISTRY_NAMESPACE=$3

# Init helm
helm init

# Edit chart values using yaml (NEED TO INSTALL YAML) - Call image chart deployer
cd chart/bluecompute-web

image_name="${REGISTRY_NAME}/${REGISTRY_NAMESPACE}/bluecompute-web"

# Replace tag
string_to_replace=$(yaml read values.yaml image.tag)
sed -i.bak s%${string_to_replace}%${BUILD_NUMBER}%g values.yaml

# Replace registry name
string_to_replace=$(yaml read values.yaml image.repository)
sed -i.bak s%${string_to_replace}%${image_name}%g values.yaml

cd ../..

# Install/Upgrade Chart

release=$(helm list | grep bluecompute-web | awk '{print $1}' | head -1)

if [[ -z "${release// }" ]]; then
    echo "Installing Web application chart for the first time"
    helm install chart/bluecompute-web
else
    echo "Upgrading web application chart release"
    helm upgrade ${release} chart/bluecompute-web
fi

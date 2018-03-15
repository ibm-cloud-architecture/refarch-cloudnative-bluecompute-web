#!/bin/bash
if [ -z ${cluster_name+x} ]; then 
    echo "cluster_name not available";
else 
	echo "Using cluster_name \"${cluster_name}\"";
	jq --arg cluster_name $cluster_name '.Application.cluster_name = $cluster_name' config/default.json > config/default2.json && \
	mv config/default2.json config/default.json
fi

if [ -z ${region+x} ]; then 
    echo "region not available";
else
	echo "Using region \"${region}\""
	jq --arg region $region '.Application.region = $region' config/default.json > config/default2.json && \
	mv config/default2.json config/default.json
fi

npm start
#!/bin/bash

function is_healthy {
	curl -s ${HEALTH_URL} | jq -r ".status";
}

URL="$1";
HEALTH_CHECK="health";

if [ -z "$URL" ]; then
	URL="http://localhost:9000"
	echo "No URL provided! Using ${URL}"
fi

HEALTH_URL="${URL}/${HEALTH_CHECK}"

echo "Health Check on \"${HEALTH_URL}\"";

HEALTHY=$(is_healthy)

echo -n "Waiting for service to be ready"

until [ -n "$HEALTHY" ] && [ "${HEALTHY}" == 'UP' ]; do
	HEALTHY=$(is_healthy);
	echo -n .;
	sleep 1;
done

printf "\nService is ready\n"

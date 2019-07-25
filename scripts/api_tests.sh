#!/bin/bash

function parse_arguments() {
	# MICROSERVICE_HOST
	if [ -z "${MICROSERVICE_HOST}" ]; then
		echo "MICROSERVICE_HOST not set. Using parameter \"$1\"";
		MICROSERVICE_HOST=$1;
	fi

	if [ -z "${MICROSERVICE_HOST}" ]; then
		echo "MICROSERVICE_HOST not set. Using default value";
		MICROSERVICE_HOST=127.0.0.1;
	fi

	# MICROSERVICE_PORT
	if [ -z "${MICROSERVICE_PATH}" ]; then
		echo "MICROSERVICE_PATH not set. Using parameter \"$2\"";
		MICROSERVICE_PATH=$2;
	fi

	if [ -z "${MICROSERVICE_PATH}" ]; then
		echo "MICROSERVICE_PATH not set. Using default value";
		MICROSERVICE_PATH=bluecompute-mp;
	fi

	echo "Using http://${MICROSERVICE_HOST}/${MICROSERVICE_PATH}"
}

function get_home_page() {
	CURL=$(curl --insecure --write-out %{http_code} --silent --output /dev/null --max-time 5 -X GET https://${MICROSERVICE_HOST}/${MICROSERVICE_PATH});
	echo "get_home_page status code: \"${CURL}\""

	# Check for 201 Status Code
	if [ -z "${CURL}" ] || [ "$CURL" != "200" ]; then
		printf "get_home_page: ❌ \n${CURL}\n";
        exit 1;
    else
    	echo "get_home_page: ✅";
    fi
}

function home_page_has_title() {
	CURL=$(curl --insecure --silent https://${MICROSERVICE_HOST}/${MICROSERVICE_PATH} | grep "IBM Cloud Architecture");
	SUCCESS=$?;

	# Check for 200 Status Code
	if [ "$SUCCESS" != "0" ]; then
		printf "home_page_has_title: ❌ \n${CURL}\n";
        exit 1;
    else
    	echo "home_page_has_title: ✅";
    fi
}

# Setup
parse_arguments $1 $2

# API Tests
echo "Starting Tests"
get_home_page
home_page_has_title

#!/bin/bash

function parse_arguments() {
	#set -x;
	# WEB_HOST
	if [ -z "${WEB_HOST}" ]; then
		echo "WEB_HOST not set. Using parameter \"$1\"";
		WEB_HOST=$1;
	fi

	if [ -z "${WEB_HOST}" ]; then
		echo "WEB_HOST not set. Using default key";
		WEB_HOST=127.0.0.1;
	fi

	# WEB_PORT
	if [ -z "${WEB_PORT}" ]; then
		echo "WEB_PORT not set. Using parameter \"$2\"";
		WEB_PORT=$2;
	fi

	if [ -z "${WEB_PORT}" ]; then
		echo "WEB_PORT not set. Using default key";
		WEB_PORT=8000;
	fi

	#set +x;
}

function get_home_page() {
	CURL=$(curl --write-out %{http_code} --silent --output /dev/null --max-time 5 -X GET http://${WEB_HOST}:${WEB_PORT});

	# Check for 201 Status Code
	if [ "$CURL" != "200" ]; then
		printf "get_home_page: ❌ \n${CURL}\n";
        exit 1;
    else 
    	echo "get_home_page: ✅";
    fi
}

function home_page_has_title() {
	CURL=$(curl --silent http://${WEB_HOST}:${WEB_PORT} | grep "IBM Cloud Architecture");
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



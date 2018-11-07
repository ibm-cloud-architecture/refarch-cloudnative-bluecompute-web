#!/bin/bash
HOST="localhost";
PORT="8000";
URL="http://${HOST}:${PORT}";
DEPLOYMENT="web-web";
SERVICE_PATH="catalog";

# trap ctrl-c and call ctrl_c() to stop port forwarding
trap ctrl_c INT

function ctrl_c() {
	echo "** Trapped CTRL-C... Killing Port Forwarding and Stopping Load";
	killall kubectl;
	exit 0;
}

function start_port_forwarding() {
	echo "Forwarding service port ${PORT}";
	kubectl port-forward deployment/${DEPLOYMENT} ${PORT}:${PORT} --pod-running-timeout=1h &
	echo "Sleeping for 3 seconds while connection is established...";
	sleep 3;
}

# Port Forwarding
start_port_forwarding

# Load Generation
echo "Generating load..."

while true; do
	curl -s ${URL}/${SERVICE_PATH} > /dev/null;
	sleep 0.2;
done
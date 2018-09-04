#!/bin/bash
if [ -n "$CLUSTER_NAME" ]; then
	echo "Using CLUSTER_NAME: ${CLUSTER_NAME}";
	jq --arg CLUSTER_NAME $CLUSTER_NAME '.Application.cluster_name = $CLUSTER_NAME' config/default.json > config/default2.json && \
	mv config/default2.json config/default.json
fi

if [ -n "$CLUSTER_REGION" ]; then
	echo "Using CLUSTER_REGION: ${CLUSTER_REGION}"
	jq --arg CLUSTER_REGION $CLUSTER_REGION '.Application.region = $CLUSTER_REGION' config/default.json > config/default2.json && \
	mv config/default2.json config/default.json
fi

# Auth
if [ -n "$AUTH_HOST" ] && [ -n "$AUTH_PORT" ]; then
	AUTH_URI="${AUTH_HOST}:${AUTH_PORT}"
	echo "Using AUTH_URI: ${AUTH_URI}"
	jq --arg AUTH_URI $AUTH_URI '.APIs.oauth20.service_name = $AUTH_URI' config/default.json > config/default2.json && \
	mv config/default2.json config/default.json
fi

if [ -n "$AUTH_PROTOCOL" ]; then
	echo "Using AUTH_PROTOCOL: ${AUTH_PROTOCOL}"
	jq --arg AUTH_PROTOCOL $AUTH_PROTOCOL '.APIs.oauth20.protocol = $AUTH_PROTOCOL' config/default.json > config/default2.json && \
	mv config/default2.json config/default.json
fi

# Catalog
if [ -n "$CATALOG_HOST" ] && [ -n "$CATALOG_PORT" ]; then
	CATALOG_URI="${CATALOG_HOST}:${CATALOG_PORT}"
	echo "Using CATALOG_URI: ${CATALOG_URI}"
	jq --arg CATALOG_URI $CATALOG_URI '.APIs.catalog.service_name = $CATALOG_URI' config/default.json > config/default2.json && \
	mv config/default2.json config/default.json
fi

if [ -n "$CATALOG_PROTOCOL" ]; then
	echo "Using CATALOG_PROTOCOL: ${CATALOG_PROTOCOL}"
	jq --arg CATALOG_PROTOCOL $CATALOG_PROTOCOL '.APIs.catalog.protocol = $CATALOG_PROTOCOL' config/default.json > config/default2.json && \
	mv config/default2.json config/default.json
fi

# Customer
if [ -n "$CUSTOMER_HOST" ] && [ -n "$CUSTOMER_PORT" ]; then
	CUSTOMER_URI="${CUSTOMER_HOST}:${CUSTOMER_PORT}"
	echo "Using CUSTOMER_URI: ${CUSTOMER_URI}"
	jq --arg CUSTOMER_URI $CUSTOMER_URI '.APIs.customer.service_name = $CUSTOMER_URI' config/default.json > config/default2.json && \
	mv config/default2.json config/default.json
fi

if [ -n "$CUSTOMER_PROTOCOL" ]; then
	echo "Using CUSTOMER_PROTOCOL: ${CUSTOMER_PROTOCOL}"
	jq --arg CUSTOMER_PROTOCOL $CUSTOMER_PROTOCOL '.APIs.customer.protocol = $CUSTOMER_PROTOCOL' config/default.json > config/default2.json && \
	mv config/default2.json config/default.json
fi

# Orders
if [ -n "$ORDERS_HOST" ] && [ -n "$ORDERS_PORT" ]; then
	ORDERS_URI="${ORDERS_HOST}:${ORDERS_PORT}"
	echo "Using ORDERS_URI: ${ORDERS_URI}"
	jq --arg ORDERS_URI $ORDERS_URI '.APIs.orders.service_name = $ORDERS_URI' config/default.json > config/default2.json && \
	mv config/default2.json config/default.json
fi

if [ -n "$ORDERS_PROTOCOL" ]; then
	echo "Using ORDERS_PROTOCOL: ${ORDERS_PROTOCOL}"
	jq --arg ORDERS_PROTOCOL $ORDERS_PROTOCOL '.APIs.orders.protocol = $ORDERS_PROTOCOL' config/default.json > config/default2.json && \
	mv config/default2.json config/default.json
fi

npm start
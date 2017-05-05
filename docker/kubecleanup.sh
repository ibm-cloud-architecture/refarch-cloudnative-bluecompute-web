#!/bin/bash
set -x

# Delete all helm jobs for this chart
cd chart/bluecompute-web
chart_name=$(yaml read Chart.yaml name)
chart_version=$(yaml read Chart.yaml version)

kubectl delete jobs -l chart=${chart_name}-${chart_version}

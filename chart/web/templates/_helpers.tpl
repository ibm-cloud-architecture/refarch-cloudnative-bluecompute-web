{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "webServiceName" -}}
  {{- .Release.Name }}-{{ .Values.service.name -}}
{{- end -}}

{{- define "name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
*/}}
{{- define "fullname" -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "clusterName" -}}
  {{- if .Values.clusterName -}}
    {{ .Values.clusterName }}
  {{- else if .Values.global.bluemix.clusterName -}}
    {{ .Values.global.bluemix.clusterName }}
  {{- else -}}
    {{- printf "??" -}}
  {{- end -}}
{{- end -}}

{{- define "region" -}}
  {{- if .Values.region -}}
    {{ .Values.region }}
  {{- else if .Values.global.bluemix.target.endpoint -}}
    {{ (split "." .Values.global.bluemix.target.endpoint)._1 }}
  {{- else -}}
    {{- printf "??" -}}
  {{- end -}}
{{- end -}}

{{- define "catalogHost" -}}
  {{- if .Values.services.catalog.host -}}
    {{/* a specific service is requested */}}
    {{- printf "%s" .Values.services.catalog.host -}}
  {{- else -}}
    {{/* assume one is installed with the release */}}
    {{- printf "%s-catalog" .Release.Name -}}
  {{- end -}}
{{- end -}}

{{- define "catalogPort" -}}
  {{- if .Values.services.catalog.port -}}
    {{/* a specific service is requested */}}
    {{- $port := default .Values.services.catalog.port | toString -}}
    {{- printf "%s" $port -}}
  {{- else -}}
    {{/* assume default port */}}
    {{- printf "8081" -}}
  {{- end -}}
{{- end -}}

{{- define "catalogProtocol" -}}
  {{- if .Values.services.catalog.protocol -}}
    {{- printf "%s" .Values.services.catalog.protocol -}}
  {{- else -}}
    {{- printf "http" -}}
  {{- end -}}
{{- end -}}

{{- define "authHost" -}}
  {{- if .Values.services.auth.host -}}
    {{/* a specific service is requested */}}
    {{- printf "%s" .Values.services.auth.host -}}
  {{- else -}}
    {{/* assume one is installed with the release */}}
    {{- printf "%s-auth" .Release.Name -}}
  {{- end -}}
{{- end -}}

{{- define "authPort" -}}
  {{- if .Values.services.auth.port -}}
    {{/* a specific service is requested */}}
    {{- $port := default .Values.services.auth.port | toString -}}
    {{- printf "%s" $port -}}
  {{- else -}}
    {{/* assume default port */}}
    {{- printf "8080" -}}
  {{- end -}}
{{- end -}}

{{- define "authProtocol" -}}
  {{- if .Values.services.auth.protocol -}}
    {{- printf "%s" .Values.services.auth.protocol -}}
  {{- else -}}
    {{- printf "http" -}}
  {{- end -}}
{{- end -}}

{{- define "customerHost" -}}
  {{- if .Values.services.customer.host -}}
    {{/* a specific service is requested */}}
    {{- printf "%s" .Values.services.customer.host -}}
  {{- else -}}
    {{/* assume one is installed with the release */}}
    {{- printf "%s-customer" .Release.Name -}}
  {{- end -}}
{{- end -}}

{{- define "customerPort" -}}
  {{- if .Values.services.customer.port -}}
    {{/* a specific service is requested */}}
    {{- $port := default .Values.services.customer.port | toString -}}
    {{- printf "%s" $port -}}
  {{- else -}}
    {{/* assume default port */}}
    {{- printf "8080" -}}
  {{- end -}}
{{- end -}}

{{- define "customerProtocol" -}}
  {{- if .Values.services.customer.protocol -}}
    {{- printf "%s" .Values.services.customer.protocol -}}
  {{- else -}}
    {{- printf "http" -}}
  {{- end -}}
{{- end -}}

{{- define "ordersHost" -}}
  {{- if .Values.services.orders.host -}}
    {{/* a specific service is requested */}}
    {{- printf "%s" .Values.services.orders.host -}}
  {{- else -}}
    {{/* assume one is installed with the release */}}
    {{- printf "%s-orders" .Release.Name -}}
  {{- end -}}
{{- end -}}

{{- define "ordersPort" -}}
  {{- if .Values.services.orders.port -}}
    {{/* a specific service is requested */}}
    {{- $port := default .Values.services.orders.port | toString -}}
    {{- printf "%s" $port -}}
  {{- else -}}
    {{/* assume default port */}}
    {{- printf "8080" -}}
  {{- end -}}
{{- end -}}

{{- define "ordersProtocol" -}}
  {{- if .Values.services.orders.protocol -}}
    {{- printf "%s" .Values.services.orders.protocol -}}
  {{- else -}}
    {{- printf "http" -}}
  {{- end -}}
{{- end -}}

{{- define "reviewsHost" -}}
  {{- if .Values.services.reviews.host -}}
    {{/* a specific service is requested */}}
    {{- printf "%s" .Values.services.reviews.host -}}
  {{- else -}}
    {{/* assume one is installed with the release */}}
    {{- printf "%s-reviews" .Release.Name -}}
  {{- end -}}
{{- end -}}

{{- define "reviewsPort" -}}
  {{- if .Values.services.reviews.port -}}
    {{/* a specific service is requested */}}
    {{- $port := default .Values.services.reviews.port | toString -}}
    {{- printf "%s" $port -}}
  {{- else -}}
    {{/* assume default port */}}
    {{- printf "8080" -}}
  {{- end -}}
{{- end -}}

{{- define "reviewsProtocol" -}}
  {{- if .Values.services.reviews.protocol -}}
    {{- printf "%s" .Values.services.reviews.protocol -}}
  {{- else -}}
    {{- printf "http" -}}
  {{- end -}}
{{- end -}}

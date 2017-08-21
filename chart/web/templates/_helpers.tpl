{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
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
    {{ .Values.services.catalog.host }}
  {{- else -}}
    {{/* assume one is installed with the release */}}
    {{- printf "%s-catalog" .Release.Name -}}
  {{- end -}}
{{- end -}}

{{- define "catalogPort" -}}
  {{- if .Values.services.catalog.host -}}
    {{/* a specific service is requested */}}
    {{ .Values.services.catalog.port }}
  {{- else -}}
    {{/* assume default port */}}
    {{- printf "8081" -}}
  {{- end -}}
{{- end -}}

{{- define "authHost" -}}
  {{- if .Values.services.auth.host -}}
    {{/* a specific service is requested */}}
    {{ .Values.services.auth.host }}
  {{- else -}}
    {{/* assume one is installed with the release */}}
    {{- printf "%s-auth" .Release.Name -}}
  {{- end -}}
{{- end -}}

{{- define "authPort" -}}
  {{- if .Values.services.auth.host -}}
    {{/* a specific service is requested */}}
    {{ .Values.services.auth.port }}
  {{- else -}}
    {{/* assume default port */}}
    {{- printf "8080" -}}
  {{- end -}}
{{- end -}}

{{- define "customerHost" -}}
  {{- if .Values.services.customer.host -}}
    {{/* a specific service is requested */}}
    {{ .Values.services.customer.host }}
  {{- else -}}
    {{/* assume one is installed with the release */}}
    {{- printf "%s-customer" .Release.Name -}}
  {{- end -}}
{{- end -}}

{{- define "customerPort" -}}
  {{- if .Values.services.customer.host -}}
    {{/* a specific service is requested */}}
    {{ .Values.services.customer.port }}
  {{- else -}}
    {{/* assume default port */}}
    {{- printf "8080" -}}
  {{- end -}}
{{- end -}}

{{- define "ordersHost" -}}
  {{- if .Values.services.orders.host -}}
    {{/* a specific service is requested */}}
    {{ .Values.services.orders.host }}
  {{- else -}}
    {{/* assume one is installed with the release */}}
    {{- printf "%s-orders" .Release.Name -}}
  {{- end -}}
{{- end -}}

{{- define "ordersPort" -}}
  {{- if .Values.services.orders.host -}}
    {{/* a specific service is requested */}}
    {{ .Values.services.orders.port }}
  {{- else -}}
    {{/* assume default port */}}
    {{- printf "8080" -}}
  {{- end -}}
{{- end -}}

{{- define "reviewsHost" -}}
  {{- if .Values.services.reviews.host -}}
    {{/* a specific service is requested */}}
    {{ .Values.services.reviews.host }}
  {{- else -}}
    {{/* assume one is installed with the release */}}
    {{- printf "%s-reviews" .Release.Name -}}
  {{- end -}}
{{- end -}}

{{- define "reviewsPort" -}}
  {{- if .Values.services.reviews.host -}}
    {{/* a specific service is requested */}}
    {{ .Values.services.reviews.port }}
  {{- else -}}
    {{/* assume default port */}}
    {{- printf "8080" -}}
  {{- end -}}
{{- end -}}


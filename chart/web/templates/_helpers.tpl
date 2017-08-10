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

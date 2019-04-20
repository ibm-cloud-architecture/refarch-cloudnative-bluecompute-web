{{- define "web.fullname" -}}
  {{- if .Values.fullnameOverride -}}
    {{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
  {{- else -}}
    {{- printf "%s-%s" .Release.Name .Chart.Name -}}
  {{- end -}}
{{- end -}}

{{/* Auth Labels Template */}}
{{- define "web.labels" }}
{{- range $key, $value := .Values.labels }}
{{ $key }}: {{ $value | quote }}
{{- end }}
heritage: {{ .Release.Service | quote }}
release: {{ .Release.Name | quote }}
chart: {{ .Chart.Name }}-{{ .Chart.Version | replace "+" "_" }}
{{- end }}

{{- define "web.cluster.name" -}}
  {{- if .Values.global.cluster.name -}}
    {{ .Values.global.cluster.name }}
  {{- else if .Values.cluster.name -}}
    {{ .Values.cluster.name }}
  {{- else -}}
    {{- printf "??" -}}
  {{- end -}}
{{- end -}}

{{- define "web.cluster.region" -}}
  {{- if .Values.global.cluster.region -}}
    {{ .Values.global.cluster.region }}
  {{- else if .Values.cluster.region -}}
    {{ .Values.cluster.region }}
  {{- else -}}
    {{- printf "??" -}}
  {{- end -}}
{{- end -}}

{{- define "web.catalog.host" -}}
  {{- if .Values.services.catalog.host -}}
    {{/* a specific service is requested */}}
    {{- printf "%s" .Values.services.catalog.host -}}
  {{- else -}}
    {{/* assume one is installed with the release */}}
    {{- printf "%s-catalog" .Release.Name -}}
  {{- end -}}
{{- end -}}

{{- define "web.catalog.port" -}}
  {{- if .Values.services.catalog.port -}}
    {{/* a specific service is requested */}}
    {{- $port := default .Values.services.catalog.port | toString -}}
    {{- printf "%s" $port -}}
  {{- else -}}
    {{/* assume default port */}}
    {{- printf "8081" -}}
  {{- end -}}
{{- end -}}

{{- define "web.catalog.protocol" -}}
  {{- if .Values.services.catalog.protocol -}}
    {{- printf "%s" .Values.services.catalog.protocol -}}
  {{- else -}}
    {{- printf "http" -}}
  {{- end -}}
{{- end -}}

{{- define "web.auth.host" -}}
  {{- if .Values.services.auth.host -}}
    {{/* a specific service is requested */}}
    {{- printf "%s" .Values.services.auth.host -}}
  {{- else -}}
    {{/* assume one is installed with the release */}}
    {{- printf "%s-auth" .Release.Name -}}
  {{- end -}}
{{- end -}}

{{- define "web.auth.port" -}}
  {{- if .Values.services.auth.port -}}
    {{/* a specific service is requested */}}
    {{- $port := default .Values.services.auth.port | toString -}}
    {{- printf "%s" $port -}}
  {{- else -}}
    {{/* assume default port */}}
    {{- printf "8083" -}}
  {{- end -}}
{{- end -}}

{{- define "web.auth.protocol" -}}
  {{- if .Values.services.auth.protocol -}}
    {{- printf "%s" .Values.services.auth.protocol -}}
  {{- else -}}
    {{- printf "http" -}}
  {{- end -}}
{{- end -}}

{{- define "web.customer.host" -}}
  {{- if .Values.services.customer.host -}}
    {{/* a specific service is requested */}}
    {{- printf "%s" .Values.services.customer.host -}}
  {{- else -}}
    {{/* assume one is installed with the release */}}
    {{- printf "%s-customer" .Release.Name -}}
  {{- end -}}
{{- end -}}

{{- define "web.customer.port" -}}
  {{- if .Values.services.customer.port -}}
    {{/* a specific service is requested */}}
    {{- $port := default .Values.services.customer.port | toString -}}
    {{- printf "%s" $port -}}
  {{- else -}}
    {{/* assume default port */}}
    {{- printf "8082" -}}
  {{- end -}}
{{- end -}}

{{- define "web.customer.protocol" -}}
  {{- if .Values.services.customer.protocol -}}
    {{- printf "%s" .Values.services.customer.protocol -}}
  {{- else -}}
    {{- printf "http" -}}
  {{- end -}}
{{- end -}}

{{- define "web.orders.host" -}}
  {{- if .Values.services.orders.host -}}
    {{/* a specific service is requested */}}
    {{- printf "%s" .Values.services.orders.host -}}
  {{- else -}}
    {{/* assume one is installed with the release */}}
    {{- printf "%s-orders" .Release.Name -}}
  {{- end -}}
{{- end -}}

{{- define "web.orders.port" -}}
  {{- if .Values.services.orders.port -}}
    {{/* a specific service is requested */}}
    {{- $port := default .Values.services.orders.port | toString -}}
    {{- printf "%s" $port -}}
  {{- else -}}
    {{/* assume default port */}}
    {{- printf "8084" -}}
  {{- end -}}
{{- end -}}

{{- define "web.orders.protocol" -}}
  {{- if .Values.services.orders.protocol -}}
    {{- printf "%s" .Values.services.orders.protocol -}}
  {{- else -}}
    {{- printf "http" -}}
  {{- end -}}
{{- end -}}

{{- define "web.reviews.host" -}}
  {{- if .Values.services.reviews.host -}}
    {{/* a specific service is requested */}}
    {{- printf "%s" .Values.services.reviews.host -}}
  {{- else -}}
    {{/* assume one is installed with the release */}}
    {{- printf "%s-reviews" .Release.Name -}}
  {{- end -}}
{{- end -}}

{{- define "web.reviews.port" -}}
  {{- if .Values.services.reviews.port -}}
    {{/* a specific service is requested */}}
    {{- $port := default .Values.services.reviews.port | toString -}}
    {{- printf "%s" $port -}}
  {{- else -}}
    {{/* assume default port */}}
    {{- printf "8085" -}}
  {{- end -}}
{{- end -}}

{{- define "web.reviews.protocol" -}}
  {{- if .Values.services.reviews.protocol -}}
    {{- printf "%s" .Values.services.reviews.protocol -}}
  {{- else -}}
    {{- printf "http" -}}
  {{- end -}}
{{- end -}}

{{/* Web Security Context */}}
{{- define "web.securityContext" }}
{{- range $key, $value := .Values.securityContext }}
{{ $key }}: {{ $value }}
{{- end }}
{{- end }}

{{/* Istio Gateway */}}
{{- define "web.istio.gateway" }}
  {{- if or .Values.global.istio.gateway.name .Values.istio.gateway.enabled .Values.istio.gateway.name }}
  gateways:
  {{ if .Values.global.istio.gateway.name -}}
  - {{ .Values.global.istio.gateway.name }}
  {{- else if .Values.istio.gateway.enabled }}
  - {{ template "web.fullname" . }}-gateway
  {{ else if .Values.istio.gateway.name -}}
  - {{ .Values.istio.gateway.name }}
  {{ end }}
  {{- end }}
{{- end }}
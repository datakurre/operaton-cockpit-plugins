# syntax=docker/dockerfile:1
ARG OPERATON_IMAGE=operaton/operaton:latest
ARG PLUGINS_REPO=https://github.com/datakurre/operaton-cockpit-plugins
ARG PLUGINS_REF=main

# ==============================================================================
# Stage 1: Fetch plugins from https://github.com/datakurre/operaton-cockpit-plugins
#          and prepare overlay according to this repository's webapps config
# ==============================================================================
FROM alpine:3.23 AS plugin-builder

ARG PLUGINS_REPO
ARG PLUGINS_REF

RUN apk add --no-cache curl tar

WORKDIR /tmp/plugins-src
RUN curl -sL "${PLUGINS_REPO}/archive/refs/heads/${PLUGINS_REF}.tar.gz" \
    | tar -xz --strip-components=1

WORKDIR /overlay/META-INF/resources/webjars/operaton/app

# 1. Copy plugin scripts for Cockpit, Admin, and Tasklist
RUN mkdir -p cockpit/scripts admin/scripts tasklist/scripts && \
    cp /tmp/plugins-src/cockpit-custom-styles.js \
       /tmp/plugins-src/dashboard-favourites.js \
       /tmp/plugins-src/dashboard-integrations.js \
       /tmp/plugins-src/definition-historic-activities.js \
       /tmp/plugins-src/definition-tab-modify.js \
       /tmp/plugins-src/instance-auto-refresh.js \
       /tmp/plugins-src/instance-action-unlock.js \
       /tmp/plugins-src/instance-historic-activities.js \
       /tmp/plugins-src/instance-route-history.js \
       /tmp/plugins-src/instance-tab-modify.js \
       /tmp/plugins-src/robot-module.js \
       cockpit/scripts/ && \
    cp /tmp/plugins-src/admin-route-authorization.js \
       /tmp/plugins-src/admin-nologin.js \
       admin/scripts/ && \
    cp /tmp/plugins-src/tasklist-audit-log.js \
       /tmp/plugins-src/tasklist-nologin.js \
       tasklist/scripts/

# 2. Copy webapp configurations from repository
RUN cp /tmp/plugins-src/admin-config.js admin/scripts/config.js && \
    cp /tmp/plugins-src/tasklist-config.js tasklist/scripts/config.js && \
    cp /tmp/plugins-src/config.js cockpit/scripts/config.js

# Ensure Cockpit config strictly references plugins from operaton-cockpit-plugins
# (stripping the local JupyterLite script reference if jupyter assets are not bundled)
RUN sed -i '/jupyter/d' cockpit/scripts/config.js

# 3. Mirror the structure into app/ for WAR packaging
RUN mkdir -p /overlay/app && \
    cp -r /overlay/META-INF/resources/webjars/operaton/app/* /overlay/app/ && \
    chmod -R a+r /overlay


# ==============================================================================
# Stage 2: Base on latest Operaton image and inject webapp plugins into webjars
# ==============================================================================
FROM ${OPERATON_IMAGE}

USER root

# Install zip to update jar/war archives in place
RUN apk add --no-cache zip

# Copy the prepared overlay from Stage 1
COPY --from=plugin-builder /overlay /overlay

# Update the internal webapps archives with the configs and plugin scripts
RUN cd /overlay && \
    for jar in /operaton/internal/webapps/operaton-webapp-webjar-*.jar; do \
      if [ -f "$jar" ]; then \
        echo "Updating $jar with plugins and config.js ..."; \
        zip -u "$jar" \
          META-INF/resources/webjars/operaton/app/cockpit/scripts/* \
          META-INF/resources/webjars/operaton/app/admin/scripts/* \
          META-INF/resources/webjars/operaton/app/tasklist/scripts/*; \
      fi; \
    done && \
    for war in /operaton/internal/webapps/operaton-webapp-*.war; do \
      if [ -f "$war" ]; then \
        echo "Updating $war with plugins and config.js ..."; \
        zip -u "$war" \
          app/cockpit/scripts/* \
          app/admin/scripts/* \
          app/tasklist/scripts/*; \
      fi; \
    done && \
    rm -rf /overlay && \
    apk del zip

USER operaton

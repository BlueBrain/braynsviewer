# Build ReactJS application
ARG BRAYNSVIEWER_NODE_IMAGE_VERSION=16.13.1
ARG BRAYNSVIEWER_NGINX_IMAGE_VERSION=stable-alpine

# Build React app
FROM node:${BRAYNSVIEWER_NODE_IMAGE_VERSION} as builder
WORKDIR /app
ADD . /app
RUN npm install && \
    npm test && \
    npm run build

# Build Nginx server
FROM nginx:${BRAYNSVIEWER_NGINX_IMAGE_VERSION}

# This argument specifies the "subdirectory" path for the build version
# of the application e.g. if we run it on http://bbpteam.epfl.ch/viz/brayns-viewer/
# then BRAYNSVIEWER_BASE_PATH argument should be `/viz/brayns-viewer`
ARG BRAYNSVIEWER_BASE_PATH=""

ARG BRAYNSVIEWER_NGINX_HTML_ROOT=/usr/share/nginx/html
ARG BRAYNSVIEWER_BUILD_PATH=/app/build

# Copy app artifacts
COPY --from=builder ${BRAYNSVIEWER_BUILD_PATH} ${BRAYNSVIEWER_NGINX_HTML_ROOT}

# Fix a bug that occurs only in Kaniko.
# @see https://github.com/GoogleContainerTools/kaniko/issues/1278
RUN test -e /var/run || ln -s /run /var/run

# Add Nginx configuration file and change the base path
ADD ./deployment/nginx/default.conf /etc/nginx/conf.d
ADD deployment/nginx/braynsviewer-alias.locations /etc/nginx/conf.d

# Set up Nginx cache and log directories
ADD ./deployment/nginx/setup-nginx.sh /tmp
RUN chmod +x /tmp/setup-nginx.sh && /tmp/setup-nginx.sh

# Add permissions for nginx user
RUN chown -R nginx:nginx ${BRAYNSVIEWER_NGINX_HTML_ROOT} && chmod -R 755 ${BRAYNSVIEWER_NGINX_HTML_ROOT} && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d

RUN touch /var/run/nginx.pid
RUN chown -R nginx:nginx /var/run/nginx.pid

USER nginx

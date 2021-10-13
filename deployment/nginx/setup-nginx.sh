set -e

if [ -z "${BRAYNSVIEWER_BASE_PATH}" ]
then
  echo -n "" > /etc/nginx/conf.d/braynsviewer-alias.locations
else
  sed -i "s;%BRAYNSVIEWER_BASE_PATH%;${BRAYNSVIEWER_BASE_PATH};g" /etc/nginx/conf.d/braynsviewer-alias.locations
  sed -i "s;%BRAYNSVIEWER_NGINX_HTML_ROOT%;${BRAYNSVIEWER_NGINX_HTML_ROOT};g" /etc/nginx/conf.d/braynsviewer-alias.locations
fi

sed -i "s;%BRAYNSVIEWER_NGINX_HTML_ROOT%;${BRAYNSVIEWER_NGINX_HTML_ROOT};g" /etc/nginx/conf.d/default.conf

NGINX_CONF=/etc/nginx/nginx.conf
NGINX_LOG_DIR=/var/log/nginx

chmod -R 777 /var/cache/nginx
sed -i -e '/user/!b' -e '/nginx/!b' -e '/nginx/d' ${NGINX_CONF}
sed -i 's!/var/run/nginx.pid!/var/cache/nginx/nginx.pid!g' ${NGINX_CONF}
ln -sf /dev/stdout ${NGINX_LOG_DIR}/access.log
ln -sf /dev/stderr ${NGINX_LOG_DIR}/error.log

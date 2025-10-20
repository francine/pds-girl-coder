#!/bin/sh
set -e

# Railway provides PORT environment variable
# Default to 80 if PORT is not set (for local development)
export PORT=${PORT:-80}

echo "Starting Nginx on port $PORT"

# Replace PORT in nginx config
sed -i "s/listen 80;/listen $PORT;/g" /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g "daemon off;"

#!/usr/bin/env bash
cd /src/

# start main work
#tail -f /dev/null
#export NODE_CONFIG_ENV="docker"

echo "Starting build"
npm run build
echo "Starting application"
npm run serve

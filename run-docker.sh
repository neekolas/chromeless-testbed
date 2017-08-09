#!/bin/bash -e

cp -R ./src ./dist
docker build -t chromeless-docker .
docker run --rm -it --shm-size=1024m -p=127.0.0.1:9222:9222 chromeless-docker 

#!/bin/bash -e

cp -R ./src ./dist
docker run --rm -it -v "$PWD/dist":/var/task lambci/lambda:nodejs6.10 src/index.handler "{\"url\": \"$1\"}"

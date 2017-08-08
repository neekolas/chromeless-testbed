#!/bin/bash -e

cp -R ./src ./dist
docker run --rm -it -v "$PWD/dist":/var/task lambci/lambda:nodejs6.10 src/new-chrome-every-invoke.handler '{"url": "http://www.apple.com"}'

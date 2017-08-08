#!/bin/bash
set -e

rm -rf ./dist/*
cp package.json package-lock.json ./dist
cp -R ./src ./dist
docker run --rm -v "$PWD/dist:/var/task" lambci/lambda:build-nodejs6.10 npm i --production
aws cloudformation package --template-file ./stack.yml --s3-bucket cws-cfn-templates-dev --s3-prefix chromeless --output-template-file /tmp/main.cf

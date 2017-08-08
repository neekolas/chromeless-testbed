#!/bin/bash

cp -R ./src ./dist
OUT_TEMPLATE_LOCATION=/tmp/chromeless.yml
aws cloudformation package --template-file ./stack.yml --s3-bucket cws-cfn-templates-dev --s3-prefix chromeless --output-template-file $OUT_TEMPLATE_LOCATION
aws cloudformation deploy --template-file $OUT_TEMPLATE_LOCATION --stack-name $1 --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM

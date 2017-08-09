#!/bin/bash -e

runfn() {
    FN_NAME=`aws cloudformation describe-stacks --stack-name $1 --query "Stacks[0].Outputs[?OutputKey=='Fn'].OutputValue" --output text`
    RESULT=`aws lambda invoke --invocation-type RequestResponse \
        --function-name $FN_NAME \
        --region us-east-1 \
        --log-type Tail \
        --payload '{"url":"http://www.cnn.com"}' \
        -`
    node -e "console.log(Buffer(JSON.parse(process.argv[1]).LogResult, 'base64').toString('binary'))" "$RESULT"
}
runfn $1 && runfn $1 && runfn $1 && runfn $1 && runfn $1

## Chromeless Test Environment

Simple test environment and build scripts for Chromeless running directly on AWS lambda.

#### Includes
- Build script to install all dependencies using lambci/docker-lambda
- Test lambda function using serverless-lambda
- Local runner script to crawl a URL
- CloudFormation stack to deploy to AWS

### Usage
```
git clone git@github.com:neekolas/chromeless-testbed.git
cd chromeless-testbed
./build.sh
./run.sh http://www.nytimes.com
```

### Deployment
_Assumes you have AWS Cli configured_
```
./build.sh
./deploy.sh my-stack-name
```

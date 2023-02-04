# TeamTask
Task Manager backend for members of a Team.
Serverless implementation with Node Js,AWS Lambda,AWS API Gateway, AWS DynamoDB, Webhooks.
Create,Read, Update, Delete,Assign Task,Mark status of the task.
CI/CD pipeline with github workflows.


### Installation

Install the `serverless` CLI via NPM:

```bash
npm install -g serverless
```
Install other dependencies via NPM in project folder:

```bash
npm install
```

### AWS User

Create IAM user in AWS with all below permissions:
- AmazonAPIGatewayAdministrator	
- AmazonDynamoDBFullAccess	
- AmazonS3FullAccess	
- AWSCloudFormationFullAccess	
- AWSLambda_FullAccess	
- CloudWatchLogsFullAccess
- IAMFullAccess

Copy the Access Key and Secret Key and save the credentials in your github repo Secret Token.

Push the Code to Main Branch and apis should be up and running after deployment

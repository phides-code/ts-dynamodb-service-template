# go-dynamodb-service-template

A Go project template providing CRUD services for a DynamoDB table, using AWS Lambda and API Gateway, deployed with AWS SAM and GitHub Actions.

### Customize

-   Find and replace `Appname` with the name of the app (upper and lowercase A)
-   Find and replace `Banana`/`Bananas` with the table name (upper and lowercase B)
-   Find and replace `ca-central-1` with the AWS region
-   Update fields in `database.go`
-   Update values in `constants.go`

### Deploy manually

-   `make deploy`

### Run locally

-   `make build && sam local start-api --port 8000`

### Setup GitHub actions

Once the repo is setup on GitHub, add AWS secrets to GitHub Actions for this repo:

-   `gh secret set AWS_ACCESS_KEY_ID`
-   `gh secret set AWS_SECRET_ACCESS_KEY`

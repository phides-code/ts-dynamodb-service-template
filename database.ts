import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { Entity, LambdaHandlerParams } from './types';
import { serverError } from './helpers';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const listEntities = async (handlerParams: LambdaHandlerParams) => {
    try {
        const command = new ScanCommand({
            ProjectionExpression: 'id, description',
            TableName: 'AppnameApples',
        });

        const response = await docClient.send(command);

        return response.Items as Entity[];
    } catch (err) {
        const { callback } = handlerParams;

        return serverError(callback);
    }
};

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    GetCommand,
    ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { Entity, LambdaHandlerParams } from './types';
import { clientError, serverError } from './helpers';
import { TableName } from './constants';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const listEntities = async (handlerParams: LambdaHandlerParams) => {
    try {
        const command = new ScanCommand({
            ProjectionExpression: 'id, description',
            TableName: TableName,
        });

        const response = await docClient.send(command);

        return response.Items as Entity[];
    } catch (err) {
        const { callback } = handlerParams;
        console.log('listEntities caught error: ', err);
        return serverError(callback);
    }
};

export const getEntity = async (handlerParams: LambdaHandlerParams) => {
    try {
        const { event } = handlerParams;
        const id: string = event.pathParameters?.id as string;

        const command = new GetCommand({
            TableName: TableName,
            Key: {
                id: id,
            },
        });

        const response = await docClient.send(command);

        if (!response.Item) {
            throw new Error('invalid item id');
        }

        return response.Item as Entity;
    } catch (err) {
        const { callback } = handlerParams;
        console.log('getEntity caught error: ', err);

        return clientError(400, callback);
    }
};

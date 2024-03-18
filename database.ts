import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    ScanCommand,
    UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { Entity, LambdaHandlerParams, NewOrUpdatedEntity } from './types';
import { clientError, serverError } from './helpers';
import { TableName } from './constants';
import { randomUUID } from 'crypto';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const listEntities = async (handlerParams: LambdaHandlerParams) => {
    try {
        const command = new ScanCommand({
            ProjectionExpression: 'id, description, quantity',
            TableName: TableName,
        });

        const response = await docClient.send(command);

        return response.Items as Entity[];
    } catch (err) {
        console.log('listEntities caught error: ', err);

        const { callback } = handlerParams;
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
        console.log('getEntity caught error: ', err);

        const { callback } = handlerParams;
        return clientError(400, callback);
    }
};

export const insertEntity = async (handlerParams: LambdaHandlerParams) => {
    try {
        const { event } = handlerParams;

        const newEntity: NewOrUpdatedEntity = JSON.parse(event.body as string);

        const newEntityWithId: Entity = {
            id: randomUUID(),
            ...newEntity,
        };

        const command = new PutCommand({
            TableName: TableName,
            Item: newEntityWithId,
        });

        const response = await docClient.send(command);

        if (response.$metadata.httpStatusCode !== 200) {
            throw new Error('failed to insert new entity');
        }

        return newEntityWithId;
    } catch (err) {
        console.log('insertEntity caught error: ', err);

        const { callback } = handlerParams;
        return serverError(callback);
    }
};

export const deleteEntity = async (handlerParams: LambdaHandlerParams) => {
    try {
        const { event } = handlerParams;
        const id: string = event.pathParameters?.id as string;

        const command = new DeleteCommand({
            TableName: TableName,
            Key: {
                id,
            },
            ReturnValues: 'ALL_OLD',
        });

        const response = await docClient.send(command);

        if (response.$metadata.httpStatusCode !== 200) {
            throw new Error('failed to delete entity');
        }

        return response.Attributes as Entity;
    } catch (err) {
        console.log('deleteEntity caught error: ', err);

        const { callback } = handlerParams;
        return serverError(callback);
    }
};

export const updateEntity = async (handlerParams: LambdaHandlerParams) => {
    try {
        const { event } = handlerParams;
        const id: string = event.pathParameters?.id as string;
        const updatedEntity: NewOrUpdatedEntity = JSON.parse(
            event.body as string
        );
        const { description, quantity } = updatedEntity;

        const command = new UpdateCommand({
            TableName: TableName,
            Key: {
                id,
            },
            UpdateExpression:
                'SET #description = :description, #quantity = :quantity',

            ExpressionAttributeNames: {
                '#description': 'description',
                '#quantity': 'quantity',
            },
            ExpressionAttributeValues: {
                ':description': description,
                ':quantity': quantity,
            },
            ReturnValues: 'ALL_NEW',
        });

        const response = await docClient.send(command);

        if (response.$metadata.httpStatusCode !== 200) {
            throw new Error('failed to update entity');
        }

        return response.Attributes as Entity;
    } catch (err) {
        console.log('updateEntity caught error: ', err);

        const { callback } = handlerParams;
        return serverError(callback);
    }
};

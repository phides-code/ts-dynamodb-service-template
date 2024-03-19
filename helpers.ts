import { APIGatewayProxyCallback } from 'aws-lambda';
import * as http from 'http';
import { NewOrUpdatedEntity, ResponseStructure } from './types';
import { headers, InvalidItemError } from './constants';

const ExampleNewOrUpdatedEntity: NewOrUpdatedEntity = {
    // update with required entity fields
    description: 'a',
    quantity: 0,
};

export const validateEntity = (entity: any): boolean => {
    const entityKeys = Object.keys(entity);
    const interfaceKeys = Object.keys(ExampleNewOrUpdatedEntity);

    if (entityKeys.length !== interfaceKeys.length) {
        return false;
    }

    for (const key of entityKeys) {
        if (!interfaceKeys.includes(key)) {
            return false;
        }
    }

    return true;
};

export const handleError = (
    process: string,
    error: Error,
    callback: APIGatewayProxyCallback
) => {
    const errorMessage = error.message;
    console.log(process, 'caught error:', errorMessage);

    if (errorMessage === InvalidItemError) {
        return clientError(400, callback);
    }

    return serverError(callback);
};

export const clientError = (
    httpStatus: number,
    callback: APIGatewayProxyCallback
) => {
    console.log('send client error message');
    const errorMessage: string =
        http.STATUS_CODES[httpStatus] || 'Unknown Status';

    const response: ResponseStructure = {
        data: null,
        errorMessage,
    };

    return callback(null, {
        statusCode: httpStatus,
        body: JSON.stringify(response),
        headers,
    });
};

export const serverError = (callback: APIGatewayProxyCallback) => {
    console.log('send server error message');
    const errorMessage: string = http.STATUS_CODES[500] as string;

    const response: ResponseStructure = {
        data: null,
        errorMessage,
    };

    return callback(null, {
        statusCode: 500,
        body: JSON.stringify(response),
        headers,
    });
};

export const buildEntityFields = () => {
    let entityFields = 'id,';

    for (const prop in ExampleNewOrUpdatedEntity) {
        entityFields += ` ${prop},`;
    }

    return entityFields.slice(0, -1);
};

export const buildUpdateExpression = (): string => {
    let updateExpression = 'SET';

    for (const prop in ExampleNewOrUpdatedEntity) {
        updateExpression += ` #${prop} = :${prop},`;
    }

    return updateExpression.slice(0, -1);
};

export const buildExpressionAttributeNames = () => {
    let expressionAttributeNames = {};

    for (const prop in ExampleNewOrUpdatedEntity) {
        expressionAttributeNames = {
            ...expressionAttributeNames,
            [`#${prop}`]: prop,
        };
    }

    return expressionAttributeNames;
};

export const buildExpressionAttributeValues = (entity: NewOrUpdatedEntity) => {
    let expressionAttributeValues = {};
    for (const prop in entity) {
        expressionAttributeValues = {
            ...expressionAttributeValues,
            [`:${prop}`]: entity[prop as keyof NewOrUpdatedEntity],
        };
    }

    return expressionAttributeValues;
};

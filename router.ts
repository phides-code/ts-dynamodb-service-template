import { APIGatewayProxyCallback } from 'aws-lambda';
import { ApiPath, headers } from './constants';
import {
    deleteEntity,
    getEntity,
    insertEntity,
    listEntities,
    updateEntity,
} from './database';
import { clientError, handleError, validateEntity } from './helpers';
import { Entity, LambdaHandlerParams, ResponseStructure } from './types';

export const router = async (handlerParams: LambdaHandlerParams) => {
    const { event, callback } = handlerParams;

    switch (event.httpMethod) {
        case 'GET':
            return processGet(handlerParams);
        case 'POST':
            return processPost(handlerParams);
        case 'DELETE':
            return processDelete(handlerParams);
        case 'PUT':
            return processPut(handlerParams);
        case 'OPTIONS':
            return processOptions(callback);
        default:
            // method not allowed
            return clientError(405, callback);
    }
};

const processGet = async (handlerParams: LambdaHandlerParams) => {
    const { event } = handlerParams;

    if (!event.pathParameters) {
        return processGetAll(handlerParams);
    }

    return processGetEntityById(handlerParams);
};

const processGetAll = async (handlerParams: LambdaHandlerParams) => {
    const { callback } = handlerParams;
    try {
        const entities: Entity[] = (await listEntities()) as Entity[];

        const response: ResponseStructure = {
            data: entities,
            errorMessage: null,
        };

        return callback(null, {
            statusCode: 200,
            body: JSON.stringify(response),
            headers,
        });
    } catch (err) {
        handleError('processGetAll', err as Error, callback);
    }
};

const processGetEntityById = async (handlerParams: LambdaHandlerParams) => {
    const { callback } = handlerParams;
    try {
        const entity: Entity = (await getEntity(handlerParams)) as Entity;

        const response: ResponseStructure = {
            data: entity,
            errorMessage: null,
        };

        return callback(null, {
            statusCode: 200,
            body: JSON.stringify(response),
            headers,
        });
    } catch (err) {
        handleError('processGetEntityById', err as Error, callback);
    }
};

const processPost = async (handlerParams: LambdaHandlerParams) => {
    const { callback, event } = handlerParams;
    try {
        const newEntity = JSON.parse(event.body as string);

        if (!validateEntity(newEntity)) {
            console.log('invalid newEntity');
            return clientError(400, callback);
        }

        const entity: Entity = (await insertEntity(handlerParams)) as Entity;

        const response: ResponseStructure = {
            data: entity,
            errorMessage: null,
        };

        const locationHeader = {
            Location: `/${ApiPath}/${entity.id}`,
        };

        return callback(null, {
            statusCode: 201,
            body: JSON.stringify(response),
            headers: { ...headers, ...locationHeader },
        });
    } catch (err) {
        handleError('processPost', err as Error, callback);
    }
};

const processDelete = async (handlerParams: LambdaHandlerParams) => {
    const { callback, event } = handlerParams;
    try {
        if (!event.pathParameters) {
            return clientError(400, callback);
        }

        const entity: Entity = (await deleteEntity(handlerParams)) as Entity;

        const response: ResponseStructure = {
            data: entity,
            errorMessage: null,
        };

        return callback(null, {
            statusCode: 200,
            body: JSON.stringify(response),
            headers,
        });
    } catch (err) {
        handleError('processDelete', err as Error, callback);
    }
};

const processPut = async (handlerParams: LambdaHandlerParams) => {
    const { callback, event } = handlerParams;
    try {
        if (!event.pathParameters) {
            return clientError(400, callback);
        }

        const updatedEntity = JSON.parse(event.body as string);

        if (!validateEntity(updatedEntity)) {
            console.log('invalid updatedEntity');

            return clientError(400, callback);
        }

        const entity: Entity = (await updateEntity(handlerParams)) as Entity;

        const response: ResponseStructure = {
            data: entity,
            errorMessage: null,
        };

        const locationHeader = {
            Location: `/${ApiPath}/${entity.id}`,
        };

        return callback(null, {
            statusCode: 200,
            body: JSON.stringify(response),
            headers: { ...headers, ...locationHeader },
        });
    } catch (err) {
        handleError('processPut', err as Error, callback);
    }
};

const processOptions = async (callback: APIGatewayProxyCallback) => {
    const corsHeaders = {
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE',
        'Access-Control-Max-Age': '3600',
    };

    return callback(null, {
        statusCode: 200,
        body: '',
        headers: { ...headers, ...corsHeaders },
    });
};

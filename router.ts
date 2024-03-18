import { ApiPath, headers } from './constants';
import {
    deleteEntity,
    getEntity,
    insertEntity,
    listEntities,
} from './database';
import { clientError } from './helpers';
import {
    Entity,
    LambdaHandlerParams,
    NewOrUpdatedEntity,
    ResponseStructure,
} from './types';

export const router = async (handlerParams: LambdaHandlerParams) => {
    const { event } = handlerParams;

    switch (event.httpMethod) {
        case 'GET':
            return processGet(handlerParams);
        case 'POST':
            return processPost(handlerParams);
        case 'DELETE':
            return processDelete(handlerParams);
        // case "PUT":
        //     return processPut(handlerParams);
        // case "OPTIONS":
        //     return processOptions()
        default:
            // method not allowed
            const { callback } = handlerParams;

            return clientError(405, callback);
    }
};

const validateEntity = (newEntity: any): newEntity is NewOrUpdatedEntity => {
    return (
        typeof newEntity === 'object' &&
        newEntity !== null &&
        'description' in newEntity &&
        typeof newEntity.description === 'string'
    );
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
    const entities: Entity[] = (await listEntities(handlerParams)) as Entity[];

    const response: ResponseStructure = {
        data: entities,
        errorMessage: null,
    };

    return callback(null, {
        statusCode: 200,
        body: JSON.stringify(response),
        headers,
    });
};

const processGetEntityById = async (handlerParams: LambdaHandlerParams) => {
    const { callback } = handlerParams;

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
};

const processPost = async (handlerParams: LambdaHandlerParams) => {
    const { callback, event } = handlerParams;

    const newEntity = JSON.parse(event.body as string);

    if (!validateEntity(newEntity)) {
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
};

const processDelete = async (handlerParams: LambdaHandlerParams) => {
    const { callback } = handlerParams;

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
};

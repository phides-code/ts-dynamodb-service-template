import { listEntities } from './database';
import { clientError } from './helpers';
import { Entity, LambdaHandlerParams, ResponseStructure } from './types';

export const router = async (handlerParams: LambdaHandlerParams) => {
    const { event } = handlerParams;

    switch (event.httpMethod) {
        case 'GET':
            return processGet(handlerParams);
        // case "POST":
        //     return processPost(handlerParams);
        // case "DELETE":
        //     return processDelete(handlerParams);
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

const processGet = async (handlerParams: LambdaHandlerParams) => {
    const { callback } = handlerParams;
    const entities: Entity[] = (await listEntities(handlerParams)) as Entity[];

    const response: ResponseStructure = {
        data: entities,
        errorMessage: null,
    };

    return callback(null, {
        statusCode: 200,
        body: JSON.stringify(response),
    });
};

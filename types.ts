import { APIGatewayEvent, APIGatewayProxyCallback, Context } from 'aws-lambda';

export interface LambdaHandlerParams {
    event: APIGatewayEvent;
    context: Context;
    callback: APIGatewayProxyCallback;
}

export interface Entity {
    id: string;
    description: string;
}

export interface ResponseStructure {
    data: Entity[] | Entity | string | null;
    errorMessage: string | null;
}

import { APIGatewayEvent, APIGatewayProxyCallback, Context } from 'aws-lambda';

export interface LambdaHandlerParams {
    event: APIGatewayEvent;
    context: Context;
    callback: APIGatewayProxyCallback;
}

export interface Entity {
    id: string;
    description: string;
    quantity: number;
}

export interface NewOrUpdatedEntity {
    description: string;
    quantity: number;
}

export interface ResponseStructure {
    data: Entity[] | Entity | null;
    errorMessage: string | null;
}

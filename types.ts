import { APIGatewayEvent, APIGatewayProxyCallback } from 'aws-lambda';

export interface NewOrUpdatedEntity {
    // update with required entity fields
    description: string;
    quantity: number;
}

export interface Entity extends NewOrUpdatedEntity {
    id: string;
}

export interface LambdaHandlerParams {
    event: APIGatewayEvent;
    callback: APIGatewayProxyCallback;
}

export interface ResponseStructure {
    data: Entity[] | Entity | null;
    errorMessage: string | null;
}

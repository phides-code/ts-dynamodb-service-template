import { APIGatewayProxyCallback } from 'aws-lambda';
import * as http from 'http';
import { ResponseStructure } from './types';

export const clientError = (
    httpStatus: number,
    callback: APIGatewayProxyCallback
) => {
    console.log('run clientError');
    const errorMessage: string =
        http.STATUS_CODES[httpStatus] || 'Unknown Status';

    const response: ResponseStructure = {
        data: null,
        errorMessage,
    };

    return callback(null, {
        statusCode: httpStatus,
        body: JSON.stringify(response),
    });
};

export const serverError = (callback: APIGatewayProxyCallback) => {
    console.log('run serverError');
    const errorMessage: string = http.STATUS_CODES[500] as string;

    const response: ResponseStructure = {
        data: null,
        errorMessage,
    };

    return callback(null, {
        statusCode: 500,
        body: JSON.stringify(response),
    });
};

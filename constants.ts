// customize OriginURL, ApiPath, and TableName
export const OriginURL = 'http://localhost:3000';

export const ApiPath = 'apples';

export const TableName = 'AppnameApples';

export const headers = {
    'Access-Control-Allow-Origin': OriginURL,
    'Access-Control-Allow-Headers':
        'Content-Type, x-amz-content-sha256, x-amz-date, X-Amz-Security-Token, Authorization',
    'Access-Control-Allow-Credentials': 'true',
};

export const InvalidItemError = 'invalid item id';

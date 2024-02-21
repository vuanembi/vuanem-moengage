import axios, { AxiosError } from 'axios';
import axiosRetry from 'axios-retry';

import { logger } from '../logging.service';

const APP_ID = 'IS1NBURFC2MYWW6ATDN7F3LN';
const API_ID = 'IS1NBURFC2MYWW6ATDN7F3LN';

type APIResponseSucesss = { status: 'success' };
type APIResponseFailure = { status: 'fail'; error: { type: string; message: string } };

const moengageClient = axios.create({
    baseURL: `https://api-04.moengage.com/v1`,
    auth: { username: API_ID, password: process.env.MOENGAGE_DATA_API_KEY ?? '' },
});

moengageClient.interceptors.response.use((response) => {
    const data = <APIResponseSucesss | APIResponseFailure>response.data;
    if (data.status === 'fail') {
        logger.error({ fn: 'moengage-api', data });
        throw new AxiosError(data.error.message, 'moengage-error', response.config, response.request, response);
    }
    return response;
});

axiosRetry(moengageClient, {
    retries: 5,
    retryDelay: (count) => axiosRetry.exponentialDelay(count, undefined, 1000),
    retryCondition: (error) => error.response?.status === 502,
});

export type UserElement = {
    type: 'customer';
    customer_id: string;
    attributes: object;
};

export type EventElement = {
    type: 'event';
    customer_id: string;
    actions: object[];
};

export const bulkImport = async (elements: (UserElement | EventElement)[]) => {
    return await moengageClient
        .request<APIResponseSucesss>({
            method: 'POST',
            url: `/transition/${APP_ID}`,
            data: { type: 'transition', elements },
        })
        .then((response) => response.data);
};

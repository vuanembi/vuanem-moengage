import axios, { AxiosError } from 'axios';
import axiosRetry from 'axios-retry';

import { logger } from '../logging.service';
import { APP_ID, API_ID } from './moengage.const';

type APIResponse = { status: 'success' } | { status: 'fail'; error: { type: string; message: string } };

const client = axios.create({
    baseURL: `https://api-04.moengage.com/v1`,
    auth: { username: API_ID, password: process.env.MOENGAGE_DATA_API_KEY ?? '' },
});

client.interceptors.response.use((response) => {
    const data = <APIResponse>response.data;
    if (data.status === 'fail') {
        logger.error({ fn: 'moengage-api', data });
        throw new AxiosError(data.error.message, 'moengage-error', response.config, response.request, response);
    }
    return response;
});

axiosRetry(client, {
    retries: 5,
    retryDelay: (count) => axiosRetry.exponentialDelay(count, undefined, 1000),
    retryCondition: (error) => error.response?.status === 502,
});

export type Element = {
    type: 'customer' | 'event';
    customer_id: string;
    attributes?: object;
    actions?: object[];
};

export const bulkImport = async (elements: Element[]) => {
    return await client
        .request<APIResponse>({
            method: 'POST',
            url: `/transition/${APP_ID}`,
            data: { type: 'transition', elements },
        })
        .then((response) => response.data);
};

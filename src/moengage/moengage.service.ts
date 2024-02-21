import axios, { AxiosError } from 'axios';
import axiosRetry from 'axios-retry';

import { logger } from '../logging.service';
import { CustomerElement, EventElement } from './moengage.type';
import { APP_ID, API_ID } from './moengage.const';

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

export const bulkImport = async (elements: (CustomerElement | EventElement)[]) => {
    return await moengageClient
        .request<APIResponseSucesss>({
            method: 'POST',
            url: `/transition/${APP_ID}`,
            data: { type: 'transition', elements },
        })
        .then((response) => response.data);
};

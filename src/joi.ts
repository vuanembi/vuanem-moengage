import JoiDefault from 'joi';
import { BigQueryDate, BigQueryTimestamp } from '@google-cloud/bigquery';
import Big from 'big.js';

import dayjs from './dayjs';

export const Joi = JoiDefault.defaults((schema) => schema.allow(null).empty(''));

export const number = Joi.custom((value) => {
    if (value instanceof Big) {
        return value.toNumber();
    }
    return Number(value);
});

export const timestamp = Joi.custom((value) => {
    if (value instanceof BigQueryTimestamp || value instanceof BigQueryDate || value instanceof BigQueryDate) {
        return dayjs(value.value).toISOString();
    }

    return null;
});

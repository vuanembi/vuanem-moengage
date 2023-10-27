import JoiDefault from 'joi';
import { BigQueryDate, BigQueryTimestamp } from '@google-cloud/bigquery';
import Big from 'big.js';

import dayjs from '../dayjs';

const Joi = JoiDefault.defaults((schema) => schema.allow(null).empty(''));

const numberSchema = Joi.custom((value) => {
    if (value instanceof Big) {
        return value.toNumber();
    }
    return Number(value);
});

const dateSchema = Joi.custom((value) => {
    if (value instanceof BigQueryTimestamp || value instanceof BigQueryDate || value instanceof BigQueryDate) {
        return dayjs(value.value).format('YYYY-MM-DD');
    }

    return null;
});

export const UserAttributesSchema = Joi.object({
    u_mb: Joi.string(),
    u_n: Joi.string(),
    u_em: Joi.string(),
    is_customer: Joi.boolean(),
    loyalty_point: numberSchema,
    loyalty_group: Joi.string(),
    expire_date_group: dateSchema,
    dob: dateSchema,
    redeem_amount: numberSchema,
    last_trandate: dateSchema,
    t_rev: numberSchema,
    frequency: numberSchema,
    last_rating_point: numberSchema,
    last_rating_date: dateSchema,
    moe_ip_city: Joi.string(),
    last_location_code: Joi.string(),
    first_medium: Joi.string(),
    moe_cr_from: Joi.string(),
    first_campaign_name: Joi.string(),
    last_engagement_date: dateSchema,
    last_engagement_place: Joi.string(),
    last_purchase_channel: Joi.string(),
});

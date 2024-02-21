import { Joi, timestamp } from '../../joi';
import { qb } from '../../bigquery.service';
import { createEventStream } from '../pipeline.utils';

export const getDeliverySuccessStream = createEventStream({
    qb: qb
        .withSchema('OP_CDP')
        .from('Moengage__DeliverySuccess')
        .select(['u_mb', 'user_name', 'order_type', 'date_delivery_success'])
        .whereRaw(
            `extract(date from date_delivery_success at time zone "Asia/Ho_Chi_Minh") = date_add(current_date("Asia/Ho_Chi_Minh"), interval -1 day)`,
        ),
    schema: Joi.object({
        u_mb: Joi.string(),
        user_name: Joi.string(),
        order_type: Joi.string(),
        date_delivery_success: timestamp,
    }),
    customerId: (row) => row.u_mb,
    actionsMeta: (row) => ({ action: 'DeliverySuccess - nonWebsite', current_time: row.date_delivery_success }),
});

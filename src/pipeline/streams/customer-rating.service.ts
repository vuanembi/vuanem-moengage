import { Joi, timestamp } from '../../joi';
import { qb } from '../../bigquery.service';
import { createEventStream } from '../pipeline.utils';

export const getCustomerRatingStream = createEventStream({
    qb: qb
        .withSchema('OP_CDP')
        .from('Moengage_CustomersRating')
        .select(['u_mb', 'u_n', 'u_id', 'create_date', 'rating_giaohang', 'rating_SO'])
        .whereRaw(`create_date = date_add(current_date("Asia/Ho_Chi_Minh"), interval -1 day)`),
    schema: Joi.object({
        u_mb: Joi.string(),
        u_n: Joi.string(),
        u_id: Joi.string(),
        create_date: timestamp,
        rating_giaohang: Joi.string(),
        rating_SO: Joi.string(),
    }),
    customerId: (row) => row.u_mb,
    actionsMeta: (row) => ({ action: 'CustomersRating', current_time: row.create_date }),
});

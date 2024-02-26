import { Joi, timestamp, number } from '../../joi';
import { qb } from '../../bigquery.service';
import { createEventStream } from '../pipeline.utils';

export const getPurchaseStream = createEventStream({
    qb: qb
        .withSchema('OP_CDP')
        .from('Moengage_Purchase_nonWebsite')
        .select([
            'category_name',
            'channel',
            'city_code',
            'class_code',
            'class_name',
            'create_hour',
            'item_amt',
            'item_qty',
            'ns_item_code',
            'ns_item_name',
            'store_code',
            'total_order_value',
            'trandate',
            'tranid',
            'u_mb',
        ])
        .whereRaw(
            `extract(date from trandate at time zone "Asia/Ho_Chi_Minh") = date_add(current_date("Asia/Ho_Chi_Minh"), interval -1 day)`,
        ),
    schema: Joi.object({
        category_name: Joi.string(),
        channel: Joi.string(),
        city_code: Joi.string(),
        class_code: Joi.string(),
        class_name: Joi.string(),
        create_hour: number,
        item_amt: number,
        item_qty: number,
        ns_item_code: number,
        ns_item_name: Joi.string(),
        store_code: Joi.string(),
        total_order_value: number,
        trandate: timestamp,
        tranid: Joi.string(),
        u_mb: Joi.string(),
    }),
    customerId: (row) => row.u_mb,
    actionsMeta: (row) => ({ action: 'Purchase_nonWebsite', current_time: row.trandate }),
});

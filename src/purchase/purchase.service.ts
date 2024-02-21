import { Joi, timestamp, number } from '../joi';
import { qb } from '../bigquery.service';
import { createEventStream } from '../pipeline/pipeline.utils';

export const getPurchaseStream = createEventStream({
    qb: qb
        .withSchema('OP_CDP')
        .from('Moengage_Purchase_nonWebsite')
        .select([
            'u_mb',
            'trandate',
            'channel',
            'tranid',
            'ns_item_code',
            'ns_item_name',
            'class_code',
            'class_name',
            'category_name',
            'store_code',
            'city_code',
            'item_qty',
            'item_amt',
            'total_order_value',
        ])
        .whereRaw(
            `extract(date from trandate at time zone "Asia/Ho_Chi_Minh") = date_add(current_date("Asia/Ho_Chi_Minh"), interval -1 day)`,
        ),
    schema: Joi.object({
        u_mb: Joi.string(),
        trandate: timestamp,
        channel: Joi.string(),
        tranid: Joi.string(),
        ns_item_code: number,
        ns_item_name: Joi.string(),
        class_code: Joi.string(),
        class_name: Joi.string(),
        category_name: Joi.string(),
        store_code: Joi.string(),
        city_code: Joi.string(),
        item_qty: number,
        item_amt: number,
        total_order_value: number,
    }),
    customerId: (row) => row.u_mb,
    actionsMeta: (row) => ({ action: 'Purchase_nonWebsite', current_time: row.trandate }),
});

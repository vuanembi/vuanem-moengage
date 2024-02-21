import { Transform } from 'node:stream';

import { createQueryStream, qb } from '../bigquery.service';
import { PurchaseSchema } from './purchase.dto';

export const getPurchaseStream = () => {
    const sql = qb
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
            `extract(date from trandate at time zone "Asia/Ho_Chi_Minh") = date_add(CURRENT_TIMESTAMP("Asia/Ho_Chi_Minh"), interval -1 day)`,
        );

    return createQueryStream(
        sql.toQuery(),
        new Transform({
            objectMode: true,
            transform: (row, _, callback) => {
                PurchaseSchema.validateAsync(row)
                    .then((value) =>
                        callback(null, {
                            type: 'event',
                            customer_id: value.u_mb,
                            actions: [
                                {
                                    action: 'Purchase_nonWebsite',
                                    current_time: value.trandate,
                                    attributes: value,
                                },
                            ],
                        }),
                    )
                    .catch((error) => callback(error));
            },
        }),
    );
};

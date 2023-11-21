import { Transform } from 'node:stream';

import { createQueryStream, qb } from '../bigquery.service';
import { DeliverySuccessEventSchema } from './delivery-success.dto';

export const getDeliverySuccessStream = () => {
    const sql = qb
        .withSchema('OP_CDP')
        .from('Moengage__DeliverySuccess')
        .select(['u_mb', 'user_name', 'order_type', 'date_delivery_success'])
        .whereRaw(
            `extract(date from date_delivery_success at time zone "Asia/Ho_Chi_Minh") = date_add(CURRENT_DATE("Asia/Ho_Chi_Minh"), interval -1 day)`,
        );

    return createQueryStream(sql.toQuery()).pipe(
        new Transform({
            objectMode: true,
            transform: (row, _, callback) => {
                DeliverySuccessEventSchema.validateAsync(row)
                    .then((value) =>
                        callback(null, {
                            type: 'event',
                            customer_id: value.u_mb,
                            actions: [
                                {
                                    action: 'DeliverySuccess - nonWebsite',
                                    current_time: value.date_delivery_success,
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

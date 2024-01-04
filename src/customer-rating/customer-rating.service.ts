import { Transform } from 'node:stream';

import { createQueryStream, qb } from '../bigquery.service';
import { CustomerRatingEventSchema } from './customer-rating.dto';

export const getCustomerRatingStream = () => {
    const sql = qb
        .withSchema('OP_CDP')
        .from('Moengage_CustomersRating')
        .select(['u_mb', 'u_n', 'u_id', 'create_date', 'rating_giaohang', 'rating_SO'])
        .whereRaw(`create_date = date_add(CURRENT_DATE(), interval -1 day)`);

    return createQueryStream(
        sql.toQuery(),
        new Transform({
            objectMode: true,
            transform: (row, _, callback) => {
                CustomerRatingEventSchema.validateAsync(row)
                    .then((value) =>
                        callback(null, {
                            type: 'event',
                            customer_id: value.u_mb,
                            actions: [
                                { action: 'CustomersRating', attributes: value, current_time: value.create_date },
                            ],
                        }),
                    )
                    .catch((error) => callback(error));
            },
        }),
    );
};

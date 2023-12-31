import { Transform } from 'node:stream';

import { createQueryStream, qb } from '../bigquery.service';
import { UserAttributesSchema } from './user-attribute.dto';
import { log } from 'winston';
import { logger } from '../logging.service';

export const getUserAttributesStream = () => {
    const sql = qb
        .withSchema('OP_CDP')
        .from('Moengage__UserAttribute')
        .select([
            'u_mb',
            'u_n',
            'u_id',
            'u_em',
            'is_customer',
            'loyalty_point',
            'loyalty_group',
            'expire_date_group',
            'dob',
            'redeem_amount',
            'last_trandate',
            't_rev',
            'frequency',
            'last_rating_point',
            'last_rating_date',
            'moe_ip_city',
            'last_location_code',
            'first_medium',
            'moe_cr_from',
            'first_campaign_name',
            'last_engagement_date',
            'last_engagement_place',
            'last_purchase_channel',
        ]);

    return createQueryStream(
        sql.toQuery(),
        new Transform({
            objectMode: true,
            transform: (row, _, callback) => {
                UserAttributesSchema.validateAsync(row)
                    .then((value) => callback(null, { type: 'customer', customer_id: value.u_mb, attributes: value }))
                    .catch((error) => callback(error));
            },
        }),
    );
};

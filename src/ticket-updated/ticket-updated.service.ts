import { Transform } from 'node:stream';

import { createQueryStream, qb } from '../bigquery.service';
import { TicketUpdatedEventSchema } from './ticket-updated.dto';

export const getTicketUpdatedStream = () => {
    const sql = qb
        .withSchema('OP_CDP')
        .from('Moengage_TicketStage')
        .select(['u_mb', 'ticket_id', 'created_at', 'updated_at', 'stage', 'ttcs', 'nhu_cau'])
        .whereRaw(`extract(date from updated_at) = date_add(CURRENT_DATE(), interval -1 day)`);

    return createQueryStream(
        sql.toQuery(),
        new Transform({
            objectMode: true,
            transform: (row, _, callback) => {
                TicketUpdatedEventSchema.validateAsync(row)
                    .then((value) =>
                        callback(null, {
                            type: 'event',
                            customer_id: value.u_mb,
                            actions: [{ action: 'Ticket_updated', attributes: value }],
                        }),
                    )
                    .catch((error) => callback(error));
            },
        }),
    );
};

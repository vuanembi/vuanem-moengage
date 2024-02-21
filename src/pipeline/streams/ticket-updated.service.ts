import { Joi, number, timestamp } from '../../joi';
import { qb } from '../../bigquery.service';
import { createEventStream } from '../pipeline.utils';

export const TicketUpdatedEventSchema = Joi.object({
    u_mb: Joi.string(),
    ticket_id: number,
    created_at: timestamp,
    updated_at: timestamp,
    ticket_type: Joi.string(),
    stage: Joi.string(),
    ttcs: Joi.string(),
    nhu_cau: Joi.string(),
});

export const getTicketUpdatedStream = createEventStream({
    qb: qb
        .withSchema('OP_CDP')
        .from('Moengage_TicketStage')
        .select([
            'u_mb',
            'ticket_id',
            qb.raw('timestamp_sub(created_at, interval 7 hour) as created_at'),
            qb.raw('timestamp_sub(updated_at, interval 7 hour) as updated_at'),
            'ticket_type',
            'stage',
            'ttcs',
            'nhu_cau',
        ])
        .whereRaw(
            `extract(date from updated_at at time zone "Asia/Ho_Chi_Minh") = date_add(current_date("Asia/Ho_Chi_Minh"), interval -1 day)`,
        ),
    schema: Joi.object({
        u_mb: Joi.string(),
        ticket_id: number,
        created_at: timestamp,
        updated_at: timestamp,
        ticket_type: Joi.string(),
        stage: Joi.string(),
        ttcs: Joi.string(),
        nhu_cau: Joi.string(),
    }),
    customerId: (row) => row.u_mb,
    actionsMeta: (row) => ({ action: 'Ticket_updated' }),
});

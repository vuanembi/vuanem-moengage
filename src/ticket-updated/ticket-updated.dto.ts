import { Joi, number, timestamp } from '../joi';

export const TicketUpdatedEventSchema = Joi.object({
    u_mb: Joi.string(),
    ticket_id: number,
    created_at: timestamp,
    updated_at: timestamp,
    stage: Joi.string(),
    ttcs: Joi.string(),
    nhu_cau: Joi.string(),
});

import { Joi, timestamp } from '../joi';

export const DeliverySuccessEventSchema = Joi.object({
    u_mb: Joi.string(),
    user_name: Joi.string(),
    order_type: Joi.string(),
    date_delivery_success: timestamp,
});

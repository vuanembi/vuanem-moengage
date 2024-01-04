import { Joi, date } from '../joi';

export const CustomerRatingEventSchema = Joi.object({
    u_mb: Joi.string(),
    u_n: Joi.string(),
    u_id: Joi.string(),
    create_date: date,
    rating_giaohang: Joi.string(),
    rating_SO: Joi.string(),
});

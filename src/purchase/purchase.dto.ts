import { Joi, timestamp, number } from '../joi';

export const PurchaseSchema = Joi.object({
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
});

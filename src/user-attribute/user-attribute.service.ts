import { createQueryStream, qb } from '../bigquery.service';

export const getUserAttributesStream = () => {
    const sql = qb
        .withSchema('OP_CDP')
        .from('Moengage__UserAttribute')
        .select([
            'phone',
            'user_name',
            'email',
            'is_customer',
            'loyalty_point',
            'loyalty_group',
            'expire_date_group',
            'dob',
            'redeem_amount',
            'last_trandate',
            'clv',
            'frequency',
            'last_rating_point',
            'last_rating_date',
            'last_city',
            'last_location_code',
            'first_medium',
            'first_source',
            'first_campaign_name',
            'last_engagement_date',
            'last_engagement_place',
            'last_purchase_channel',
        ]);

    return createQueryStream(sql.toQuery());
};

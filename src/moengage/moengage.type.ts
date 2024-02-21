export type CustomerElement = {
    type: 'customer';
    customer_id: string;
    attributes: object;
};

export type EventElement = {
    type: 'event';
    customer_id: string;
    actions: object[];
};

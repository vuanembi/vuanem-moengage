import { Readable } from 'node:stream';
import { CustomerElement, EventElement } from './moengage.type';

type BuildCustomerElementConfig = {
    customerId: (row: Record<string, any>) => string;
};
export const buildCustomerElement = ({ customerId }: BuildCustomerElementConfig) => {
    return async function* (rows: Readable) {
        for await (const row of rows) {
            yield {
                type: 'customer',
                customer_id: customerId(row),
                attributes: row,
            } as CustomerElement;
        }
    };
};

type BuildEventElementConfig = BuildCustomerElementConfig & {
    actionMeta: (row: Record<string, any>) => { action: string } & { [key: string]: any };
};
export const buildEventElement = ({ customerId, actionMeta }: BuildEventElementConfig) => {
    return async function* (rows: Readable) {
        for await (const row of rows) {
            yield {
                type: 'event',
                customer_id: customerId(row),
                actions: [{ ...actionMeta(row), attributes: row }],
            } as EventElement;
        }
    };
};

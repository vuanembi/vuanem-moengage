import { Transform } from 'node:stream';
import { Knex } from 'knex';
import Joi from 'joi';

import { logger } from '../logging.service';
import { createQueryStream } from '../bigquery.service';
import { UserElement, EventElement } from '../moengage/moengage.service';

type CreateDataStreamOptions = {
    qb: Knex.QueryBuilder;
    schema: Joi.Schema;
};

export const createDataStream = <T extends CreateDataStreamOptions>(builder: (config: T) => Transform) => {
    return (config: T) => {
        return () => {
            const read = createQueryStream(config.qb.toQuery());
            const validationTransform = new Transform({
                objectMode: true,
                transform: (row, _, callback) => {
                    const { value, error } = config.schema.validate(row);
                    callback(error, value);
                },
            });

            const stream = read.pipe(validationTransform).pipe(builder(config));
            read.on('error', (error) => {
                logger.error({ error });
                stream.emit('error');
            });
            return stream;
        };
    };
};

export type CreateUserStreamConfig = CreateDataStreamOptions & {
    customerId: (row: any) => string;
};

export const createUserStream = createDataStream<CreateUserStreamConfig>(({ customerId }) => {
    return new Transform({
        objectMode: true,
        transform: (row, _, callback) => {
            callback(null, {
                type: 'customer',
                customer_id: customerId(row),
                attributes: row,
            } as UserElement);
        },
    });
});

export type CreateEventStreamConfig = CreateUserStreamConfig & {
    actionsMeta: (row: any) => object;
};

export const createEventStream = createDataStream<CreateEventStreamConfig>((config) => {
    const { customerId, actionsMeta } = config;
    return new Transform({
        objectMode: true,
        transform: (row, _, callback) => {
            callback(null, {
                type: 'event',
                customer_id: customerId(row),
                actions: [{ ...actionsMeta(row), attributes: row }],
            } as EventElement);
        },
    });
});

import { Transform } from 'node:stream';
import { BigQuery } from '@google-cloud/bigquery';
import knex from 'knex';
import { logger } from './logging.service';

const client = new BigQuery();

export const qb = knex({ client: 'mysql' });

export const createQueryStream = (query: string, transformStream: Transform) => {
    const queryStream = client.createQueryStream({ query, wrapIntegers: false, jobTimeoutMs: 60_000 });
    const stream = queryStream.pipe(transformStream);

    queryStream.on('error', (error) => {
        logger.error({ error });
        stream.emit('error', error);
    });

    return stream;
};

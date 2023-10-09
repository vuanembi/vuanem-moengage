import { BigQuery } from '@google-cloud/bigquery';
import knex from 'knex';

const client = new BigQuery();

export const qb = knex({ client: 'mysql' });

export const createQueryStream = (query: string) => {
    return client.createQueryStream({ query, wrapIntegers: false });
};

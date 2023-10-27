import { Transform, Writable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import BatchStream from 'batch-stream';
import parallelTransform from 'parallel-transform';

import { logger } from '../logging.service';
import { getUserAttributesStream } from '../user-attribute/user-attribute.service';
import { getClient, bulkImport } from '../moengage/moengage.service';
import { UserAttributesSchema } from './pipeline.dto';

export const syncUserAttributes = async () => {
    let count = 0;

    const extractStream = getUserAttributesStream();

    const parseStream = new Transform({
        objectMode: true,
        transform: (row, _, callback) => {
            const { value, error } = UserAttributesSchema.validate(row);
            error ? callback(error) : callback(null, { type: 'customer', customer_id: value.u_mb, attributes: value });
        },
    });

    const client = await getClient();

    const importStream = parallelTransform(50, { ordered: false }, (elements, callback) => {
        bulkImport(client, elements)
            .then(() => {
                count = count + elements.length;
                logger.info({ fn: 'syncUserAttributes', count });
                callback();
            })
            .catch((error) => callback(error));
    });

    return pipeline(
        extractStream,
        parseStream,
        new BatchStream({ size: 200 }),
        importStream,
        new Writable({ objectMode: true, write: (_, __, callback) => callback() }),
    ).then(() => true);
};

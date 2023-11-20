import { Writable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import BatchStream from 'batch-stream';
import parallelTransform from 'parallel-transform';
import mergeStream from 'merge-stream';

import { logger } from '../logging.service';
import { getUserAttributesStream } from '../user-attribute/user-attribute.service';
import { getDeliverySuccessStream } from '../delivery-success/delivery-success.service';
import { getClient, bulkImport } from '../moengage/moengage.service';

export const sync = async () => {
    let count = 0;

    const client = await getClient();

    const importStream = parallelTransform(50, { ordered: false }, (elements, callback) => {
        bulkImport(client, elements)
            .then(() => {
                count = count + elements.length;
                logger.info({ fn: 'sync', count });
                callback();
            })
            .catch((error) => callback(error));
    });

    return pipeline(
        mergeStream(getUserAttributesStream(), getDeliverySuccessStream()),
        new BatchStream({ size: 200 }),
        importStream,
        new Writable({ objectMode: true, write: (_, __, callback) => callback() }),
    ).then(() => true);
};

import { pipeline } from 'node:stream/promises';
import BatchStream from 'batch-stream';
import parallelTransform from 'parallel-transform';
import mergeStream from 'merge-stream';
import PQueue from 'p-queue';

import { logger } from '../logging.service';
import { getUserAttributesStream } from './streams/user-attribute.service';
import { getCustomerRatingStream } from './streams/customer-rating.service';
import { getDeliverySuccessStream } from './streams/delivery-success.service';
import { getPurchaseStream } from './streams/purchase.service';
import { getTicketUpdatedStream } from './streams/ticket-updated.service';
import { bulkImport } from '../moengage/moengage.service';

export const sync = async () => {
    return await pipeline(
        mergeStream(
            getUserAttributesStream(),
            getDeliverySuccessStream(),
            getPurchaseStream(),
            getTicketUpdatedStream(),
            getCustomerRatingStream(),
        ),
        new BatchStream({ size: 100 }),
        async function (rows) {
            let total = 0;
            const queue = new PQueue();
            for await (const row of rows) {
                total = total + row.length;
                queue.add(() => bulkImport(row).then(() => logger.debug(`Bulk import ${total}`)));
            }
            await queue.onIdle();
        },
    ).then(() => true);
};

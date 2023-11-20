import { Transform } from 'node:stream';

import { getDeliverySuccessStream } from './delivery-success.service';
import { DeliverySuccessEventSchema } from './delivery-success.dto';

it('getDeliverySuccess', (done) => {
    const transform = new Transform({
        objectMode: true,
        transform: (row, _, callback) => {
            DeliverySuccessEventSchema.validateAsync(row)
                .then((value) => callback(null, value))
                .catch((error) => {
                    callback(error);
                });
        },
    });
    const stream = getDeliverySuccessStream().pipe(transform);
    stream.on('data', (data) => {
        expect(data).toBeDefined();
    });
    stream.on('error', (error) => {
        console.error(error);
        done(error);
    });
    stream.on('finish', () => done());
}, 100_000_000);

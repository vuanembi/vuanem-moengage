import { Transform } from 'node:stream';

import { getUserAttributesStream } from './user-attribute.service';
import { UserAttributesSchema } from './user-attribute.dto';

it('getUserAttributes', (done) => {
    const transform = new Transform({
        objectMode: true,
        transform: (row, _, callback) => {
            UserAttributesSchema.validateAsync(row)
                .then((value) => callback(null, value))
                .catch((error) => {
                    callback(error);
                });
        },
    });
    const stream = getUserAttributesStream().pipe(transform);
    stream.on('data', (data) => {
        expect(data).toBeDefined();
    });
    stream.on('error', (error) => {
        console.error(error);
        done(error);
    });
    stream.on('finish', () => done());
}, 100_000_000);

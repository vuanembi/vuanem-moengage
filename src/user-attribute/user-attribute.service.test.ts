import { getUserAttributesStream } from './user-attribute.service';

it('getUserAttributesStream', (done) => {
    const stream = getUserAttributesStream();
    stream.on('data', (data) => {
        expect(data).toBeDefined();
    });
    stream.on('error', (error) => {
        console.error(error);
        done(error);
    });
    stream.on('finish', () => done());
}, 100_000_000);

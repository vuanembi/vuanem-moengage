import { getPurchaseStream } from './purchase.service';

it('getPurchase', (done) => {
    const stream = getPurchaseStream();
    stream.on('data', (data) => {
        expect(data).toBeDefined();
    });
    stream.on('error', (error) => {
        console.error(error);
        done(error);
    });
    stream.on('finish', () => done());
}, 100_000_000);

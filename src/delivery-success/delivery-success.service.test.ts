import { getDeliverySuccessStream } from './delivery-success.service';

it('getDeliverySuccess', (done) => {
    const [extract, parse] = getDeliverySuccessStream();
    const stream = extract.pipe(parse);
    stream.on('data', (data) => {
        expect(data).toBeDefined();
    });
    stream.on('error', (error) => {
        console.error(error);
        done(error);
    });
    stream.on('finish', () => done());
}, 100_000_000);

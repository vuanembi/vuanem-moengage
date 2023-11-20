import { getDeliverySuccessStream } from './delivery-success.service';

it('getDeliverySuccess', (done) => {
    const stream = getDeliverySuccessStream();
    stream.on('data', (data) => {
        expect(data).toBeDefined();
    });
    stream.on('error', (error) => {
        console.error(error);
        done(error);
    });
    stream.on('finish', () => done());
}, 100_000_000);

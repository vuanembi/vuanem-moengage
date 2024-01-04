import { getCustomerRatingStream } from './customer-rating.service';

it('getCustomerRating', (done) => {
    const stream = getCustomerRatingStream();
    stream.on('data', (data) => {
        expect(data).toBeDefined();
    });
    stream.on('error', (error) => {
        console.error(error);
        done(error);
    });
    stream.on('finish', () => done());
}, 100_000_000);

import { Transform } from 'node:stream';

import { getUserAttributesStream } from './user-attribute.service';
import { getCustomerRatingStream } from './customer-rating.service';
import { getDeliverySuccessStream } from './delivery-success.service';
import { getPurchaseStream } from './purchase.service';
import { getTicketUpdatedStream } from './ticket-updated.service';

describe('streams', () => {
    const test = (stream: Transform, done: jest.DoneCallback) => {
        stream.on('data', (data) => {
            expect(data).toBeDefined();
        });
        stream.on('error', (error) => {
            console.error(error);
            done(error);
        });
        stream.on('finish', () => done());
    };

    it('getUserAttributesStream', (done) => {
        test(getUserAttributesStream(), done);
    });
    it('getCustomerRatingStream', (done) => {
        test(getCustomerRatingStream(), done);
    });
    it('getDeliverySuccessStream', (done) => {
        test(getDeliverySuccessStream(), done);
    });
    it('getPurchaseStream', (done) => {
        test(getPurchaseStream(), done);
    });
    it('getTicketUpdatedStream', (done) => {
        test(getTicketUpdatedStream(), done);
    });
});

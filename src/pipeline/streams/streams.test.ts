import { getUserAttributesStream } from './user-attribute.service';
import { getCustomerRatingStream } from './customer-rating.service';
import { getDeliverySuccessStream } from './delivery-success.service';
import { getPurchaseStream } from './purchase.service';
import { getTicketUpdatedStream } from './ticket-updated.service';

describe('streams', () => {
    const test = (stream: NodeJS.ReadWriteStream, done: jest.DoneCallback) => {
        stream.once('data', (data) => {
            stream.end();
            expect(data).toBeDefined();
            done();
        });
        stream.once('error', (error) => {
            stream.end();
            done(error);
        });
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

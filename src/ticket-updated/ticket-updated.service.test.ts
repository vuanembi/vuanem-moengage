import { getTicketUpdatedStream } from './ticket-updated.service';

it('getTicketUpdated', (done) => {
    const stream = getTicketUpdatedStream();
    stream.on('data', (data) => {
        expect(data).toBeDefined();
    });
    stream.on('error', (error) => {
        console.error(error);
        done(error);
    });
    stream.on('finish', () => done());
}, 100_000_000);

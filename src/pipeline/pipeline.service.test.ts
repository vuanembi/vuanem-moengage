import { sync } from './pipeline.service';

it('sync', async () => {
    return sync()
        .then((result) => expect(result).toBeDefined())
        .catch((error) => {
            console.error(error);
            throw error;
        });
}, 100_000_000);

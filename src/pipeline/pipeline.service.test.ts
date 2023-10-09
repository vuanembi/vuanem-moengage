import { syncUserAttributes } from './pipeline.service';

it('syncUserAttributes', async () => {
    return syncUserAttributes()
        .then((result) => expect(result).toBeDefined())
        .catch((error) => {
            console.error(error);
            throw error;
        });
}, 100_000_000);

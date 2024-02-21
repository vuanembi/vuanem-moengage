import { getLogger } from '../logging.service';
import { sync } from './pipeline.service';

const logger = getLogger(__filename);

it('sync', async () => {
    return sync()
        .then((result) => expect(result).toBeDefined())
        .catch((error) => {
            logger.error({ error });
            throw error;
        });
}, 100_000_000);

import { logger } from './logging.service';

import { syncUserAttributes } from './pipeline/pipeline.service';

process.on('uncaughtException', () => {
    logger.error({ action: 'uncaught-exception' });
    process.exit(1);
});

process.on('SIGINT', () => {
    logger.info({ action: 'interupt' });
    process.exit(0);
});

(async () => {
    logger.info({ fn: 'index', details: 'start' });
    await syncUserAttributes()
        .then(() => logger.info({ fn: 'index', details: 'success' }))
        .catch((error) => {
            console.log(error);
            logger.error({ fn: 'index', error });
        });
})();

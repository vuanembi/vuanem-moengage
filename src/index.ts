import { getLogger } from './logging.service';
import { sync } from './pipeline/pipeline.service';

const logger = getLogger(__filename);

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', error);
    process.exit(1);
});

process.on('SIGINT', () => {
    logger.info('Interrupted');
    process.exit(0);
});

(async () => {
    logger.info('Starting sync');
    await sync()
        .then(() => {
            logger.info('Done');
            process.exit(0);
        })
        .catch((error) => {
            logger.error('Error', { error });
            process.exit(1);
        });
})();

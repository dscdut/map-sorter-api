import { PostgresDataSource } from './config';
import { ProjectLogger } from '@core/loggers';

export class DatabaseService {
  async migrateData() {
    const logger = new ProjectLogger('Migration');
    await PostgresDataSource.initialize();

    logger.info('Running migrations');
    const migrations = await PostgresDataSource.runMigrations({
      transaction: 'all',
    });

    if (migrations.length > 0) {
      migrations.forEach((migration) => {
        logger.info(`${migration.name} has been executed`);
      });
    } else {
      logger.info('No migration has been executed');
    }

    await PostgresDataSource.destroy();
    logger.info('Migrations have been completed');
  }
}

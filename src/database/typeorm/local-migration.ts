import { DatabaseService } from './database.service';

const execute = async () => {
  const databaseService = new DatabaseService();
  await Promise.all([databaseService.migrateData()]);
};

execute();

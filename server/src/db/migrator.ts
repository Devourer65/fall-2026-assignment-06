import { db } from './db.js';
import { Migrator } from 'kysely/migration';
import * as migration01 from './migrations/0001_initial_schema.js';
import * as migration02 from './migrations/0002_add_comments.js';

async function migrateToLatest() {
  const migrator = new Migrator({
    db,
    provider: {
      async getMigrations() {
        return {
          '01_initial': migration01,
          '02_add_comments': migration02,
        };
      },
    },
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error('failed to migrate');
    console.error(error);
    process.exit(1);
  }
}

await migrateToLatest();
await db.destroy();
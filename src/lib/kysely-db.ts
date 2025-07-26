import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { DB_CONFIG } from './db'; // Your existing DB config file
import { Database } from '@/types/database';

const kysely = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: DB_CONFIG.DB_HOST,
      port: DB_CONFIG.DB_PORT,
      user: DB_CONFIG.DB_USER,
      password: DB_CONFIG.DB_PASSWORD,
      database: DB_CONFIG.DB_NAME,
    }),
  }),
});

export default kysely;

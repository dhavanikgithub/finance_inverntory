import { Kysely, PostgresDialect } from 'kysely';
import pool from './db'; // Your existing DB config file
import { Database } from '@/types/database';

const kysely = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool,
  }),
});

export default kysely;

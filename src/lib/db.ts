import { Pool } from 'pg';
import { getSchema } from './config';

const DB_CONFIG = {
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: Number(process.env.DB_PORT), // Default PostgreSQL port
}


// PostgreSQL connection details
export const pool = new Pool({
  user: DB_CONFIG.DB_USER, // Change with your PostgreSQL username
  host: DB_CONFIG.DB_HOST, // Change if needed
  database: DB_CONFIG.DB_NAME, // Your database name
  password: DB_CONFIG.DB_PASSWORD, // Your database password
  port: DB_CONFIG.DB_PORT, // PostgreSQL default port
});

// Set search_path when pool connects
pool.on('connect', (client) => {
  client.query(`SET search_path TO ${getSchema()};`);
  console.log(`Database Schema: ${getSchema()}`)
});
// Function to query the database
const query = async (text: string, params?: any[]) => {
  const res = await pool.query(text, params);
  return res;
};

export default pool;
export { DB_CONFIG, query };

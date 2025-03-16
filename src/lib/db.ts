import { Pool } from 'pg';

// PostgreSQL connection details
const pool = new Pool({
  user: process.env.DB_USER, // Change with your PostgreSQL username
  host: process.env.DB_HOST, // Change if needed
  database: process.env.DB_NAME, // Your database name
  password: process.env.DB_PASSWORD, // Your database password
  port: Number(process.env.DB_PORT), // PostgreSQL default port
});

// Function to query the database
export const query = async (text: string, params?: any[]) => {
  const res = await pool.query(text, params);
  return res;
};

export default pool;

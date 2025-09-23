import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test connection function
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    const result = await client.query('SELECT NOW()');
    console.log('🕒 Database time:', result.rows[0].now);
    client.release();
    return { success: true, message: 'Database connected successfully' };
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return { success: false, message: error.message };
  }
};

export default pool;

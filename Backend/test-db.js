// test-db.js - Simple database connection test
import pkg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file with explicit path
dotenv.config({ path: join(__dirname, '.env') });

const { Pool } = pkg;

console.log('Environment variables:');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '[HIDDEN]' : 'MISSING');
console.log('DB_PORT:', process.env.DB_PORT);

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'HRMS',
  password: String(process.env.DB_PASSWORD || 'Koushik@123'),
  port: parseInt(process.env.DB_PORT) || 5432,
});

async function testConnection() {
  try {
    console.log('\n🔄 Testing database connection...');
    const client = await pool.connect();
    console.log('✅ Database connected successfully!');
    
    const result = await client.query('SELECT NOW() as current_time, version() as db_version');
    console.log('🕒 Database time:', result.rows[0].current_time);
    console.log('📊 PostgreSQL version:', result.rows[0].db_version);
    
    client.release();
    await pool.end();
    
    console.log('✅ Connection test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testConnection();
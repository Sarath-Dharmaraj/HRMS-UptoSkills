import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'hrms_db',
  password: 'Koushik@123',
  port: 5432,
});

export default pool;

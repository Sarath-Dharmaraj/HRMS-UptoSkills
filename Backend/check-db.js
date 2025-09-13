import pool from './config/database.js';

console.log('Testing database connection...');

try {
  const result = await pool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'events' 
    ORDER BY ordinal_position
  `);
  
  console.log('✅ Database connected successfully!');
  console.log('Table "events" columns:');
  result.rows.forEach(row => {
    console.log(`- ${row.column_name} (${row.data_type})`);
  });
  
} catch (err) {
  console.error('❌ Database error:', err.message);
} finally {
  await pool.end();
  console.log('Connection closed.');
}

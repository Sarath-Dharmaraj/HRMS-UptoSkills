import pool from './config/database.js';

async function checkSchema() {
  try {
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'events' 
      ORDER BY ordinal_position
    `);
    
    console.log('✅ Events table schema:');
    result.rows.forEach(row => {
      console.log(`- ${row.column_name} (${row.data_type}) ${row.is_nullable === 'NO' ? 'NOT NULL' : 'NULLABLE'} ${row.column_default ? `DEFAULT ${row.column_default}` : ''}`);
    });
    
    // Check if table exists
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'events'
      );
    `);
    
    console.log(`\nTable exists: ${tableExists.rows[0].exists}`);
    
  } catch (err) {
    console.error('❌ Database error:', err.message);
  } finally {
    await pool.end();
    console.log('\nConnection closed.');
  }
}

checkSchema();
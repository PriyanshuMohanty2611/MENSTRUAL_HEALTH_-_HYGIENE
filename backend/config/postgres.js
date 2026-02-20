const { Pool } = require('pg');

const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'menstrual_cycle',
  password: 'admin',
  port: 5432,
});

const connectPostgres = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('✓ PostgreSQL connected successfully');
    
    // Create the menstrual_cycle table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS menstrual_cycle (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE,
        flow_intensity VARCHAR(50),
        symptoms TEXT[],
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table "menstrual_cycle" ensured in PostgreSQL');
  } catch (err) {
    console.error('✗ PostgreSQL connection failed:', err.message);
    // Not exiting process as Mongo is still primary
  }
};

module.exports = {
  pool,
  connectPostgres,
};

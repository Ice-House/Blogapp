import { Pool } from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get current file path in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from staging
dotenv.config({ 
  path: resolve(__dirname, '../server/.env.staging')
});

async function verifyRailwayConnection() {
  // Configure pool with explicit SSL settings
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    const client = await pool.connect();
    console.log('✅ Connected to Railway PostgreSQL');
    
    // Test basic query
    const result = await client.query('SELECT NOW()');
    console.log('Connection time:', result.rows[0].now);
    
    // Test tables exist
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('📋 Available tables:', tables.rows.map(r => r.table_name));

    client.release();
  } catch (error) {
    console.error('❌ Connection failed:', error);
    // Log detailed error for debugging
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
  } finally {
    await pool.end();
  }
}

verifyRailwayConnection();
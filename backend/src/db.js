import pkg from 'pg';
const { Pool, types } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const DECIMAL_OID = 1700;

// Override the parser for DECIMAL to return a JavaScript number
types.setTypeParser(DECIMAL_OID, (value) => parseFloat(value));

// PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL , // Connection string
    ssl: {
      rejectUnauthorized: false // Accept self-signed certificates
    }
  });

export default pool;
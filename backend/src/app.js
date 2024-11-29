import express from 'express';
import pkg from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const { Pool } = pkg; // Destructure from the default export

// Initialize Express
const app = express();
const port = 3000;

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL , // Connection string
  ssl: {
    rejectUnauthorized: false // Accept self-signed certificates
  }
});

// Route handler
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT version();');
    res.status(200).send(result.rows[0].version);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

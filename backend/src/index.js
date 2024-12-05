import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pool from './db.js';
import morgan from 'morgan';

// Load environment variables
dotenv.config();


// Initialize Express
const app = express();
const port = 3000;



// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const dbConnection = (req, res, next) => {
  req.pool = pool;
  next();
};

// Import the API router
import apiRouter from './routes/api.route.js';

// Mount the API router under `/api`

app.get('/', dbConnection, async (req, res) => {
  try {
    const result = await req.pool.query('SELECT version();');
    res.status(200).send(result.rows[0].version);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.use('/api', dbConnection, apiRouter);


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

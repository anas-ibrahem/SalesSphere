import fs from 'fs/promises';
import pool from './db.js';
import { faker } from '@faker-js/faker';
import bcypt from 'bcryptjs';

// Reset the database schema and seed random data
var testaccount = {
    email: 'samy@t.com',
    password: 'amr123',
}
async function resetDatabase() {
    try {
        // Read the schema file
        const schemaSQL = await fs.readFile('schema/edited_main.sql', 'utf8');

        // Execute the schema commands
        console.log('Running schema...');
        await pool.query(schemaSQL);

        console.log('Database schema reset successfully!');

        // Optional: Seed random data
        console.log('Seeding random data...');
        await seedData();
        console.log('Random data seeded successfully!');
    } catch (err) {
        console.error('Error resetting database:', err.message);
    } finally {
        await pool.end();
    }
}

async function seedData() {

    // push test admin account
    // same password as test account
    const hashed_password = await bcypt.hash(testaccount.password, 10);

    await pool.query(`
        INSERT INTO ADMIN (username, email, hashed_password, privilege)
        VALUES ($1, $2, $3, $4)
    `, ['admin', testaccount.email, hashed_password, 1]);

    console.log('Test account seeded');

}

// Run the reset script
seedData();

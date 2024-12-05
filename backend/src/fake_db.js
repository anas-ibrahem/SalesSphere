import fs from 'fs/promises';
import pool from './db.js';
import { faker } from '@faker-js/faker';

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
    // Generate random data
    // Business table
    const business = [];
    for (let i = 0; i < 5; i++) {
        business.push({
            name: faker.company.name(),
            street: faker.location.street(),
            phone_number: faker.phone.number(),
            email: faker.internet.email(),
            website_url: faker.internet.url(),
            industry: faker.company.buzzNoun(),
            registration_date: faker.date.past(),
            city: faker.location.city(),
            country: faker.location.country(),
            //description: faker.lorem.paragraph(), // maybe later
        });
    }
    // push to db
    for (const b of business) {
        await pool.query(`
            INSERT INTO business (name, street, phone_number, email, website_url, industry, registration_date, city, country)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [b.name, b.street, b.phone_number, b.email, b.website_url, b.industry, b.registration_date, b.city, b.country]);
    }
    console.log('Business table seeded');
    // Employee table
    // role, account_creation_date, hashed_password, business_id
    const employee = [];
    const roles = ['manager', 'deal opener', 'deal executer'];
    for (let i = 0; i < 5; i++) {
        employee.push({
            role: roles[faker.number.int({min: 0, max: roles.length - 1})],
            account_creation_date: faker.date.past(),
            hashed_password: faker.internet.password(),
            business_id: faker.number.int({min: 1, max: 5}),
        });
    }
    // push to db
    for (const e of employee) {
        await pool.query(`
            INSERT INTO employee (role, account_creation_date, hashed_password, business_id)
            VALUES ($1, $2, $3, $4)
        `, [e.role, e.account_creation_date, e.hashed_password, e.business_id]);
    }
    console.log('Employee table seeded');
    // Employee profile table
    // employee_id, first_name, last_name, birth_date, phone_number, email, profile_picture_url, address, hire_date, employee_id
    const employee_profile = [];
    for (let i = 0; i < 5; i++) {
        employee_profile.push({
            employee_id: faker.number.int({min: 1, max: 5}),
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            birth_date: faker.date.past(),
            phone_number: faker.phone.number(),
            email: faker.internet.email(),
            profile_picture_url: faker.image.url(),
            address: faker.location.streetAddress(),
            hire_date: faker.date.past(),
        });
    }
    // push to db
    for (const ep of employee_profile) {
        await pool.query(`
            INSERT INTO employee_profile (employee_id, first_name, last_name, birth_date, phone_number, email, profile_picture_url, address, hire_date)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [ep.employee_id, ep.first_name, ep.last_name, ep.birth_date, ep.phone_number, ep.email, ep.profile_picture_url, ep.address, ep.hire_date]);
    }
    console.log('Employee profile table seeded');
    // Customer table
    // business_id, name, phone_number, email, address, registration_date, type, lead_source, preferred_contact_method, added_by 
    const customer = [];
    for (let i = 0; i < 5; i++) {
        customer.push({
            business_id: faker.number.int({min: 1, max: 5}),
            name: faker.company.name(),
            phone_number: faker.phone.number(),
            email: faker.internet.email(),
            address: faker.location.streetAddress(),
            registration_date: faker.date.past(),
            type: faker.company.buzzNoun(),
            lead_source: faker.company.buzzNoun(),
            preferred_contact_method: faker.number.int({min: 0, max: 1}),
            added_by: faker.number.int({min: 1, max: 5}),
        });
    }
    // push to db
    for (const c of customer) {
        await pool.query(`
            INSERT INTO customer (business_id, name, phone_number, email, address, registration_date, type, lead_source, preferred_contact_method, added_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [c.business_id, c.name, c.phone_number, c.email, c.address, c.registration_date, c.type, c.lead_source, c.preferred_contact_method, c.added_by]);
    }
    console.log('Customer table seeded');
}

// Run the reset script
resetDatabase();

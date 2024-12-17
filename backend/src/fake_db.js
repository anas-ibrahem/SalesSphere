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
            managerid_card_url: faker.image.url(),
            manager_personal_photo_url: faker.image.url(),
            business_logo_url: faker.image.url(),
            //description: faker.lorem.paragraph(), // maybe later
        });
    }
    // push to db
    let last_business_id = 0;
    for (const b of business) {
        const q = await pool.query(`
            INSERT INTO business (name, street, phone_number, email, website_url, industry, registration_date, city, country, managerid_card_url, manager_personal_photo_url, business_logo_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING id
        `, [b.name, b.street, b.phone_number, b.email, b.website_url, b.industry, b.registration_date, b.city, b.country, b.managerid_card_url, b.manager_personal_photo_url, b.business_logo_url]);
        last_business_id = q.rows[0].id;
    }
    console.log('Business table seeded');
    // Employee table
    // role, account_creation_date, hashed_password, business_id
    const employee = [];
    for (let i = 0; i < 5; i++) {
        employee.push({
            role: faker.number.int({min: 0, max: 2}),
            email: faker.internet.email(),
            account_creation_date: faker.date.past(),
            hashed_password: faker.internet.password(),
            business_id: faker.number.int({min: last_business_id-4, max: last_business_id}),
            verified: faker.number.int({min: 0, max: 2}),
        });
    }
    // push to db
    let last_id = 0;
    for (const e of employee) {
        const q = await pool.query(`
            INSERT INTO employee (role, email, account_creation_date, hashed_password, business_id, verified)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `, [e.role, e.email, e.account_creation_date, e.hashed_password, e.business_id, e.verified]);
        last_id = q.rows[0].id;
    }
    console.log('Employee table seeded');
    // Employee profile table
    // employee_id, first_name, last_name, birth_date, phone_number, email, profile_picture_url, address, hire_date, employee_id
    const employee_profile = [];
    for (let i = last_id; i < last_id + 5; i++) {
        employee_profile.push({
            employee_id: i - 4,
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            birth_date: faker.date.past(),
            phone_number: faker.phone.number(),
            profile_picture_url: faker.image.url(),
            address: faker.location.streetAddress(),
            hire_date: faker.date.past(),
        });
    }
    // push to db
    for (const ep of employee_profile) {
        await pool.query(`
            INSERT INTO employee_profile (employee_id, first_name, last_name, birth_date, phone_number, profile_picture_url, address, hire_date)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [ep.employee_id, ep.first_name, ep.last_name, ep.birth_date, ep.phone_number, ep.profile_picture_url, ep.address, ep.hire_date]);
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
            type: faker.number.int({min: 0, max: 1}),
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

    // deal table
    // customer_id, deal_opener, title, status, date_opened, due_date, expenses, customer_budget
    // status: open, closed, lost, won, claimed
    const deals = [];
    //const statuses = ['open', 'closed', 'lost', 'won', 'claimed'];
    for (let i = 0; i < 5; i++) {
        deals.push({
            customer_id: faker.number.int({min: 1, max: 5}),
            deal_opener: faker.number.int({min: 1, max: 5}),
            title: faker.company.catchPhrase(),
            status: faker.number.int({min: 1, max: 3}),
            date_opened: faker.date.past(),
            due_date: faker.date.future(),
            expenses: faker.finance.amount(),
            customer_budget: faker.finance.amount(),
        });
    }
    // push to db
    for (const d of deals) {
        await pool.query(`
            INSERT INTO DEAL (customer_id, deal_opener, title, status, date_opened, due_date, expenses, customer_budget)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [d.customer_id, d.deal_opener, d.title, d.status, d.date_opened, d.due_date, d.expenses, d.customer_budget]);
    }
    console.log('Deal table seeded');

    // push test account
    const hashed_password = await bcypt.hash(testaccount.password, 10);
    await pool.query(`
        INSERT INTO employee (role, email, account_creation_date, hashed_password, business_id, verified)
        VALUES ($1, $2, $3, $4, $5, $6)
    `, [2, testaccount.email, faker.date.past(), hashed_password, last_business_id, 1]);
    await pool.query(`
        INSERT INTO employee_profile (employee_id, first_name, last_name, birth_date, phone_number, profile_picture_url, address, hire_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [last_id + 1, 'Amr', 'Samy', faker.date.past(), faker.phone.number(), faker.image.url(), faker.location.streetAddress(), faker.date.past()]);

    // push test admin account
    // same password as test account
    await pool.query(`
        INSERT INTO ADMIN (username, email, hashed_password, privilege)
        VALUES ($1, $2, $3, $4)
    `, ['admin', testaccount.email, hashed_password, 1]);

    console.log('Test account seeded');

}

// Run the reset script
resetDatabase();

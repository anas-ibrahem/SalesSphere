//import EmployeeModel from "./employee.model";

class BusinessModel {
    constructor({id, name, registration_date, phone_number, email, city, country, street, website_url, industry, business_logo_url, managerid_card_url, manager_personal_photo_url}, business_manager) {
        this.id = id;
        this.business_manager = business_manager;
        this.name = name;
        this.registration_date = registration_date;
        this.phone_number = phone_number;
        this.email = email;
        this.city = city;
        this.country = country;
        this.street = street;
        this.website_url = website_url;
        this.industry = industry;
        this.business_logo_url = business_logo_url;
        this.managerid_card_url = managerid_card_url;
        this.manager_personal_photo_url = manager_personal_photo_url;
    }

    getAll = async (pool) => {
        try {
            const result = await pool.query(`
                SELECT *
                FROM BUSINESS;
            `);
            return result;
        }
        catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    }

    getById = async (pool, id) => {
        try {
            const result = await pool.query(`
                SELECT *
                FROM BUSINESS WHERE id = $1;
            `, [id]);

            if(result.rows.length === 0) {
                return {error: 'Business not found'};
            }

            const results = result.rows[0];
            return results;

        }
        catch (error) {
            console.error('Database query error:', error);
            return {error: 'Business not found'};
        }
    }
    
    register = async (pool) => {
        try {
            // INSERT INTO EMPLOYEE (role, hashed_password)
            // then insert into EMPLOYEE_PROFILE (first_name, last_name, email)
            const emp = this.business_manager;
            if(!emp) {
                return {error: 'Business Manager data is required'};
            }

            await pool.query('BEGIN');
            const bresult = await pool.query(`
                INSERT INTO business (name, phone_number, email, city, country, street, website_url, industry, business_logo_url, managerid_card_url, manager_personal_photo_url)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                ON CONFLICT (email) DO NOTHING
                RETURNING id;
            `, [this.name, this.phone_number, this.email, this.city, this.country, this.street, this.website_url, this.industry, this.business_logo_url, this.managerid_card_url, this.manager_personal_photo_url]);

            if(bresult.rows.length === 0) {
                return {error: 'Business Email already exists'};
            }

            const businessId = bresult.rows[0].id;

            this.business_manager.setBusinessId(businessId);
            
            const newEmp = await this.business_manager.register(pool);

            console.log('newEmp:', newEmp);

            if(newEmp.error) {
                return {error: newEmp.error};
            }
            const employeeId = newEmp.employeeId;

            this.id = businessId;
            await pool.query('COMMIT');

            return {businessId: businessId, employeeId: employeeId};
        }
        catch (error) {
            await pool.query('ROLLBACK');
            console.error('Database query error:', error);
            return {error: 'Error registering business'};
        }
    }

    update = async (pool, businessId, businessData) => {
        // only update phone_number, city, website_url, street, business_logo_url
        try {
            const result = await pool.query(`
                UPDATE BUSINESS
                SET phone_number = $1, city = $2, website_url = $3, street = $4, business_logo_url = $5
                WHERE id = $6
                RETURNING *;
            `, [businessData.phone_number, businessData.city, businessData.website_url, businessData.street, businessData.business_logo_url, businessId]);

            return result.rows[0];
        }
        catch (error) {
            console.error('Database query error:', error);
            return {error: 'Failed to update business'};
        }

    }

    getSummary = async (pool, businessId) => {
        try {
           const openers = await pool.query(`
                SELECT CAST(COUNT(*) as int) as count
                FROM employee e
                WHERE e.business_id = $1 AND e.role = 0;
            `, [businessId]);

            const executors = await pool.query(`
                SELECT CAST(COUNT(*) as int) as count
                FROM employee e
                WHERE e.business_id = $1 AND e.role = 1;
            `, [businessId]);

            const customers = await pool.query(`
                SELECT CAST(COUNT(*) as int) as count
                FROM customer c
                WHERE c.business_id = $1;
            `, [businessId]);

            const open_deals = await pool.query(`
                SELECT CAST(COUNT(*) as int) as count
                FROM deal d
                JOIN customer c ON d.customer_id = c.id
                WHERE c.business_id = $1 AND d.status = 0;
            `, [businessId]);
            
            const claimed_deals = await pool.query(`
                SELECT CAST(COUNT(*) as int) as count
                FROM deal d
                JOIN customer c ON d.customer_id = c.id
                WHERE c.business_id = $1 AND d.status = 1;
            `, [businessId]);

            const closed_won_deals = await pool.query(`
                SELECT CAST(COUNT(*) as int) as count
                FROM deal d
                JOIN customer c ON d.customer_id = c.id
                WHERE c.business_id = $1 AND d.status = 2;
            `, [businessId]);

            const closed_lost_deals = await pool.query(`
                SELECT CAST(COUNT(*) as int) as count
                FROM deal d
                JOIN customer c ON d.customer_id = c.id
                WHERE c.business_id = $1 AND d.status = 3;
            `, [businessId]);


            const income = await pool.query(`
                SELECT SUM(fr.amount) as total
                FROM financial_record fr
                WHERE fr.business_id = $1 AND fr.type = 1;
            `, [businessId]);

            const expenses = await pool.query(`
                SELECT SUM(fr.amount) as total
                FROM financial_record fr
                WHERE fr.business_id = $1 AND fr.type = 0;
            `, [businessId]);

            const summary = {
                openers: openers.rows[0].count,
                executors: executors.rows[0].count,
                employees: openers.rows[0].count + executors.rows[0].count,
                customers: customers.rows[0].count,
                open_deals: open_deals.rows[0].count,
                claimed_deals: claimed_deals.rows[0].count,
                closed_won_deals: closed_won_deals.rows[0].count,
                closed_lost_deals: closed_lost_deals.rows[0].count,
                income: income.rows[0].total,
                expenses: expenses.rows[0].total,
                net_balance: income.rows[0].total - expenses.rows[0].total
            };

            return summary;

        }
        catch (error) {
            console.error('Database query error:', error);
            return {error: 'Failed to get business summary'};
        }
    }
}

export default BusinessModel;
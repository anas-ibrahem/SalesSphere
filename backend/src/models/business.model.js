//import EmployeeModel from "./employee.model";

class BusinessModel {
    constructor({id, name, registration_date, phone_number, email, city, country, street, website_url, industry}, business_manager) {
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
                return {};
            }

            const results = result.rows[0];
            return results;

        }
        catch (error) {
            console.error('Database query error:', error);
            return {};
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
                INSERT INTO business (name, phone_number, email, city, country, street, website_url, industry)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                ON CONFLICT (email) DO NOTHING
                RETURNING id;
            `, [this.name, this.phone_number, this.email, this.city, this.country, this.street, this.website_url, this.industry]);

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
            return {};
        }

    }
}

export default BusinessModel;
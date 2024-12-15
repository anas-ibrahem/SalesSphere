class DealModel {
    getAll = async (pool, business_id) => {
        try {
            console.log('business_id', business_id);
            const result = await pool.query(`
                SELECT 
                d.*,
                c.business_id,
                json_build_object(
                    'id', c.id,
                    'name', c.name,
                    'registration_date', c.registration_date,
                    'phone_number', c.phone_number,
                    'email', c.email,
                    'address', c.address,
                    'type', c.type,
                    'lead_source', c.lead_source,
                    'preferred_contact_method', c.preferred_contact_method
                ) AS customer,
                json_build_object(
                    'id', e.employee_id,
                    'first_name', e.first_name,
                    'last_name', e.last_name,
                    'phone_number', e.phone_number,
                    'address', e.address,
                    'birth_date', e.birth_date,
                    'profile_picture_url', e.profile_picture_url,
                    'hire_date', e.hire_date
                ) AS deal_executor,
                json_build_object(
                    'id', e2.employee_id,
                    'first_name', e2.first_name,
                    'last_name', e2.last_name,
                    'phone_number', e2.phone_number,
                    'address', e2.address,
                    'birth_date', e2.birth_date,
                    'profile_picture_url', e2.profile_picture_url,
                    'hire_date', e2.hire_date
                ) AS deal_opener
            FROM deal d
            JOIN customer c ON d.customer_id = c.id
            JOIN employee_profile e2 ON d.deal_opener = e2.employee_id
            LEFT JOIN employee_profile e ON d.deal_executor = e.employee_id
            WHERE c.business_id = $1
            `, [business_id]);
            return result.rows;
        }
        catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    }

    getEmployeeClaimedDeals = async (pool , employeeId) => {
        try {
            const result = await pool.query(`
                SELECT 
                d.*,
                c.business_id,
                json_build_object(
                    'id', c.id,
                    'name', c.name,
                    'registration_date', c.registration_date,
                    'phone_number', c.phone_number,
                    'email', c.email,
                    'address', c.address,
                    'type', c.type,
                    'lead_source', c.lead_source,
                    'preferred_contact_method', c.preferred_contact_method
                ) AS customer,
                json_build_object(
                    'id', e.employee_id,
                    'first_name', e.first_name,
                    'last_name', e.last_name,
                    'phone_number', e.phone_number,
                    'address', e.address,
                    'birth_date', e.birth_date,
                    'profile_picture_url', e.profile_picture_url,
                    'hire_date', e.hire_date
                ) AS deal_executor,
                json_build_object(
                    'id', e2.employee_id,
                    'first_name', e2.first_name,
                    'last_name', e2.last_name,
                    'phone_number', e2.phone_number,
                    'address', e2.address,
                    'birth_date', e2.birth_date,
                    'profile_picture_url', e2.profile_picture_url,
                    'hire_date', e2.hire_date
                ) AS deal_opener
            FROM deal d
            JOIN customer c ON d.customer_id = c.id
            JOIN employee_profile e2 ON d.deal_opener = e2.employee_id
            LEFT JOIN employee_profile e ON d.deal_executor = e.employee_id
            WHERE d.status = 1 AND d.deal_executor = $1
            ` , [employeeId]);
            return result.rows;
        }
        catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    }

    getAllOpenDeals = async (pool, business_id) => {
        try {
            const result = await pool.query(`
                SELECT 
                d.*,
                c.business_id,
                json_build_object(
                    'id', c.id,
                    'name', c.name,
                    'registration_date', c.registration_date,
                    'phone_number', c.phone_number,
                    'email', c.email,
                    'address', c.address,
                    'type', c.type,
                    'lead_source', c.lead_source,
                    'preferred_contact_method', c.preferred_contact_method
                ) AS customer,
                json_build_object(
                    'id', e.employee_id,
                    'first_name', e.first_name,
                    'last_name', e.last_name,
                    'phone_number', e.phone_number,
                    'address', e.address,
                    'birth_date', e.birth_date,
                    'profile_picture_url', e.profile_picture_url,
                    'hire_date', e.hire_date
                ) AS deal_executor,
                json_build_object(
                    'id', e2.employee_id,
                    'first_name', e2.first_name,
                    'last_name', e2.last_name,
                    'phone_number', e2.phone_number,
                    'address', e2.address,
                    'birth_date', e2.birth_date,
                    'profile_picture_url', e2.profile_picture_url,
                    'hire_date', e2.hire_date
                ) AS deal_opener
            FROM deal d
            JOIN customer c ON d.customer_id = c.id
            JOIN employee_profile e2 ON d.deal_opener = e2.employee_id
            LEFT JOIN employee_profile e ON d.deal_executor = e.employee_id
            WHERE c.business_id = $1 and d.status = 0
            `, [business_id]);
            return result.rows;
        }
        catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    }
    getById = async (pool, id) => {
        try {
            const result = await pool.query(`
                SELECT 
                d.*,
                c.business_id,
                json_build_object(
                    'id', c.id,
                    'name', c.name,
                    'registration_date', c.registration_date,
                    'phone_number', c.phone_number,
                    'email', c.email,
                    'address', c.address,
                    'type', c.type,
                    'lead_source', c.lead_source,
                    'preferred_contact_method', c.preferred_contact_method
                ) AS customer,
                json_build_object(
                    'id', e.employee_id,
                    'first_name', e.first_name,
                    'last_name', e.last_name,
                    'phone_number', e.phone_number,
                    'address', e.address,
                    'birth_date', e.birth_date,
                    'profile_picture_url', e.profile_picture_url,
                    'hire_date', e.hire_date
                ) AS deal_executor,
                json_build_object(
                    'id', e2.employee_id,
                    'first_name', e2.first_name,
                    'last_name', e2.last_name,
                    'phone_number', e2.phone_number,
                    'address', e2.address,
                    'birth_date', e2.birth_date,
                    'profile_picture_url', e2.profile_picture_url,
                    'hire_date', e2.hire_date
                ) AS deal_opener
            FROM deal d
            JOIN customer c ON d.customer_id = c.id
            JOIN employee_profile e2 ON d.deal_opener = e2.employee_id
            LEFT JOIN employee_profile e ON d.deal_executor = e.employee_id
            WHERE d.id = $1;
            `, [id]);

            if(result.rows.length === 0) {
                return {};
            }

            return result.rows[0];

        }
        catch (error) {
            console.error('Database query error:', error);
            return {};
        }
    }

    updateStatus = async (pool, dealData , employeeId) => {
        try {
            const result = await pool.query(`
                UPDATE deal
                SET status = $1, deal_executor = $2
                WHERE id = $3
            `, [dealData.status, employeeId , dealData.id]);

            return result.rowCount > 0;
        }
        catch (error) {
            console.error('Database query error:', error);
            return false;
        }
    }

    /*
    CREATE TABLE DEAL (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    status INT NOT NULL, -- Open 0, Claimed 1, Closed Won 2, Closed Lost 3
    description TEXT,
    date_opened TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_closed TIMESTAMP,
    due_date TIMESTAMP NOT NULL,
    expenses DECIMAL NOT NULL,
    customer_budget DECIMAL NOT NULL,

    -- Relationships
    customer_id INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES CUSTOMER(id),

    deal_opener INT NOT NULL,
    FOREIGN KEY (deal_opener) REFERENCES EMPLOYEE(id),

    deal_executor INT,
    date_claimed TIMESTAMP,
    FOREIGN KEY (deal_executor) REFERENCES EMPLOYEE(id)
);
    */
    add = async (pool, dealData, employeeId) => {
        try {
            const result = await pool.query(`
                INSERT INTO deal (title, status, description, due_date, expenses, customer_budget, customer_id, deal_opener)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING id;
            `, [dealData.title, 0, dealData.description, dealData.due_date, dealData.expenses, dealData.customer_budget, dealData.customer_id, employeeId]);

            return { id: result.rows[0].id };
        }
        catch (error) {
            console.error('Database query error:', error);
            return { error: 'Error adding deal' };
        }
    }

    claim = async (pool, dealId, employeeId) => {
        try {
            const result = await pool.query(`
                UPDATE deal
                SET status = 1, deal_executor = $1, date_claimed = CURRENT_TIMESTAMP
                WHERE id = $2
            `, [employeeId, dealId]);

            return result.rowCount > 0;
        }
        catch (error) {
            console.error('Database query error:', error);
            return false;
        }
    }

    close = async (pool, dealId, status) => {
        try {
            const result = await pool.query(`
                UPDATE deal
                SET status = $1, date_closed = CURRENT_TIMESTAMP
                WHERE id = $2
            `, [status, dealId]);

            return result.rowCount > 0;
        }
        catch (error) {
            console.error('Database query error:', error);
            return false;
        }
    }

}

export default DealModel;
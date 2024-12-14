class EmployeeModel {
    constructor({id, email, hashed_password, first_name, last_name, phone_number, address, birth_date, role, business_id, hire_date}) {
        this.id = id;
        this.email = email;
        this.hashed_password = hashed_password;
        this.first_name = first_name;
        this.last_name = last_name;
        this.phone_number = phone_number;
        this.address = address;
        this.birth_date = birth_date;
        this.role = role;
        this.business_id = business_id;
        this.hire_date = hire_date;
    }

    setBusinessId = (business_id) => {
        this.business_id = business_id;
    }

    getAll = async (pool, business_id) => {
        try {
            const result = await pool.query(`
                SELECT *
                FROM employee e
                LEFT JOIN employee_profile ep
                ON e.id = ep.employee_id
                WHERE e.business_id = $1
                ORDER BY e.id;
            `, [business_id]);

            const results = result.rows.map(row => {
                // clean up the result object
                if(row['hashed_password']) {
                    delete row['hashed_password'];
                }

                if(row['employee_id']) {
                    delete row['employee_id'];
                }

                return row;
            });

            return results;
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
                FROM employee e
                LEFT JOIN employee_profile ep
                ON e.id = ep.employee_id
                WHERE e.id = $1;
            `, [id]);

            if(result.rows.length === 0) {
                return {};
            }

            const results = result.rows[0];
            // clean up the result object
            if(results['hashed_password']) {
                delete results['hashed_password'];
            }

            if(results['employee_id']) {
                delete results['employee_id'];
            }

            return results;

        }
        catch (error) {
            console.error('Database query error:', error);
            return {};
        }
    }

    getByEmailForAuth = async (pool, email) => {
        try {
            const result = await pool.query(`
                SELECT *
                FROM employee e
                LEFT JOIN employee_profile ep
                ON e.id = ep.employee_id
                WHERE e.email = $1;
            `, [email]);

            if(result.rows.length === 0) {
                return {};
            }

            const results = result.rows[0];
            // clean up the result object

            if(results['employee_id']) {
                delete results['employee_id'];
            }

            return results;

        }
        catch (error) {
            console.error('Database query error:', error);
            return {};
        }
    }

    getByEmail = async (pool, email) => {
        const emp = await this.getByEmailForAuth(pool, email);
        if(emp) {
            if(emp['hashed_password']) {
                delete emp['hashed_password'];
            }
        }
        return emp;
    }

    register = async (pool) => {
        try {
            // INSERT INTO EMPLOYEE (role, hashed_password)
            // then insert into EMPLOYEE_PROFILE (first_name, last_name, email)
            await pool.query('BEGIN');
            const result = await pool.query(`
                INSERT INTO employee (role, email, hashed_password, business_id)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (email) DO NOTHING
                RETURNING id;
            `, [this.role, this.email, this.hashed_password, this.business_id]);
            
            if(result.rows.length === 0) {
                await pool.query('ROLLBACK');
                return {error: 'Employee Email already exists'};
            }

            const employeeId = result.rows[0].id;

            await pool.query(`
                INSERT INTO employee_profile (employee_id, first_name, last_name, phone_number, address, birth_date, hire_date)
                VALUES ($1, $2, $3, $4, $5, $6, $7);
            `, [employeeId, this.first_name, this.last_name, this.phone_number, this.address, this.birth_date, this.hire_date]);

            this.id = employeeId;
            await pool.query('COMMIT');

            return {employeeId: employeeId};
        }
        catch (error) {
            await pool.query('ROLLBACK');
            console.error('Database query error:', error);
            return {error: 'Error registering employee'};
        }
    }

    updateProfile = async (pool, employeeId, empData) => {
        try {
            await pool.query('BEGIN');
            
            // Check if the email already exists for another employee
            const emailCheck = await pool.query(`
                SELECT id 
                FROM employee 
                WHERE email = $1 AND id != $2;
            `, [empData.email, employeeId]);
    
            if (emailCheck.rows.length > 0) {
                await pool.query('ROLLBACK');
                return false; // Email already exists
            }
    
            // Update the employee email
            await pool.query(`
                UPDATE employee 
                SET email = $1
                WHERE id = $2;
            `, [empData.email, employeeId]);
    
            // Update the employee profile
            await pool.query(`
                UPDATE employee_profile 
                SET first_name = $1, last_name = $2, phone_number = $3, address = $4
                WHERE employee_id = $5;
            `, [
                empData.first_name,
                empData.last_name,
                empData.phone_number,
                empData.address,
                employeeId
            ]);
    
            await pool.query('COMMIT');
            return true; // Update successful
        } catch (error) {
            await pool.query('ROLLBACK');
            console.error('Database query error:', error);
            return false; // Error occurred
        }
    }
    
    
}

export default EmployeeModel;
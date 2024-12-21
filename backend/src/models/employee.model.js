import e from "express";
import { get } from "http";

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

    getByIdForAuth = async (pool, id) => {
        try {
            const result = await pool.query(`
                SELECT *
                FROM employee e
                LEFT JOIN employee_profile ep
                ON e.id = ep.employee_id
                WHERE e.id = $1;
            `, [id]);

            if(result.rows.length === 0) {
                return {error: 'Employee not found'};
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
            return {error: 'Employee not found'};
        }
    }

    getById = async (pool, id) => {
        const emp = await this.getByIdForAuth(pool, id);
        if(emp) {
            if(emp['hashed_password']) {
                delete emp['hashed_password'];
            }
        }

        return emp;
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
                return {error: 'Employee not found'};
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
            return {error: 'Employee not found'};
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

    register = async (pool, verified=0) => {
        try {
            // INSERT INTO EMPLOYEE (role, hashed_password)
            // then insert into EMPLOYEE_PROFILE (first_name, last_name, email)
            await pool.query('BEGIN');
            const result = await pool.query(`
                INSERT INTO employee (role, email, hashed_password, business_id, verified)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (email) DO NOTHING
                RETURNING id;
            `, [this.role, this.email, this.hashed_password, this.business_id, verified]);
            
            if(result.rows.length === 0) {
                await pool.query('ROLLBACK');
                return {error: 'Employee Email already exists'};
            }

            const employeeId = result.rows[0].id;

            if(!this.hire_date) {
                this.hire_date = new Date();
            }

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

    updateMyProfile = async (pool, employeeId, empData) => {
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
                SET first_name = $1, last_name = $2, phone_number = $3, address = $4 , profile_picture_url = $5
                WHERE employee_id = $6;
            `, [
                empData.first_name,
                empData.last_name,
                empData.phone_number,
                empData.address,
                empData.profile_picture_url,
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

    updateEmployeeProfile = async (pool, employeeId, empData) => {
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
                SET email = $1, role = $2
                WHERE id = $3;
            `, [empData.email, empData.role, employeeId]);
    
            // Update the employee profile
            await pool.query(`
                UPDATE employee_profile 
                SET first_name = $1, last_name = $2, phone_number = $3, address = $4,
                birth_date = $5,
                hire_date = $6,
                profile_picture_url = $7
                WHERE employee_id = $8;
            `, [
                empData.first_name,
                empData.last_name,
                empData.phone_number,
                empData.address,
                empData.birth_date,
                empData.hire_date,
                empData.profile_picture_url,
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

    getSummary = async (pool, employee_id) => {
        try {
            const result = await pool.query(`
                SELECT *
                FROM employee e
                LEFT JOIN employee_profile ep
                ON e.id = ep.employee_id
                WHERE e.id = $1;
            `, [employee_id]);

            if(result.rows.length === 0) {
                return {error: 'Employee not found'};
            }

            const results = result.rows[0];

            // clean up the result object
            if(results['hashed_password']) {
                delete results['hashed_password'];
            }

            if(results['employee_id']) {
                delete results['employee_id'];
            }

            const badges_result = await pool.query(`
                SELECT eb.*, b.*
                FROM employee e
                JOIN EMPLOYEE_BADGE eb
                ON e.id = eb.employee_id
                JOIN BADGE b
                ON eb.badge_id = b.id
                WHERE e.id = $1;
            `, [employee_id]);

            const open_deals_result = await pool.query(`
                SELECT CAST(COUNT(od.id) AS INT) as open_deals_count
                FROM deal od
                WHERE od.deal_opener = $1 AND od.status = 0;
            `, [employee_id]);

            const claimed_deals_result = await pool.query(`
                SELECT CAST(COUNT(cd.id) AS INT) as claimed_deals_count
                FROM deal cd
                WHERE cd.deal_executor = $1 AND cd.status = 1;
            `, [employee_id]);

            const closed_won_deals_result = await pool.query(`
                SELECT 
                    CAST(COUNT(cw.id) AS INT) as closed_won_deals_count
                FROM deal cw
                WHERE cw.deal_executor = $1 AND cw.status = 2;
            `, [employee_id]);

            const closed_lost_deals_result = await pool.query(`
                SELECT 
                    CAST(COUNT(cl.id) AS INT) as closed_lost_deals_count
                FROM deal cl
                WHERE cl.deal_executor = $1 AND cl.status = 3;
            `, [employee_id]);

            const deals_result = {
                open_deals_count: open_deals_result.rows[0]?.open_deals_count || 0,
                claimed_deals_count: claimed_deals_result.rows[0]?.claimed_deals_count || 0,
                closed_won_deals_count: closed_won_deals_result.rows[0]?.closed_won_deals_count || 0,
                closed_lost_deals_count: closed_lost_deals_result.rows[0]?.closed_lost_deals_count || 0
            };

            const customers_result = await pool.query(`
                SELECT CAST(COUNT(c.id) as int) as customers_count
                FROM customer c
                WHERE c.added_by = $1;
            `, [employee_id]);


            const targets_result = await pool.query(`
                SELECT *
                FROM target t
                JOIN employee_target et ON t.id = et.target_id
                WHERE et.employee_id = $1;
            `, [employee_id]);

            results.badges = badges_result.rows;
            results.deals = deals_result;
            results.customers = customers_result.rows.length && customers_result.rows[0];
            results.targets = targets_result.rows;

            return results;

        }
        catch (error) {
            console.error('Database query error:', error);
            return {error: 'Employee not found'};
        }
    }

    getAllSummary = async (pool, business_id) => {
        try {
           // same as getSummary but for all employees
              const result = await pool.query(`
                 SELECT *
                 FROM employee e
                 LEFT JOIN employee_profile ep
                 ON e.id = ep.employee_id
                 WHERE e.business_id = $1;
                `, [business_id]);
    
                const employees = result.rows.map(row => {
                 // clean up the result object
                 if(row['hashed_password']) {
                      delete row['hashed_password'];
                 }
    
                 if(row['employee_id']) {
                      delete row['employee_id'];
                 }
    
                 return row;
                });
    
                for (let i = 0; i < employees.length; i++) {
                 const employee = employees[i];
                 const summary = await this.getSummary(pool, employee.id);
                    employee.badges = summary.badges;
                    employee.deals = summary.deals;
                    employee.customers = summary.customers;
                    employee.targets = summary.targets;

                    employees[i] = employee;
                }

                return employees;
        }
        catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    }

    updatePassword = async (pool, employeeId, hashedPassword) => {
        try {
            await pool.query(`
                UPDATE employee
                SET hashed_password = $1
                WHERE id = $2;
            `, [hashedPassword, employeeId]);
            return true;
        }
        catch (error) {
            console.error('Database query error:', error);
            return false;
        }
    }

    setPwdResetCode = async (pool, employee_id, code) => {
        try {
            await pool.query(`
                INSERT INTO forgot_password (employee_id, code, expiry)
                VALUES ($1, $2, NOW() + INTERVAL '1 hour')
                ON CONFLICT (employee_id) DO UPDATE SET code = $2, expiry = NOW() + INTERVAL '1 hour';
            `, [employee_id, code]);
            return true;
        }
        catch (error) {
            console.error('Database query error:', error);
            return false;
        }
    }

    getPwdResetCode = async (pool, employee_id) => {
        try {
            const result = await pool.query(`
                SELECT code, expiry, cast(NOW() > expiry as bool) as is_expired
                FROM forgot_password
                WHERE employee_id = $1;
            `, [employee_id]);

            if(result.rows.length === 0) {
                return {error: 'Invalid reset code'};
            }

            const code = result.rows[0];

            return {code: code.code, is_expired:code.is_expired};
        }
        catch (error) {
            console.error('Database query error:', error);
            return {error: 'Invalid reset code'};
        }
    }

    deletePwdResetCode = async (pool, employee_id) => {
        try {
            await pool.query(`
                DELETE FROM forgot_password
                WHERE employee_id = $1;
            `, [employee_id]);
            return true;
        }
        catch (error) {
            console.error('Database query error:', error);
            return false;
        }
    }

    getTopEmployees = async (pool, business_id) => {
        // get the names of the top 5 employees with the most closed/opened won deals
        try {
            const exec_result = await pool.query(`
                SELECT concat(ep.first_name, ' ', ep.last_name) as name, COUNT(d.id) as deals
                FROM employee e
                LEFT JOIN deal d
                ON d.deal_executor = e.id AND d.status = 2
                JOIN employee_profile ep
                ON e.id = ep.employee_id
                WHERE e.business_id = $1 and e.role = 1
                GROUP BY ep.first_name, ep.last_name
                ORDER BY deals DESC
                LIMIT 5;
            `, [business_id]);

            const opener_result = await pool.query(`
                SELECT concat(ep.first_name, ' ', ep.last_name) as name, COUNT(d.id) as deals
                FROM employee e
                LEFT JOIN deal d
                ON d.deal_opener = e.id AND d.status = 2
                JOIN employee_profile ep
                ON e.id = ep.employee_id
                WHERE e.business_id = $1 and e.role = 0
                GROUP BY ep.first_name, ep.last_name
                ORDER BY deals DESC
                LIMIT 5;
            `, [business_id]);

            return {executors: exec_result.rows, openers: opener_result.rows};

        }
        catch (error) {
            console.error('Database query error:', error);
            return {executors: [], openers: []};
        }
    }

    getMyRank = async (pool, employee_id, role) => {
        // get the rank of the employee with the most closed deals
        try {  
            const result = await pool.query(`
                SELECT rank
                FROM (
                    SELECT e.id, RANK() OVER (ORDER BY COUNT(d.id) DESC) as rank
                    FROM employee e
                    LEFT JOIN deal d
                    ON d.${role == 0 ? 'deal_opener' : 'deal_executor'} = e.id AND d.status = 2
                    WHERE e.role = $1
                    GROUP BY e.id
                ) as r
                WHERE id = $2;
            `, [role, employee_id]);

            if(result.rows.length === 0) {
                return {rank: 0};
            }

            return result.rows[0];
        }
        catch (error) {
            console.error('Database query error:', error);
            return {rank: 0};
        }
    }

    deleteEmployee = async (pool, employee_id) => {
        try {
            await pool.query('BEGIN');

            await pool.query(`
                DELETE FROM employee_profile
                WHERE employee_id = $1;
            `, [employee_id]);

            await pool.query(`
                DELETE FROM employee
                WHERE id = $1;
            `, [employee_id]);

            await pool.query('COMMIT');
            return {success: true};
        }
        catch (error) {
            await pool.query('ROLLBACK');
            console.error('Database query error:', error);
            return {error: 'Failed to delete employee'};
        }
    }
    
}

export default EmployeeModel;
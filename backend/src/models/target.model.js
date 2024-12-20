class TargetModel {
    getAll = async (pool, business_id) => {
        try {
            const result = await pool.query(`
                SELECT t.*
                FROM TARGET t
                JOIN employee e ON t.employee_id = e.id
                WHERE e.business_id = $1;
            `, [business_id]);

            return result.rows;
        }
        catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    }
    getAllActive = async (pool, business_id) => {
        try {
            const result = await pool.query(`
                SELECT t.*, (t.deadline - CURRENT_TIMESTAMP) as time_left
                FROM TARGET t
                JOIN employee e ON t.employee_id = e.id
                WHERE e.business_id = $1 AND t.deadline > CURRENT_TIMESTAMP AND t.start_date < CURRENT_TIMESTAMP;
            `, [business_id]);

            return result.rows;
        }
        catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    }

    getAllUpcoming = async (pool, business_id) => {
        try {
            const result = await pool.query(`
                SELECT t.*, (t.deadline - CURRENT_TIMESTAMP) as time_left
                FROM TARGET t
                JOIN employee e ON t.employee_id = e.id
                WHERE e.business_id = $1 AND t.start_date > CURRENT_TIMESTAMP;
            `, [business_id]);

            return result.rows;
        }
        catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    }

    getAllFinished = async (pool, business_id) => {
        try {
            const result = await pool.query(`
                SELECT t.*, (CURRENT_TIMESTAMP - t.deadline) as time_passed
                FROM TARGET t
                JOIN employee e ON t.employee_id = e.id
                WHERE e.business_id = $1 AND t.deadline < CURRENT_TIMESTAMP;
            `, [business_id]);

            return result.rows;
        }
        catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    }

    getAllByEmployee = async (pool, employee_id) => {
        try {
            const result = await pool.query(`
                SELECT *
                FROM TARGET
                WHERE employee_id = $1;
            `, [employee_id]);

            return result.rows;
        }
        catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    }

    getAllByEmployeeActive = async (pool, employee_id) => {
        try {
            const result = await pool.query(`
                SELECT *, (deadline - CURRENT_TIMESTAMP) as time_left
                FROM TARGET
                WHERE employee_id = $1 AND deadline > CURRENT_TIMESTAMP AND start_date < CURRENT_TIMESTAMP;
            `, [employee_id]);

            return result.rows;
        }
        catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    }

    getAllByEmployeeUpcoming = async (pool, employee_id) => {
        try {
            const result = await pool.query(`
                SELECT *, (deadline - CURRENT_TIMESTAMP) as time_left
                FROM TARGET
                WHERE employee_id = $1 AND start_date > CURRENT_TIMESTAMP;
            `, [employee_id]);

            return result.rows;
        }
        catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    }

    getAllByEmployeeFinished = async (pool, employee_id) => {
        try {
            const result = await pool.query(`
                SELECT *, (CURRENT_TIMESTAMP - deadline) as time_passed
                FROM TARGET
                WHERE employee_id = $1 AND deadline < CURRENT_TIMESTAMP;
            `, [employee_id]);
            
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
                SELECT *
                FROM TARGET
                WHERE id = $1;
            `, [id]);

            if(result.rows.length === 0) {
                return {};
            }

            const results = result.rows[0];

            return results;

        }
        catch (error) {
            console.error('Database query error:', error);
            return {error: 'Failed to get target'};
        }
    }

    add = async (pool, targetData) => {
        try {
            const result = await pool.query(`
                INSERT INTO TARGET (type, goal, deadline, description, employee_id, start_date)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;
            `, [targetData.type, targetData.goal, targetData.deadline, targetData.description, targetData.employee_id, targetData.start_date]);

            return result.rows[0];
        }
        catch (error) {
            console.error('Database query error:', error);
            return {error: 'Failed to add target'};
        }
    }

    addForMultipleEmployees = async (pool, targetData) => {
        try {
            const values = targetData.employee_ids.map((employee_id) => `(${targetData.type}, ${targetData.goal}, '${targetData.deadline}', '${targetData.description}', ${employee_id}, '${targetData.start_date}')`).join(', ');

            const result = await pool.query(`
                INSERT INTO TARGET (type, goal, deadline, description, employee_id, start_date)
                VALUES ${values}
                RETURNING *;
            `);

            return result.rows;
        }
        catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    }
    
    edit = async (pool, targetData) => {
        try {
            const result = await pool.query(`
                UPDATE TARGET
                SET type = $1, goal = $2, deadline = $3, description = $4, employee_id = $5, start_date = $6
                WHERE id = $7
                RETURNING *;
            `, [targetData.type, targetData.goal, targetData.deadline, targetData.description, targetData.employee_id, targetData.start_date, targetData.id]);

            return result.rows[0];
        }
        catch (error) {
            console.error('Database query error:', error);
            return {error: 'Failed to edit target'};
        }
    }

}

export default TargetModel;
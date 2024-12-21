class TargetModel {
    getAll = async (pool, business_id) => {
        try {
            const result = await pool.query(`
                SELECT t.*, CAST(COUNT(et.employee_id) as int) as employee_count,
                CAST(AVG(et.progress) as int) as average_progress,
                CASE WHEN t.deadline < CURRENT_TIMESTAMP THEN true ELSE false END as is_finished,
                CASE WHEN t.start_date > CURRENT_TIMESTAMP THEN true ELSE false END as is_upcoming
                FROM TARGET t
                JOIN EMPLOYEE_TARGET et ON t.id = et.target_id
                JOIN employee e ON et.employee_id = e.id
                WHERE e.business_id = $1
                GROUP BY t.id;
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
                JOIN EMPLOYEE_TARGET et ON t.id = et.target_id
                JOIN employee e ON et.employee_id = e.id
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
                SELECT t.*, et.progress, (t.deadline - CURRENT_TIMESTAMP) as time_left
                FROM TARGET t
                JOIN EMPLOYEE_TARGET et ON t.id = et.target_id
                JOIN employee e ON et.employee_id = e.id
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
                SELECT t.*, et.progress, (CURRENT_TIMESTAMP - t.deadline) as time_passed
                FROM TARGET t
                JOIN EMPLOYEE_TARGET et ON t.id = et.target_id
                JOIN employee e ON et.employee_id = e.id
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
                SELECT t.*, et.progress
                FROM TARGET t
                JOIN EMPLOYEE_TARGET et ON t.id = et.target_id
                WHERE et.employee_id = $1;
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
                SELECT t.*, et.progress, (t.deadline - CURRENT_TIMESTAMP) as time_left
                FROM TARGET t
                JOIN EMPLOYEE_TARGET et ON t.id = et.target_id
                WHERE et.employee_id = $1 AND t.deadline > CURRENT_TIMESTAMP AND t.start_date < CURRENT_TIMESTAMP
                ORDER BY t.deadline ASC;
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
                SELECT t.*, et.progress, (t.deadline - CURRENT_TIMESTAMP) as time_left
                FROM TARGET t
                JOIN EMPLOYEE_TARGET et ON t.id = et.target_id
                WHERE et.employee_id = $1 AND t.start_date > CURRENT_TIMESTAMP
                ORDER BY t.start_date ASC;
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
                SELECT t.*, et.progress, (CURRENT_TIMESTAMP - t.deadline) as time_passed
                FROM TARGET t
                JOIN EMPLOYEE_TARGET et ON t.id = et.target_id
                WHERE et.employee_id = $1 AND t.deadline < CURRENT_TIMESTAMP;
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
                return {error: 'Target not found'};
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
            await pool.query(`BEGIN`);
            const result = await pool.query(`
                INSERT INTO TARGET (type, goal, deadline, description, start_date)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *;
            `, [targetData.type, targetData.goal, targetData.deadline, targetData.description, targetData.start_date]);

            const target = result.rows[0];

            await pool.query(`
                INSERT INTO EMPLOYEE_TARGET (employee_id, target_id)
                VALUES ($1, $2);
            `, [targetData.employee_id, target.id]);

            await pool.query(`COMMIT;`);
            return target;
        }
        catch (error) {
            await pool.query(`ROLLBACK;`);
            console.error('Database query error:', error);
            return {error: 'Failed to add target'};
        }
    }

    addForMultipleEmployees = async (pool, targetData) => {
        try {

            await pool.query(`BEGIN`);
            const result = await pool.query(`
                INSERT INTO TARGET (type, goal, deadline, description, start_date)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *;
            `, [targetData.type, targetData.goal, targetData.deadline, targetData.description, targetData.start_date]);

            const target = result.rows[0];

            const values = targetData.employee_ids.map((employee_id) => `(${employee_id}, ${target.id})`).join(', ');

            await pool.query(`
                INSERT INTO EMPLOYEE_TARGET (employee_id, target_id)
                VALUES ${values};
            `);

            await pool.query(`COMMIT;`);

            return target;
        }
        catch (error) {
            await pool.query(`ROLLBACK;`);

            console.error('Database query error:', error);
            return [];
        }
    }
    
    edit = async (pool, targetData) => {
        try {
            const result = await pool.query(`
                UPDATE TARGET
                SET type = $1, goal = $2, deadline = $3, description = $4, start_date = $5
                WHERE id = $6
                RETURNING *;
            `, [targetData.type, targetData.goal, targetData.deadline, targetData.description, targetData.start_date, targetData.id]);

            return result.rows[0];
        }
        catch (error) {
            console.error('Database query error:', error);
            return {error: 'Failed to edit target'};
        }
    }

    addProgress = async (pool, employeeId, targetType, amount=1) => {
        try {
            const result = await pool.query(`
                UPDATE EMPLOYEE_TARGET
                SET progress = progress + $3
                WHERE employee_id = $1 AND target_id IN (
                    SELECT t.id
                    FROM TARGET t
                    WHERE t.type = $2 AND t.deadline > CURRENT_TIMESTAMP AND t.start_date < CURRENT_TIMESTAMP
                )
                RETURNING *;
            `, [employeeId, targetType, amount]);

            return {success: result.rows.length > 0};
        }
        catch (error) {
            console.error('Database query error:', error);
            return {error: 'Failed to add to progress'};
        }
    }

}

export default TargetModel;
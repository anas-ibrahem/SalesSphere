class LogsModel {
    getAll = async (pool, business_id) => {
        try {
            const result = await pool.query(`
                SELECT a.*, concat(e.first_name, ' ', e.last_name) as employee_name,
                c.name as customer_name, d.title as deal_name
                FROM ACTIVITY_LOG a
                LEFT JOIN EMPLOYEE_PROFILE e ON a.employee_id = e.employee_id
                LEFT JOIN CUSTOMER c ON a.customer_id = c.id
                LEFT JOIN DEAL d ON a.deal_id = d.id
                WHERE a.business_id = $1
                ORDER BY a.date DESC;
            `, [business_id]);

            return result.rows;
        }
        catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    }

    add = async (pool, logData) => {
        try {
            const result = await pool.query(`
                INSERT INTO ACTIVITY_LOG (content, type, employee_id, customer_id, deal_id, target_id, business_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *;
            `, [logData.content, logData.type, logData.employee_id, logData.customer_id, logData.deal_id, logData.target_id, logData.business_id]);

            return result.rows[0];
        }
        catch (error) {
            console.error('Database query error:', error);
            return {error: 'Database query error'};
        }
    }

}

export default LogsModel;
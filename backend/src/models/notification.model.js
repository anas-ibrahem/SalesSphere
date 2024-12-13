class NotificationModel {

    addNotification = async (pool, {recipient, title, content, priority, type}) => {
        try {
            const result = await pool.query(`INSERT INTO notification (recipient, title, content, priority, type) VALUES ($1, $2, $3, $4, $5);`, [recipient, title, content, priority, type]);
            return true;
        }
        catch (error) {
            console.error('Database query error:', error);
            return false;
        }
    }

    getAllByEmployee = async (pool, employeeId) => {
        try {
            const result = await pool.query(`
                SELECT *
                FROM notification
                WHERE recipient = $1
                ORDER BY date, priority DESC;
                `, [employeeId]);
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
                FROM notification
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
            return {};
        }
    }

    setSeen = async (pool, id) => {
        try {
            const result = await pool.query(`
                UPDATE notification
                SET seen = true
                WHERE id = $1;
            `, [id]);

            return true;

        }
        catch (error) {
            console.error('Database query error:', error);
            return false;
        }
    }
}

export default NotificationModel;
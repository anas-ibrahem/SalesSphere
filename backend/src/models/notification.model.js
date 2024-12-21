class NotificationModel {

    addNotification = async (pool, recipient, {title, content, priority, type}) => {
        try {
            const result = await pool.query(`INSERT INTO notification (recipient, title, content, priority, type) VALUES ($1, $2, $3, $4, $5);`, [recipient, title, content, priority, type]);
            return true;
        }
        catch (error) {
            console.error('Database query error:', error);
            return false;
        }
    }

    addNotificationToManager = async (pool, businessId, {title, content, priority, type}) => {
        try {
            const employees = await pool.query(`SELECT id FROM employee WHERE business_id = $1 and role = 0;`, [businessId]);

            const employee = employees.rows[0];
            const value = `(${employee.id}, '${title}', '${content}', ${priority}, ${type})`;

            const result = await pool.query(`INSERT INTO notification (recipient, title, content, priority, type) VALUES ${value};`);

            return true;
        }
        catch (error) {
            console.error('Database query error:', error);
            return false;
        }
    }

    addNotificationToExecutors = async (pool, businessId, {title, content, priority, type}) => {
        try {
            const employees = await pool.query(`SELECT id FROM employee WHERE business_id = $1 and (role = 1 or role = 2);`, [businessId]);

            let values = employees.rows.map(employee => `(${employee.id}, '${title}', '${content}', ${priority}, ${type})`).join(',');

            const result = await pool.query(`INSERT INTO notification (recipient, title, content, priority, type) VALUES ${values};`);

            return true;
        }
        catch (error) {
            console.error('Database query error:', error);
            return false;
        }
    }

    addNotificationToOpener = async (pool, businessId, {title, content, priority, type}) => {
        try {
            const employees = await pool.query(`SELECT id FROM employee WHERE business_id = $1 and (role = 0 or role = 2);`, [businessId]);

            let values = employees.rows.map(employee => `(${employee.id}, '${title}', '${content}', ${priority}, ${type})`).join(',');

            const result = await pool.query(`INSERT INTO notification (recipient, title, content, priority, type) VALUES ${values};`);

            return true;
        }
        catch (error) {
            console.error('Database query error:', error);
            return false;
        }
    }

    addNotificationToAll = async (pool, businessId, {title, content, priority, type}) => {
        try {
            const employees = await pool.query(`SELECT id FROM employee WHERE business_id = $1;`, [businessId]);

            let values = employees.rows.map(employee => `(${employee.id}, '${title}', '${content}', ${priority}, ${type})`).join(',');

            const result = await pool.query(`INSERT INTO notification (recipient, title, content, priority, type) VALUES ${values};`);

            return true;
        }
        catch (error) {
            console.error('Database query error:', error);
            return false;
        }
    }

    addNotificationToMultiple = async (pool, recipients, {title, content, priority, type}) => {
        try {
            let values = recipients.map(recipient => `(${recipient}, '${title}', '${content}', ${priority}, ${type})`).join(',');
            const result = await pool.query(`INSERT INTO notification (recipient, title, content, priority, type) VALUES ${values};`);
            
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
                SELECT *, cast(date as date) as justdate
                FROM notification
                WHERE recipient = $1
                ORDER BY justdate DESC, priority DESC, seen ASC, id DESC;
                `, [employeeId]);
            return result.rows;
        }
        catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    }

    getUnreadCount = async (pool, employeeId) => {
        try {
            const result = await pool.query(`
                SELECT COUNT(*) as unread_count
                FROM notification
                WHERE recipient = $1 AND seen = false;
            `, [employeeId]);

            return result.rows[0].unread_count;
        }
        catch (error) {
            console.error('Database query error:', error);
            return 0;
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
                return {error: 'Notification not found'};
            }

            const results = result.rows[0];

            return results;

        }
        catch (error) {
            console.error('Database query error:', error);
            return {error: 'Notification not found'};
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

    markAllAsRead = async (pool, employeeId) => {
        try {
            const result = await pool.query(`
                UPDATE notification
                SET seen = true
                WHERE recipient = $1;
            `, [employeeId]);

            return true;

        }
        catch (error) {
            console.error('Database query error:', error);
            return false;
        }
    }
}

export default NotificationModel;
class DealModel {
    getAll = async (pool) => {
        try {
            const result = await pool.query(`
                SELECT 
                d.*,
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
                ) AS customer
            FROM deal d
            JOIN customer c ON d.customer_id = c.id
            `);
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
                ) AS customer
            FROM deal d
            JOIN customer c ON d.customer_id = c.id
            WHERE d.status = 1 AND d.deal_executor = $1
            ` , [employeeId]);
            return result.rows;
        }
        catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    }

    getAllOpenDeals = async (pool) => {
        try {
            const result = await pool.query(`
                SELECT 
                d.*,
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
                ) AS customer
            FROM deal d
            JOIN customer c ON d.customer_id = c.id
            WHERE d.status = 0
            `);
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
                ) AS customer
            FROM deal d
            JOIN customer c ON d.customer_id = c.id
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
}

export default DealModel;
class DealModel {
    getAll = async (pool) => {
        try {
            const result = await pool.query(`
                SELECT * FROM deal
            `);
            return result.rows;
        }
        catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    }

    getAllClaimedDeals = async (pool) => {
        try {
            const result = await pool.query(`
                SELECT * FROM deal WHERE status = 'claimed'
            `);
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
                SELECT * FROM deal WHERE status = 'open'
            `);
            return result.rows;
        }
        catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    }
}

export default DealModel;
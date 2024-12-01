
class DealModel {
    async getAll(pool) {
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
    async getAllClaimedDeals(pool) {
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
    async getAllOpenDeals(pool) {
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


export default new DealModel();
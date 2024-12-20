class FinanceModel {

    getAll = async (pool, business_id) => {
        try {
            const result = await pool.query(`
                SELECT fr.*, d.title as deal_title
                FROM FINANCIAL_RECORD fr
                LEFT JOIN DEAL d ON fr.deal_id = d.id
                WHERE business_id = $1
                ORDER BY fr.transaction_date DESC;
            `, [business_id]);

            return result.rows;
        }
        catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    }
    getAllExpenses = async (pool, business_id) => {
        try {
            const result = await pool.query(`
                SELECT fr.*, d.title as deal_title
                FROM FINANCIAL_RECORD fr
                LEFT JOIN DEAL d ON fr.deal_id = d.id
                WHERE business_id = $1 AND type = 0
                ORDER BY fr.transaction_date DESC;
            `, [business_id]);

            return result.rows;
        }
        catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    }
    getAllProfits = async (pool, business_id) => {
        try {
            const result = await pool.query(`
                SELECT fr.*, d.title as deal_title
                FROM FINANCIAL_RECORD fr
                LEFT JOIN DEAL d ON fr.deal_id = d.id
                WHERE business_id = $1 AND type = 1
                ORDER BY fr.transaction_date DESC;
            `, [business_id]);

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
                SELECT fr.*, d.title as deal_title
                FROM FINANCIAL_RECORD fr
                LEFT JOIN DEAL d ON fr.deal_id = d.id
                WHERE fr.id = $1;
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
    getByDealId = async (pool, deal_id) => {
        try {
            const result = await pool.query(`
                SELECT fr.*, d.title as deal_title
                FROM FINANCIAL_RECORD fr
                LEFT JOIN DEAL d ON fr.deal_id = d.id
                WHERE deal_id = $1
                ORDER BY fr.transaction_date DESC;
            `, [deal_id]);

            return result.rows;
        }
        catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    }
    getByDealIdSummary = async (pool, deal_id) => {
        // get the total amount of money spent on a deal, the total amount of money earned from a deal, and the profit
        try {
            const result = await pool.query(`
                SELECT SUM(amount) AS total_spent
                FROM FINANCIAL_RECORD
                WHERE deal_id = $1 AND type = 1;
            `, [deal_id]);

            const total_spent = result.rows[0].total_spent;

            const result2 = await pool.query(`
                SELECT SUM(amount) AS total_earned
                FROM FINANCIAL_RECORD
                WHERE deal_id = $1 AND type = 0;
            `, [deal_id]);

            const total_earned = result2.rows[0].total_earned;

            return {
                total_spent,
                total_earned,
                profit: total_earned - total_spent
            };
        }
        catch (error) {
            console.error('Database query error:', error);
            return {};
        }
    }
    add = async (pool, financial_record) => {
        const { amount, type, description, payment_method, business_id, deal_id } = financial_record;
        try {
            const result = await pool.query(`INSERT INTO FINANCIAL_RECORD (amount, type, description, payment_method, business_id, deal_id) VALUES ($1, $2, $3, $4, $5, $6);`, [amount, type, description, payment_method, business_id, deal_id]);
            return true;
        }
        catch (error) {
            console.error('Database query error:', error);
            return false;
        }
    }

}

export default FinanceModel;
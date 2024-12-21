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

            if (result.rows.length === 0) {
                return {error: 'Financial record not found'};
            }

            const results = result.rows[0];

            return results;

        }
        catch (error) {
            console.error('Database query error:', error);
            return {error: 'Financial record not found'};
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
                WHERE deal_id = $1 AND type = 0;
            `, [deal_id]);

            const total_spent = result.rows[0].total_spent;

            const result2 = await pool.query(`
                SELECT SUM(amount) AS total_earned
                FROM FINANCIAL_RECORD
                WHERE deal_id = $1 AND type = 1;
            `, [deal_id]);

            const total_earned = result2.rows[0].total_earned;

            return {
                total_spent,
                total_earned,
            };
        }
        catch (error) {
            console.error('Database query error:', error);
            return {error: 'Financial record not found'};
        }
    }
    add = async (pool, financial_record) => {
        const { amount, type, description, payment_method, business_id, deal_id } = financial_record;
        try {
            const result = await pool.query(`
                INSERT INTO FINANCIAL_RECORD (amount, type, description, payment_method, business_id, deal_id) 
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;`
                , [amount, type, description, payment_method, business_id, deal_id]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database query error:', error);
            return false;
        }
    }

    getProfitsPerDate = async (pool, business_id) => {
        try {
            const result = await pool.query(`
                SELECT SUM(CASE WHEN fr.type = 1 THEN fr.amount ELSE 0 END) - SUM(CASE WHEN fr.type = 0 THEN fr.amount ELSE 0 END) as profit, 
                cast(fr.transaction_date as date) as date
                FROM FINANCIAL_RECORD fr
                WHERE fr.business_id = $1
                GROUP BY date
                ORDER BY date;
            `, [business_id]);

            return result.rows;
        }
        catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    }

    getProfitsPerDateForEmployee = async (pool, employee_id) => {
        try {
            const result = await pool.query(`
                SELECT COALESCE(SUM(CASE WHEN fr.type = 1 THEN fr.amount ELSE 0 END), 0) - COALESCE(SUM(CASE WHEN fr.type = 0 THEN fr.amount ELSE 0 END), 0) as profit, 
                cast(fr.transaction_date as date) as date
                FROM FINANCIAL_RECORD fr
                JOIN DEAL d ON fr.deal_id = d.id
                WHERE d.deal_executor = $1 OR d.deal_opener = $1
                GROUP BY date
                ORDER BY date;
            `, [employee_id]);

            return result.rows;
        }
        catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    }
    

    getSummaryForEmployee = async (pool, employee_id) => {
        try {
            const income = await pool.query(`
                SELECT COALESCE(SUM(fr.amount), 0) as total
                FROM FINANCIAL_RECORD fr
                JOIN DEAL d ON fr.deal_id = d.id
                WHERE fr.type = 1 AND (d.deal_executor = $1 OR d.deal_opener = $1);
            `, [employee_id]);

            const expenses = await pool.query(`
                SELECT COALESCE(SUM(fr.amount), 0) as total
                FROM FINANCIAL_RECORD fr
                JOIN DEAL d ON fr.deal_id = d.id
                WHERE fr.type = 0 AND (d.deal_executor = $1 OR d.deal_opener = $1);
            `, [employee_id]);

            return {
                income: income.rows[0].total,
                expenses: expenses.rows[0].total,
                net_balance: income.rows[0].total - expenses.rows[0].total
            };
        }
        catch (error) {
            console.error('Database query error:', error);
            return 0;
        }
    }

}

export default FinanceModel;
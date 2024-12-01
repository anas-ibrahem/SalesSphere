
class EmployeeModel {
    async getAll(pool) {
        try {
            const result = await pool.query(`
                SELECT *
                FROM employee e
                LEFT JOIN employee_profile ep
                ON e.id = ep.employee_id
                ORDER BY e.id;
            `);
            return result.rows;
        }
        catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    }
}


export default new EmployeeModel();
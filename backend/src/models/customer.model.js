class CustomerModel {
    constructor({id, name, phone_number, email, address, type, lead_source, preferred_contact_method, added_by, business_id}) {
        this.id = id;
        this.name = name;
        this.phone_number = phone_number;
        this.email = email;
        this.address = address;
        this.type = type;
        this.lead_source = lead_source;
        this.preferred_contact_method = preferred_contact_method;
        this.added_by = added_by;
        this.business_id = business_id;
    }

    setBusinessId = (business_id) => {
        this.business_id = business_id;
    }

    getAll = async (pool, business_id) => {
        try {
            const result = await pool.query(`
                SELECT c.*,
                CAST(COUNT(od.id) AS INT) as open_deals_count,
                CAST(COUNT(cd.id) AS INT) as claimed_deals_count,
                CAST(COUNT(cw.id) AS INT) as closed_won_deals_count,
                CAST(COUNT(cl.id) AS INT) as closed_lost_deals_count
                FROM customer c
                join employee_profile e on c.added_by = e.employee_id
                LEFT JOIN deal od
                ON c.id = od.customer_id AND od.status = 0
                LEFT JOIN deal cd
                ON c.id = cd.customer_id AND cd.status = 1
                LEFT JOIN deal cw
                ON c.id = cw.customer_id AND cw.status = 2
                LEFT JOIN deal cl
                ON c.id = cl.customer_id AND cl.status = 3
                WHERE business_id = $1
                GROUP BY c.id;
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
                SELECT c.*,
                CAST(COUNT(od.id) AS INT) as open_deals_count,
                CAST(COUNT(cd.id) AS INT) as claimed_deals_count,
                CAST(COUNT(cw.id) AS INT) as closed_won_deals_count,
                CAST(COUNT(cl.id) AS INT) as closed_lost_deals_count
                FROM customer c
                LEFT JOIN deal od
                ON c.id = od.customer_id AND od.status = 0
                LEFT JOIN deal cd
                ON c.id = cd.customer_id AND cd.status = 1
                LEFT JOIN deal cw
                ON c.id = cw.customer_id AND cw.status = 2
                LEFT JOIN deal cl
                ON c.id = cl.customer_id AND cl.status = 3
                WHERE c.id = $1
                GROUP BY c.id;
            `, [id]);

            if(result.rows.length === 0) {
                return {};
            }
            const results = result.rows[0];

            const employee = await pool.query(`
                SELECT e.*
                FROM employee_profile e
                WHERE e.employee_id = $1;
            `, [results.added_by]);

            results.added_by = employee.rows[0];

            return results;

        }
        catch (error) {
            console.error('Database query error:', error);
            return {};
        }
    }

    add = async (pool) => {
        try {
            const result = await pool.query(`
                INSERT INTO customer (name, phone_number, email, address, type, lead_source, preferred_contact_method, added_by, business_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING id;
            `, [this.name, this.phone_number, this.email, this.address, this.type, this.lead_source, this.preferred_contact_method, this.added_by, this.business_id]);

            return result.rows[0];
        }
        catch (error) {
            console.error('Database query error:', error);
            return {error: 'Error adding customer'};
        }
    }

    getCustomersPerDate = async (pool, business_id) => {
        try {
            const result = await pool.query(`
                WITH daily_counts AS (
                    SELECT cast(COUNT(c.id) as int) as count, cast(registration_date as date) as reg_date
                    FROM customer c
                    WHERE c.business_id = $1
                    GROUP BY reg_date
                    ORDER BY reg_date
                )
                SELECT reg_date, cast(SUM(count) OVER (ORDER BY reg_date) as int) as customers_count
                FROM daily_counts;
            `, [business_id]);

            return result.rows;
        }
        catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    }

    update = async (pool) => {
        try {
            const result = await pool.query(`
                UPDATE customer
                SET name = $1, phone_number = $2, email = $3, address = $4, type = $5, lead_source = $6, preferred_contact_method = $7
                WHERE id = $8
                RETURNING id;
            `, [this.name, this.phone_number, this.email, this.address, this.type, this.lead_source, this.preferred_contact_method, this.id]);

            if(result.rows.length === 0) {
                return {error: 'Invalid customer ID'};
            }

            return result.rows[0];
        }
        catch (error) {
            console.error('Database query error:', error);
            return {error: 'Error updating customer'};
        }
    }

}

export default CustomerModel;
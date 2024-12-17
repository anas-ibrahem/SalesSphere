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
                json_build_object(
                    'id', e.employee_id,
                    'first_name', e.first_name,
                    'last_name', e.last_name,
                    'phone_number', e.phone_number,
                    'address', e.address,
                    'birth_date', e.birth_date,
                    'profile_picture_url', e.profile_picture_url,
                    'hire_date', e.hire_date
                ) AS added_by
                FROM customer c
                join employee_profile e on c.added_by = e.employee_id
                WHERE business_id = $1
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
                SELECT *
                FROM customer
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

}

export default CustomerModel;
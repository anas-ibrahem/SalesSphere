class AdminModel {
    constructor({id, email, username, hashed_password, privileges}) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.hashed_password = hashed_password;
        this.privileges = privileges;
    }


    getAll = async (pool) => {
        try {
            const result = await pool.query(`
                SELECT *
                FROM admin;
            `);

            const results = result.rows.map(row => {
                // clean up the result object
                if(row['hashed_password']) {
                    delete row['hashed_password'];
                }

                return row;
            });

            return results;
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
                FROM admin a
                WHERE a.id = $1;
            `, [id]);

            if(result.rows.length === 0) {
                return {};
            }

            const results = result.rows[0];
            // clean up the result object
            if(results['hashed_password']) {
                delete results['hashed_password'];
            }

            return results;

        }
        catch (error) {
            console.error('Database query error:', error);
            return {};
        }
    }

    getByEmailForAuth = async (pool, email) => {
        try {
            const result = await pool.query(`
                SELECT *
                FROM admin a
                WHERE a.email = $1 or a.username = $1;
            `, [email]);

            if(result.rows.length === 0) {
                return {};
            }

            const results = result.rows[0];
            // clean up the result object

            if(results['employee_id']) {
                delete results['employee_id'];
            }

            return results;

        }
        catch (error) {
            console.error('Database query error:', error);
            return {};
        }
    }

    getByEmail = async (pool, email) => {
        const admin = await this.getByEmailForAuth(pool, email);
        if(admin) {
            if(admin['hashed_password']) {
                delete admin['hashed_password'];
            }
        }
        return admin;
    }

    addAdmin = async (pool, admin) => {
        try {
            const result = await pool.query(`
                INSERT INTO admin(email, username, hashed_password, privilege)
                VALUES($1, $2, $3, $4)
                RETURNING id;
            `, [admin.email, admin.username, admin.hashed_password, admin.privilege]);

            if(result.rows.length === 0) {
                return {};
            }

            const results = result.rows[0];
            // clean up the result object
            if(results['hashed_password']) {
                delete results['hashed_password'];
            }

            return results;
        }
        catch (error) {
            console.error('Database query error:', error);
            return {};
        }
    }

    updateAdmin = async (pool, admin) => {
        try {
            let result
            if(admin.hashed_password && admin.hashed_password.length > 0) {
            result = await pool.query(`
                UPDATE admin
                SET email = $1, username = $2, hashed_password = $3, privilege = $4
                WHERE id = $5
                RETURNING *;
            `, [admin.email, admin.username, admin.hashed_password, admin.privilege, admin.id]);
            }
            else{
                result = await pool.query(`
                UPDATE admin
                SET email = $1, username = $2, privilege = $3
                WHERE id = $4
                RETURNING *;
            `, [admin.email, admin.username, admin.privilege, admin.id]);
            }
            if(result.rows.length === 0) {
                return {};
            }

            const results = result.rows[0];
            // clean up the result object
            if(results['hashed_password']) {
                delete results['hashed_password'];
            }

            return results;
        }
        catch (error) {
            console.error('Database query error:', error);
            return {};
        }
    }
        


  
    
    
}

export default AdminModel;
class BadgesModel {
    getAll = async (pool, employee_id) => {
        try {
            const result = await pool.query(`
                SELECT b.*, l.date_awarded, l.employee_id
                FROM EMPLOYEE_BADGE l
                JOIN BADGE b ON l.badge_id = b.id
                WHERE l.employee_id = $1;
            `, [employee_id]);

            return result.rows;
        }
        catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    }

    checkBadge = async (pool, employee_id, badge_type, count) => {
        const added_badges = [];
        try {
            const result = await pool.query(`
                SELECT name, required_points, id
                FROM BADGE
                WHERE type = $1;
            `, [badge_type]);

            
            result.rows.forEach(async (row) => {
                const required_points = row.required_points;

                if (count >= required_points) {
                    const results = await pool.query(`
                        INSERT INTO EMPLOYEE_BADGE (employee_id, badge_id)
                        VALUES ($1, $2)
                        ON CONFLICT (employee_id, badge_id) DO NOTHING
                        RETURNING badge_id;
                    `, [employee_id, row.id]);
                    console.log(results.rowCount)

                    if (results.rowCount > 0) {
                        added_badges.push(row.name);
                    }

                }
            });

            return added_badges;
        }
        catch (error) {
            console.error('Database query error:', error);
            return added_badges;
        }
    }

    checkDealOpened = async (pool, employee_id) => {
        try {
            const result = await pool.query(`
                SELECT COUNT(*) as count
                FROM DEAL
                WHERE deal_opener = $1;
            `, [employee_id]);
            
            const count = result.rows[0].count;

            const badges_added = await this.checkBadge(pool, employee_id, 0, count);
            const badges_added2 = await this.checkBadges(pool, employee_id);
            badges_added.push(...badges_added2);
            return badges_added;
        }
        catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    }

    checkDealClosed = async (pool, employee_id) => {
        try {
            const result = await pool.query(`
                SELECT COUNT(*) as count
                FROM DEAL
                WHERE deal_executor = $1
                AND status = 2;
            `, [employee_id]);
            
            const count = result.rows[0].count;

            const badges_added = await this.checkBadge(pool, employee_id, 1, count);
            const badges_added2 = await this.checkBadges(pool, employee_id);
            badges_added.push(...badges_added2);
            return badges_added;
        }
        catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    }

    checkCustomerAdded = async (pool, employee_id) => {
        try {
            const result = await pool.query(`
                SELECT COUNT(*) as count
                FROM CUSTOMER
                WHERE added_by = $1;
            `, [employee_id]);
            
            const count = result.rows[0].count;

            const badges_added = await this.checkBadge(pool, employee_id, 2, count);
            const badges_added2 = await this.checkBadges(pool, employee_id);
            badges_added.push(...badges_added2);
            return badges_added;
        }
        catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    }

    checkRevenue = async (pool, employee_id) => {
        try {
            const result = await pool.query(`
                SELECT SUM(fr.amount) as total
                FROM FINANCIAL_RECORD fr
                JOIN DEAL d ON fr.deal_id = d.id
                WHERE d.deal_executor = $1 AND fr.type = 1;
            `, [employee_id]);

            if (result.rows.length === 0) {
                return [];
            }
            
            const total = result.rows[0].total;

            const badges_added = await this.checkBadge(pool, employee_id, 3, total);
            const badges_added2 = await this.checkBadges(pool, employee_id);
            badges_added.push(...badges_added2);
            return badges_added;
        }
        catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    }


    checkBadges = async (pool, employee_id) => {
        try {
            const result = await pool.query(`
                SELECT COUNT(*) as count
                FROM EMPLOYEE_BADGE
                WHERE employee_id = $1;
            `, [employee_id]);

            const count = result.rows[0].count;

            const badges_added = await this.checkBadge(pool, employee_id, 4, count);
            return badges_added;
        }
        catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    }
}

export default BadgesModel;
/*
CREATE TABLE BADGE (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type INT NOT NULL, -- Depends on the event
    icon_url VARCHAR(255) NOT NULL,
    required_points INT NOT NULL -- Requirement to get the badge
);


CREATE TABLE EMPLOYEE_BADGE (
    date_awarded TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    employee_id INT NOT NULL,
    badge_id INT NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES EMPLOYEE(id),
    FOREIGN KEY (badge_id) REFERENCES BADGE(id),
    PRIMARY KEY (employee_id, badge_id)
);

*/
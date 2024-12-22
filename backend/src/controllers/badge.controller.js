import BadgesModel from "../models/badges.model.js";


class BadgeController {
    constructor() {
        this.badgesModel = new BadgesModel();
    }

    // Please use arrow function to bind 'this' to the class

    getAll = async (req, res) => {
        const badges = await this.badgesModel.getAll(req.pool, req.employeeId);
        res.json(badges);
    }
}

export default BadgeController;
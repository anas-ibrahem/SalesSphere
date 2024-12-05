import DealModel from "../models/deal.model.js";


class DealController {
    constructor() {
        this.dealModel = new DealModel();
    }
    getAll = async (req, res) => {
        const emps = await this.dealModel.getAll(req.pool);
        res.json(emps);
    }
    getAllClaimedDeals = async (req, res) => {
        const emps = await this.dealModel.getAllClaimedDeals(req.pool);
        res.json(emps);
    }
    getAllOpenDeals = async (req, res) => {
        const emps = await this.dealModel.getAllOpenDeals(req.pool);
        res.json(emps);
    }
}


export default new DealController();
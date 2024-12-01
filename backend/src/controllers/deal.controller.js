import DealModel from "../models/deal.model.js";


class DealController {
    async getAll(req, res) {
        const emps = await DealModel.getAll(req.pool);
        res.json(emps);
    }
    async getAllClaimedDeals(req, res) {
        const emps = await DealModel.getAllClaimedDeals(req.pool);
        res.json(emps);
    }
    async getAllOpenDeals(req, res) {
        const emps = await DealModel.getAllOpenDeals(req.pool);
        res.json(emps);
    }
}


export default new DealController();
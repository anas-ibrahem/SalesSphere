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

    getDealById = async (req, res) => {
        const id = req.params.id;
        const deal = await this.dealModel.getDealById(req.pool, id);
        res.json(deal);
    }

}


export default new DealController();
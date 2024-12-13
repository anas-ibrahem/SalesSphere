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

    getById = async (req, res) => {
        const deal = await this.dealModel.getById(req.pool, req.params.id);
        res.json(deal);
    }



}


export default new DealController();
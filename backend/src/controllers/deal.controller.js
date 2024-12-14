import DealModel from "../models/deal.model.js";


class DealController {
    constructor() {
        this.dealModel = new DealModel();
    }
    getAll = async (req, res) => {
        const emps = await this.dealModel.getAll(req.pool, req.businessId);
        res.json(emps);
    }
    getEmployeeClaimedDeals = async (req, res) => {
        const emps = await this.dealModel.getEmployeeClaimedDeals(req.pool , req.employeeId);
        res.json(emps);
    }
    getAllOpenDeals = async (req, res) => {
        const emps = await this.dealModel.getAllOpenDeals(req.pool, req.businessId);
        res.json(emps);
    }

    getById = async (req, res) => {
        const deal = await this.dealModel.getById(req.pool, req.params.id);
        res.json(deal);
    }

    updateStatus = async (req, res) => {
        const dealData = req.body;
        if(!dealData.id || !dealData.status) {
            return res.status(400).json({error: 'Deal ID and status are required'});
        }

        const result = await this.dealModel.updateStatus(req.pool, dealData , req.employeeId);
        res.json({success: result});
    }


}


export default new DealController();
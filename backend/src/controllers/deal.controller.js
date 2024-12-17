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


    add = async (req, res) => {
        const dealData = req.body;
        if(!dealData.customer_id) {
            return res.status(400).json({error: 'Customer ID is required'});
        }

        if(!dealData.title || !dealData.status || !dealData.due_date || !dealData.expenses || !dealData.customer_budget) {
            return res.status(400).json({error: 'Deal name, description, value and status are required'});
        }

        const result = await this.dealModel.add(req.pool, dealData, req.employeeId);
        res.json(result);
    }

    claim = async (req, res) => {
        const dealData = req.body;
        if(!dealData.id) {
            return res.status(400).json({error: 'Deal ID is required'});
        }

        const result = await this.dealModel.claim(req.pool, dealData , req.employeeId);
        res.json(result);
    }

    close = async (req, res) => {
        const dealData = req.body;
        if(!dealData.id) {
            return res.status(400).json({error: 'Deal ID is required'});
        }

        if(!dealData.status) {
            return res.status(400).json({error: 'Deal status is required'});
        }

        const result = await this.dealModel.close(req.pool, dealData.id , dealData.status);
        res.json(result);
    }

}


export default new DealController();
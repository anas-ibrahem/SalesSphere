import e from "express";
import DealModel from "../models/deal.model.js";
import LogsModel from "../models/logs.model.js";


class DealController {
    constructor() {
        this.dealModel = new DealModel();
        this.logsModel = new LogsModel();
    }
    getAll = async (req, res) => {
        const emps = await this.dealModel.getAll(req.pool, req.businessId);
        res.json(emps);
    }
    getEmployeeClaimedDeals = async (req, res) => {
        const emps = await this.dealModel.getEmployeeClaimedDeals(req.pool , req.employeeId);
        res.json(emps);
    }

    getEmployeeClosedDeals = async (req, res) => {
        const emps = await this.dealModel.getEmployeeClosedDeals(req.pool , req.employeeId);
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



    add = async (req, res) => {
        const dealData = req.body;
        if(!dealData.customer_id) {
            return res.status(400).json({error: 'Customer ID is required'});
        }

        if(!dealData.title || !dealData.due_date || !dealData.expenses || !dealData.customer_budget) {
            return res.status(400).json({error: 'Deal title, due_date, expenses and customer_budget are required'});
        }

        const result = await this.dealModel.add(req.pool, dealData, req.employeeId);
        if(!result.error) {
            const logData = {
                business_id: req.businessId,
                employee_id: req.employeeId,
                deal_id: result.id,
                customer_id: dealData.customer_id,
                type: 3,
                content: 'A new deal was opened'
            }
            this.logsModel.add(req.pool, logData);
        }
        res.json(result);
    }

    claim = async (req, res) => {
        const dealData = req.body;
        if(!dealData.id) {
            return res.status(400).json({error: 'Deal ID is required'});
        }

        const result = await this.dealModel.claim(req.pool, dealData.id , req.employeeId);
        if (!result)
            return res.status(400).json({error: 'Oops! Something went wrong. Please try again.'});
        else {
            const logData = {
                business_id: req.businessId,
                employee_id: req.employeeId,
                deal_id: dealData.id,
                type: 3,
                content: 'Deal claimed'
            }
            this.logsModel.add(req.pool, logData);
        }
        res.json({message : 'Deal claimed successfully'});
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
        if (!result)
            return res.status(400).json({error: 'Oops! Something went wrong. Please try again.'});
        else {
            const logData = {
                business_id: req.businessId,
                employee_id: req.employeeId,
                deal_id: dealData.id,
                type: 3,
                content: 'Deal closed'
            }
            this.logsModel.add(req.pool, logData);
        }

        res.json({status : dealData.status});
    }

    getEmployeeDeals = async (req, res) => {
        const deals = await this.dealModel.getEmployeeDeals(req.pool, req.params.id);
        res.json(deals);
    }

    getCustomerDeals = async (req, res) => {
        const deals = await this.dealModel.getCustomerDeals(req.pool, req.params.id);
        res.json(deals);
    }

}


export default new DealController();
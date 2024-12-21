import e from "express";
import DealModel from "../models/deal.model.js";
import LogsModel from "../models/logs.model.js";
import TargetModel from "../models/target.model.js";
import BadgesModel from "../models/badges.model.js";
import NotificationModel from "../models/notification.model.js";


class DealController {
    constructor() {
        this.dealModel = new DealModel();
        this.logsModel = new LogsModel();
        this.targetModel = new TargetModel();
        this.badgesModel = new BadgesModel();
        this.notificationModel = new NotificationModel();
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
            this.targetModel.addProgress(req.pool, req.employeeId, 0);
            const notificationData = {
                title: 'New Deal Opened',
                content: `New Deal: ${dealData.title} has been opened`,
                priority: 0,
                type: 2
            }

            this.notificationModel.addNotificationToExecutors(req.pool, req.businessId, notificationData);

            const badges = await this.badgesModel.checkDealOpened(req.pool, req.employeeId);
            if(badges.length > 0) {
                const notificationData2 = {
                    title: 'You earned new badges!',
                    content: `You have earned new badges: ${badges.map(badge => badge).join(', ')}`,
                    priority: 0,
                    type: 5
                }

                this.notificationModel.addNotification(req.pool, req.employeeId, notificationData2);
            }

        }
        res.json(result);
    }

    claim = async (req, res) => {
        const dealData = req.body;
        if(!dealData.id) {
            return res.status(400).json({error: 'Deal ID is required'});
        }

        const result = await this.dealModel.claim(req.pool, dealData.id , req.employeeId);
        if (result.error)
            return res.status(400).json({error: 'Something unexpected went wrong!'});
        else {
            const logData = {
                business_id: req.businessId,
                employee_id: req.employeeId,
                deal_id: dealData.id,
                type: 3,
                content: 'Deal claimed'
            }
            this.logsModel.add(req.pool, logData);

            const notificationData = {
                title: 'Your deal was claimed',
                content: `Deal: ${result.title} was claimed by an employee`,
                priority: 0,
                type: 2
            }

            this.notificationModel.addNotification(req.pool, result.deal_opener, notificationData);
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
            return res.status(400).json({error: 'Something unexpected went wrong!'});
        else {
            const logData = {
                business_id: req.businessId,
                employee_id: req.employeeId,
                deal_id: dealData.id,
                type: 3,
                content: 'Deal closed'
            }
            this.logsModel.add(req.pool, logData);
            if(dealData.status === 2) {
                this.targetModel.addProgress(req.pool, req.employeeId, 1);

                const badges = await this.badgesModel.checkDealClosed(req.pool, req.employeeId);
                if(badges.length > 0) {
                    const notificationData = {
                        title: 'You earned new badges!',
                        content: `You have earned new badges: ${badges.map(badge => badge).join(', ')}`,
                        priority: 0,
                        type: 5
                    }

                    this.notificationModel.addNotification(req.pool, req.employeeId, notificationData);
                }
            }
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

    update = async (req, res) => {
        const dealData = req.body;
        if(!dealData.id) {
            return res.status(400).json({error: 'Deal ID is required'});
        }

        if(!dealData.title || !dealData.description || !dealData.due_date || !dealData.expenses || !dealData.customer_budget) {
            return res.status(400).json({error: 'Deal title, description, due_date, expenses and customer_budget are required'});
        }

        const result = await this.dealModel.update(req.pool, dealData);
        if(!result) {
            return res.status(400).json({error: 'Something unexpected went wrong'});
        }
        else {
            const logData = {
                business_id: req.businessId,
                employee_id: req.employeeId,
                deal_id: dealData.id,
                type: 3,
                content: 'Deal updated'
            }
            this.logsModel.add(req.pool, logData);
        }
        res.json(result);
    }

    delete = async (req, res) => {
        const deal_id = req.params.id;
        if(!deal_id) {
            return res.status(400).json({error: 'Deal ID is required'});
        }

        const deal = await this.dealModel.getById(req.pool, deal_id);

        if(!deal.id) {
            return res.status(400).json({error: 'Deal not found'});
        }

        const result = await this.dealModel.delete(req.pool, deal_id);
        if(!result) {
            return res.status(400).json({error: 'Something unexpected went wrong'});
        }
        else {
            const logData = {
                business_id: req.businessId,
                employee_id: req.employeeId,
                type: 3,
                content: `Deal ${deal.title} (ID: ${deal_id}) was deleted`
            }
            this.logsModel.add(req.pool, logData);
        }
        res.json(result);
    }

}


export default new DealController();
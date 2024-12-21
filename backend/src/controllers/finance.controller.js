import FinanceModel from "../models/finance.model.js";
import LogsModel from "../models/logs.model.js";
import TargetModel from "../models/target.model.js";
import BadgesModel from "../models/badges.model.js";
import NotificationModel from "../models/notification.model.js";


class FinanceController {
    constructor() {
        this.financeModel = new FinanceModel();
        this.logsModel = new LogsModel();
        this.targetModel = new TargetModel();
        this.badgesModel = new BadgesModel();
        this.notificationModel = new NotificationModel();
    }

    // Please use arrow function to bind 'this' to the class

    getAll = async (req, res) => {
        const finances = await this.financeModel.getAll(req.pool, req.businessId);
        res.json(finances);
    }

    getAllExpenses = async (req, res) => {
        const finances = await this.financeModel.getAllExpenses(req.pool, req.businessId);
        res.json(finances);
    }

    getAllProfits = async (req, res) => {
        const finances = await this.financeModel.getAllProfits(req.pool, req.businessId);
        res.json(finances);
    }

    getByDealId = async (req, res) => {
        const finances = await this.financeModel.getByDealId(req.pool, req.params.id);
        res.json(finances);
    }

    getById = async (req, res) => {
        const finance = await this.financeModel.getById(req.pool, req.params.id);
        res.json(finance);
    }

    add = async (req, res) => {
        const financeData = req.body;
        if(financeData.amount === undefined || financeData.description === undefined || financeData.deal_id === undefined || financeData.type === undefined || financeData.payment_method === undefined) {
            return res.status(400).json({error: 'All data are required'});
        }
        if(financeData.amount <= 0) {
            return res.status(400).json({error: 'Amount must be greater than 0, and specify the type.'});
        }
        financeData.business_id = req.businessId;

        const result = await this.financeModel.add(req.pool, financeData);

        if (!result)
            return res.status(400).json({ error: 'Something unexpected went wrong!' });

        const logData = {
            business_id: req.businessId,
            employee_id: req.employeeId,
            deal_id: financeData.deal_id,
            type: 5,
            content: 'A new financial record has been added (' + (financeData.type == 0 ? '-' : '+') + '$' + financeData.amount + ')'
        }
        this.logsModel.add(req.pool, logData);

        if (financeData.type == 1) // only add progress if it's a profit
        {
            this.targetModel.addProgress(req.pool, req.employeeId, 3, financeData.amount);
            const badges = await this.badgesModel.checkRevenue(req.pool, req.employeeId);
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

        const notificationData2 = {
            title: 'New Financial Record Added',
            content: `A new financial record has been added (${(financeData.type == 0 ? '-' : '+')}$${financeData.amount})`,
            type: 6,
            priority: 1
        }
        this.notificationModel.addNotificationToManager(req.pool, req.businessId, notificationData2);

        res.json(result);
    }

    getByDealIdSummary = async (req, res) => {
        const finances = await this.financeModel.getByDealIdSummary(req.pool, req.params.id);
        res.json(finances);
    }

    getProfitsPerDate = async (req, res) => {
        const finances = await this.financeModel.getProfitsPerDate(req.pool, req.businessId);
        res.json(finances);
    }

    getSummaryForEmployee = async (req, res) => {
        const finances = await this.financeModel.getSummaryForEmployee(req.pool, req.employeeId);
        res.json(finances);
    }

}


export default FinanceController;
import FinanceModel from "../models/finance.model.js";
import LogsModel from "../models/logs.model.js";


class FinanceController {
    constructor() {
        this.financeModel = new FinanceModel();
        this.logsModel = new LogsModel();
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

        res.json(result);
    }

    getByDealIdSummary = async (req, res) => {
        const finances = await this.financeModel.getByDealIdSummary(req.pool, req.params.id);
        res.json(finances);
    }


}


export default FinanceController;
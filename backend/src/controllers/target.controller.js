import TargetModel from "../models/target.model.js";


class TargetController {
    constructor() {
        this.targetModel = new TargetModel();
    }

    // Please use arrow function to bind 'this' to the class

    getAll = async (req, res) => {
        const targets = await this.targetModel.getAll(req.pool, req.businessId);
        res.json(targets);
    }

    getAllActive = async (req, res) => {
        const targets = await this.targetModel.getAllActive(req.pool, req.businessId);
        res.json(targets);
    }

    getAllUpcoming = async (req, res) => {
        const targets = await this.targetModel.getAllUpcoming(req.pool, req.businessId);
        res.json(targets);
    }

    getAllFinished = async (req, res) => {
        const targets = await this.targetModel.getAllFinished(req.pool, req.businessId);
        res.json(targets);
    }

    getAllByEmployee = async (req, res) => {
        const targets = await this.targetModel.getAllByEmployee(req.pool, req.params.id);
        res.json(targets);
    }

    getAllByEmployeeActive = async (req, res) => {
        const targets = await this.targetModel.getAllByEmployeeActive(req.pool, req.params.id);
        res.json(targets);
    }

    getAllByEmployeeUpcoming = async (req, res) => {    
        const targets = await this.targetModel.getAllByEmployeeUpcoming(req.pool, req.params.id);
        res.json(targets);
    }

    getAllByEmployeeFinished = async (req, res) => {
        const targets = await this.targetModel.getAllByEmployeeFinished(req.pool, req.params.id);
        res.json(targets);
    }
    
    getById = async (req, res) => {
        const target = await this.targetModel.getById(req.pool, req.params.id);
        res.json(target);
    }

    add = async (req, res) => {
        const targetData = req.body;
        
        if(targetData.type === undefined || targetData.goal === undefined || targetData.deadline === undefined || targetData.description === undefined || targetData.employee_id === undefined || targetData.start_date === undefined) {
            return res.status(400).json({error: 'All data are required'});
        }

        const result = await this.targetModel.add(req.pool, targetData);
        res.json(result);
    }

    addForMultipleEmployees = async (req, res) => {
        const targetData = req.body;
        
        if(targetData.type === undefined || targetData.goal === undefined || targetData.deadline === undefined || targetData.description === undefined || targetData.employee_ids === undefined || targetData.start_date === undefined) {
            return res.status(400).json({error: 'All data are required'});
        }

        if(targetData.employee_ids.length === 0) {
            return res.status(400).json({error: 'At least one employee is required'});
        }

        const result = await this.targetModel.addForMultipleEmployees(req.pool, targetData);
        res.json(result);
    }

    edit = async (req, res) => {
        const targetData = req.body;
        
        if(targetData.id === undefined) {
            return res.status(400).json({error: 'Target ID is required'});
        }
        if(targetData.type === undefined || targetData.goal === undefined || targetData.deadline === undefined || targetData.description === undefined || targetData.employee_id === undefined || targetData.start_date === undefined) {
            return res.status(400).json({error: 'All data are required'});
        }

        const result = await this.targetModel.edit(req.pool, targetData);
        res.json(result);
    }

}

export default TargetController;
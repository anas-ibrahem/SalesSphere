import TargetModel from "../models/target.model.js";
import LogsModel from "../models/logs.model.js";
import NotificationModel from "../models/notification.model.js";
import EmployeeModel from "../models/employee.model.js";


class TargetController {
    constructor() {
        this.targetModel = new TargetModel();
        this.logsModel = new LogsModel();
        this.notificationModel = new NotificationModel();
        this.employeeModel = new EmployeeModel({});
    }

    // Please use arrow function to bind 'this' to the class

    getAll = async (req, res) => {
        const emp = await this.employeeModel.getById(req.pool, req.employeeId);
        if(emp.role === 2) { // manager
            const targets = await this.targetModel.getAll(req.pool, req.businessId);
            return res.json(targets);
        }
        const targets = await this.targetModel.getAllByEmployee(req.pool, req.employeeId);
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
        const emp = await this.employeeModel.getById(req.pool, req.params.id);
        if(emp.role === 2) { // manager
            const targets = await this.targetModel.getAllActive(req.pool, req.businessId);
            return res.json(targets);
        }
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
        if(!result.error) {
            const logData = {
                business_id: req.businessId,
                employee_id: targetData.employee_id,
                target_id: result.id,
                type: 4,
                content: 'A new target has been assigned'
            }
            this.logsModel.add(req.pool, logData);

            const notificationData = {
                title: 'New Target Assigned',
                content: `The target "${targetData.description}" has been assigned to you.`,
                type: 4,
                priority: 1
            }
            this.notificationModel.addNotification(req.pool, targetData.employee_id, notificationData);
        }
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
        
        if(!result.error) {
            const logData = {
                business_id: req.businessId,
                target_id: result.id,
                type: 4,
                content: 'A new target has been assigned to multiple employees'
            }
            this.logsModel.add(req.pool, logData);

            const notificationData = {
                title: 'New Target Assigned',
                content: `The target "${targetData.description}" has been assigned to you.`,
                type: 4,
                priority: 1
            }
            this.notificationModel.addNotificationToMultiple(req.pool, targetData.employee_ids, notificationData);
        }

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

        if(!result.error) {
            const logData = {
                business_id: req.businessId,
                target_id: targetData.id,
                type: 4,
                content: 'Target has been updated'
            }
            this.logsModel.add(req.pool, logData);
        }
        res.json(result);
    }

}

export default TargetController;
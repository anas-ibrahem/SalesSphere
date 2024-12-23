import EmployeeModel from "../models/employee.model.js";
import bcypt from 'bcryptjs';
import validator from 'validator';
import LogsModel from "../models/logs.model.js";
import NotificationModel from "../models/notification.model.js";


class EmployeeController {
    constructor() {
        this.employeeModel = new EmployeeModel({});
        this.logsModel = new LogsModel();
        this.notificationModel = new NotificationModel();
    }

    // Please use arrow function to bind 'this' to the class

    getAll = async (req, res) => {
        const emps = await this.employeeModel.getAll(req.pool, req.businessId);
        res.json(emps);
    }

    getById = async (req, res) => {
        const emp = await this.employeeModel.getById(req.pool, req.params.id, req.businessId);
        res.json(emp);
    }

    register = async (req, res) => {
        const empData = req.body;

        if(empData.email === undefined || !validator.isEmail(empData.email)) {
            return res.status(400).json({error: 'Email is required'});
        }

        if(empData.first_name === undefined || empData.last_name === undefined || empData.phone_number === undefined || empData.hire_date === undefined || empData.birth_date === undefined || empData.role === undefined) {
            return res.status(400).json({error: 'All fields are required'});
        }

        if(empData.password === undefined) {
            return res.status(400).json({error: 'Password is required'});
        }

        if(empData.first_name.trim() === '' || empData.last_name.trim() === '' || empData.email.trim() === '' || empData.phone_number.trim() === '' || empData.hire_date.trim() === '' || empData.birth_date.trim() === '' || empData.password.trim() === '') {
            return res.status(400).json({error: 'All fields are required'});
        }

        empData.hashed_password = await bcypt.hash(empData.password, 10);
        if(empData.password) {
            delete empData.password;
        }

        const businessId = req.businessId;

        empData.business_id = businessId;
        
        const newEmployee = new EmployeeModel(empData);
        const result = await newEmployee.register(req.pool, 1);
        if(result == -1) {
            return res.status(400).json({error: 'Email already exists'});
        }
        if(result.employeeId) {
            const logData = {
                business_id: req.businessId,
                employee_id: result.employeeId,
                type: 1,
                content: 'A new employee has been added'
            }
            this.logsModel.add(req.pool, logData);

            const notificationData = {
                title: 'New Employee Added',
                content: `New employee ${empData.first_name} ${empData.last_name} has been added`,
                priority: 0,
                type: 0
            }

            this.notificationModel.addNotificationToAll(req.pool, req.businessId, notificationData);

            const notificationData2 = {
                title: 'Welcome to the team!',
                content: `You have been added to our business`,
                priority: 0,
                type: 0
            }

            this.notificationModel.addNotification(req.pool, result.employeeId, notificationData2);
        }
        res.json(result);
    }
    
    updateMyProfile = async (req, res) => {
        const empData = req.body;
        if(!validator.isEmail(empData.email)) {
            return res.status(400).json({error: 'Invalid email address'});
        }
        if(empData.first_name === undefined || empData.last_name === undefined || empData.email === undefined || empData.phone_number === undefined) {
            return res.status(400).json({error: 'All fields are required'});
        }

        if(empData.first_name.trim() === '' || empData.last_name.trim() === '' || empData.email.trim() === '' || empData.phone_number.trim() === '') {
            return res.status(400).json({error: 'All fields are required'});
        }

        const result = await this.employeeModel.updateMyProfile(req.pool, req.employeeId, empData);
        if (result) {
            const logData = {
                business_id: req.businessId,
                employee_id: req.employeeId,
                type: 1,
                content: 'Employee profile updated'
            }
            this.logsModel.add(req.pool, logData);

            res.json({message: 'Profile updated successfully'});
        } else {
            res.status(400).json({ error: 'Email already exists' });
        }
    }

    updateEmployeeProfile = async (req, res) => {
        const empData = req.body;
        if(!validator.isEmail(empData.email)) {
            return res.status(400).json({error: 'Invalid email address'});
        }
        if(empData.first_name === undefined || empData.last_name === undefined || empData.email === undefined || empData.phone_number === undefined || empData.hire_date === undefined || empData.birth_date === undefined || empData.role === undefined) {
            return res.status(400).json({error: 'All fields are required'});
        }

        if(empData.first_name.trim() === '' || empData.last_name.trim() === '' || empData.email.trim() === '' || empData.phone_number.trim() === '' || empData.hire_date.trim() === '' || empData.birth_date.trim() === '') {
            return res.status(400).json({error: 'All fields are required'});
        }

        if(req.params.id === undefined || isNaN(req.params.id)) {
            return res.status(400).json({error: 'A numeric employee ID is required'});
        }

        const result = await this.employeeModel.updateEmployeeProfile(req.pool, req.params.id, empData);
        if (result) {
            const logData = {
                business_id: req.businessId,
                employee_id: req.params.id,
                type: 1,
                content: 'Employee profile updated By Manager'
            }
            this.logsModel.add(req.pool, logData);

            res.json({message: 'Profile updated successfully'});
        } else {
            res.status(400).json({ error: 'Email already exists' });
        }
    }

    getSummary = async (req, res) => {
        const id = req.params.id;
        const summary = await this.employeeModel.getSummary(req.pool, id, req.businessId);
        res.json(summary);
    }

    getAllSummary = async (req, res) => {
        const summary = await this.employeeModel.getAllSummary(req.pool, req.businessId);
        res.json(summary);
    }

    getTopEmployees = async (req, res) => {
        const employees = await this.employeeModel.getTopEmployees(req.pool, req.businessId);
        res.json(employees);
    }
    getMyRank = async (req, res) => {
        const role = req.params.role;
        if(role === undefined) {
            return res.status(400).json({error: 'Role is required'});
        }
        const rank = await this.employeeModel.getMyRank(req.pool, req.employeeId, role);
        res.json(rank);
    }

    deleteEmployee = async (req, res) => {
        const id = req.params.id;
        if(id === undefined) {
            return res.status(400).json({error: 'Employee ID is required'});
        }

        const employee = await this.employeeModel.getById(req.pool, id, req.businessId);

        if(!employee.id) {
            return res.status(400).json({error: 'Employee not found'});
        }

        const result = await this.employeeModel.deleteEmployee(req.pool, id);
        if(result) {
            const logData = {
                business_id: req.businessId,
                type: 1,
                content: `Employee ${employee.first_name} ${employee.last_name} (ID: ${id}) was deleted`
            }
            this.logsModel.add(req.pool, logData);
        }
        res.json(result);
    }
}


export default EmployeeController;
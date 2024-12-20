import EmployeeModel from "../models/employee.model.js";
import bcypt from 'bcryptjs';
import validator from 'validator';
import LogsModel from "../models/logs.model.js";


class EmployeeController {
    constructor() {
        this.employeeModel = new EmployeeModel({});
        this.logsModel = new LogsModel();
    }

    // Please use arrow function to bind 'this' to the class

    getAll = async (req, res) => {
        const emps = await this.employeeModel.getAll(req.pool, req.businessId);
        res.json(emps);
    }

    getById = async (req, res) => {
        const emp = await this.employeeModel.getById(req.pool, req.params.id);
        res.json(emp);
    }

    register = async (req, res) => {
        const empData = req.body;

        if(!empData.email || !validator.isEmail(empData.email)) {
            return res.status(400).json({error: 'Email is required'});
        }

        if(!empData.first_name || !empData.last_name || !empData.phone_number || !empData.hire_date || !empData.birth_date || !empData.role) {
            return res.status(400).json({error: 'All fields are required'});
        }

        if(!empData.password) {
            return res.status(400).json({error: 'Password is required'});
        }

        empData.hashed_password = await bcypt.hash(empData.password, 10);
        if(empData.password) {
            delete empData.password;
        }

        const businessId = req.businessId;

        console.log('businessId:', businessId);
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
        }
        res.json(result);
    }
    
    updateMyProfile = async (req, res) => {
        const empData = req.body;
        if(!validator.isEmail(empData.email)) {
            return res.status(400).json({error: 'Invalid email address'});
        }
        if(!empData.first_name || !empData.last_name || !empData.email || !empData.phone_number || !empData.address || !empData.hire_date || !empData.birth_date || !empData.role) {
            return res.status(400).json({error: 'All fields are required'});
        }

        const result = await this.employeeModel.updateProfile(req.pool, req.employeeId, empData);
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
        if(!empData.first_name || !empData.last_name || !empData.email || !empData.phone_number || !empData.address || !empData.hire_date || !empData.birth_date || !empData.role) {
            return res.status(400).json({error: 'All fields are required'});
        }

        if(!req.params.id || isNaN(req.params.id)) {
            return res.status(400).json({error: 'A numeric employee ID is required'});
        }

        const result = await this.employeeModel.updateProfile(req.pool, req.params.id, empData);
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
        const summary = await this.employeeModel.getSummary(req.pool, id);
        res.json(summary);
    }

    getAllSummary = async (req, res) => {
        const summary = await this.employeeModel.getAllSummary(req.pool, req.businessId);
        res.json(summary);
    }
}


export default EmployeeController;
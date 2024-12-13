import BusinessModel from '../models/business.model.js';
import bcypt from 'bcryptjs';
import validator from 'validator';
import EmployeeModel from '../models/employee.model.js';


class BusinessController {
    constructor() {
        this.BusinessModel = new BusinessModel({});
    }

    // Please use arrow function to bind 'this' to the class

    getAll = async (req, res) => {
        const emps = await this.BusinessModel.getAll(req.pool);
        res.json(emps);
    }

    getById = async (req, res) => {
        const emp = await this.BusinessModel.getById(req.pool, req.params.id);
        res.json(emp);
    }

    register = async (req, res) => {
        const data = req.body;
        if(!data.business_data) {
            return res.status(400).json({error: 'Business data is required'});
        }
        if(!data.employee_data) {
            return res.status(400).json({error: 'Business Manager data is required'});
        }
        const businessData = data.business_data;
        const empData = data.employee_data;

        if(!businessData.email || !validator.isEmail(businessData.email)) {
            return res.status(400).json({error: 'Business: Email is required'});
        }
        if(!businessData.name || !businessData.phone_number || !businessData.country || !businessData.industry) {
            return res.status(400).json({error: 'Business: All fields are required'});
        }

        if(!empData.email || !validator.isEmail(empData.email)) {
            return res.status(400).json({error: 'Employee: Email is required'});
        }
        if(!empData.first_name || !empData.last_name || !empData.phone_number || !empData.address || !empData.birth_date || !empData.role) {
            return res.status(400).json({error: 'Employee: All fields are required'});
        }

        if(!empData.password) {
            return res.status(400).json({error: 'Password is required'});
        }

        empData.hashed_password = await bcypt.hash(empData.password, 10);
        if(empData.password) {
            delete empData.password;
        }
        const newEmployee = new EmployeeModel(empData);
        const business = new BusinessModel(businessData, newEmployee);
        const result = await business.register(req.pool);
        if(result.error) {
            return res.status(400).json({error: result.error});
        }
        res.json(result);
    }
}


export default BusinessController;
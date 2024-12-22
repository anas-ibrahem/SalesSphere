import BusinessModel from '../models/business.model.js';
import bcypt from 'bcryptjs';
import validator from 'validator';
import EmployeeModel from '../models/employee.model.js';
import LogsModel from '../models/logs.model.js';


class BusinessController {
    constructor() {
        this.BusinessModel = new BusinessModel({});
        this.logsModel = new LogsModel();
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

        if(businessData.name.trim() === '' || businessData.phone_number.trim() === '' || businessData.country.trim() === '' || businessData.industry.trim() === '') {
            return res.status(400).json({error: 'All fields are required'});
        }

        if(!businessData.business_logo_url || !businessData.managerid_card_url || !businessData.manager_personal_photo_url) {
            return res.status(400).json({error: 'Business: All files are required'});
        }

        if(businessData.business_logo_url.trim() === '' || businessData.managerid_card_url.trim() === '' || businessData.manager_personal_photo_url.trim() === '') {
            return res.status(400).json({error: 'All files are required'});
        }

        if(!empData.email || !validator.isEmail(empData.email)) {
            return res.status(400).json({error: 'Employee: Email is required'});
        }
        
        if(!empData.first_name || !empData.last_name || !empData.phone_number || !empData.address || !empData.birth_date) {
            return res.status(400).json({error: 'Employee: All fields are required'});
        }

        if(empData.first_name.trim() === '' || empData.last_name.trim() === '' || empData.phone_number.trim() === '' || empData.address.trim() === '' || empData.birth_date.trim() === '') {
            return res.status(400).json({error: 'Employee: All fields are required'});
        }

        if(!empData.password || empData.password.trim() === '') {
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
        else {
            const logData = {
                business_id: result.businessId,
                type: 0,
                content: 'Business registered, Welcome to Sales Sphere!'
            }
            this.logsModel.add(req.pool, logData);
        }
        res.json(result);
    }

    update = async (req, res) => {
        // only update phone_number, city, website_url, street, business_logo_url
        const businessData = req.body;

        if(!businessData.phone_number || !businessData.city || !businessData.street || !businessData.website_url || !businessData.business_logo_url) {
            return res.status(400).json({error: 'All fields are required'});
        }

        if(businessData.phone_number.trim() === '' || businessData.city.trim() === '' || businessData.street.trim() === '' || businessData.website_url.trim() === '' || businessData.business_logo_url.trim() === '') {
            return res.status(400).json({error: 'All fields are required'});
        }

        const result = await this.BusinessModel.update(req.pool, req.businessId, businessData);
        if(!result.error) {
            const logData = {
                business_id: req.businessId,
                type: 0,
                content: 'Business information updated'
            }
            this.logsModel.add(req.pool, logData);
        }
        res.json(result);
    }

    getSummary = async (req, res) => {
        const summary = await this.BusinessModel.getSummary(req.pool, req.businessId);
        res.json(summary);
    }
}


export default BusinessController;
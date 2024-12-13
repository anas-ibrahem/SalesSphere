import EmployeeModel from "../models/employee.model.js";
import bcypt from 'bcryptjs';
import validator from 'validator';


class EmployeeController {
    constructor() {
        this.employeeModel = new EmployeeModel({});
    }

    // Please use arrow function to bind 'this' to the class

    getAll = async (req, res) => {
        const emps = await this.employeeModel.getAll(req.pool);
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

        if(!empData.first_name || !empData.last_name || !empData.phone_number || !empData.address || !empData.birth_date || !empData.role || !empData.business_id) {
            return res.status(400).json({error: 'All fields are required'});
        }

        if(!empData.password) {
            return res.status(400).json({error: 'Password is required'});
        }

        empData.hashed_password = await bcypt.hash(empData.password, 10);
        if(empData.password) {
            delete empData.password;
        }
        const newEmployee = new EmployeeModel(empData);
        const result = await newEmployee.register(req.pool);
        if(result == -1) {
            return res.status(400).json({error: 'Email already exists'});
        }
        res.json(result);
    }
}


export default EmployeeController;
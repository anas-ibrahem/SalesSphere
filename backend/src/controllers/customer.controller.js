import CustomerModel from "../models/customer.model.js";
import bcypt from 'bcryptjs';
import validator from 'validator';
import LogsModel from "../models/logs.model.js";
import TargetModel from "../models/target.model.js";


class CustomerController {
    constructor() {
        this.customerModel = new CustomerModel({});
        this.logsModel = new LogsModel();
        this.targetModel = new TargetModel();
    }

    // Please use arrow function to bind 'this' to the class

    getAll = async (req, res) => {
        const emps = await this.customerModel.getAll(req.pool, req.businessId);
        res.json(emps);
    }

    getById = async (req, res) => {
        const emp = await this.customerModel.getById(req.pool, req.params.id);
        res.json(emp);
    }

    add = async (req, res) => {
        const customerData = req.body;

        if(!customerData.email || !validator.isEmail(customerData.email)) {
            return res.status(400).json({error: 'Email is required'});
        }

        if(!customerData.name || !customerData.phone_number || !customerData.type || !customerData.lead_source || !customerData.preferred_contact_method) {
            return res.status(400).json({error: 'All fields are required'});
        }

  
        const businessId = req.businessId;

        customerData.business_id = businessId;
        customerData.added_by = req.employeeId;
        
        const newCustomer = new CustomerModel(customerData);
        const result = await newCustomer.add(req.pool);
        if(!result.error) {
            const logData = {
                business_id: req.businessId,
                employee_id: req.employeeId,
                customer_id: result.id,
                type: 2,
                content: 'A new customer has been added'
            }
            this.logsModel.add(req.pool, logData);
            this.targetModel.addProgress(req.pool, req.employeeId, 2);
        }
        res.json(result);
    }

    getCustomersPerDate = async (req, res) => {
        const customers = await this.customerModel.getCustomersPerDate(req.pool, req.businessId);
        res.json(customers);
    }

    getTopCustomersByRevenue = async (req, res) => {
        const customers = await this.customerModel.getTopCustomersByRevenue(req.pool, req.businessId);
        res.json(customers);
    }
    update = async (req, res) => {
        const customerData = req.body;
        //const customerId = req.params.id;
        //const businessId = req.businessId;
        //customerData.business_id = businessId;
        //customerData.id = customerId;
        if(!customerData.email || !validator.isEmail(customerData.email)) {
            return res.status(400).json({error: 'Invalid email address'});
        }

        if(!customerData.name || !customerData.phone_number || !customerData.type || !customerData.lead_source || !customerData.preferred_contact_method) {
            return res.status(400).json({error: 'All fields are required'});
        }
        
        const customer = new CustomerModel(customerData);
        const result = await customer.update(req.pool);
        if(!result.error) {
            const logData = {
                business_id: req.businessId,
                employee_id: req.employeeId,
                customer_id: result.id,
                type: 2,
                content: 'Customer was updated'
            }
            this.logsModel.add(req.pool, logData);
        }
        res.json(result);
    }
}


export default CustomerController;
import CustomerModel from "../models/customer.model.js";
import bcypt from 'bcryptjs';
import validator from 'validator';


class CustomerController {
    constructor() {
        this.customerModel = new CustomerModel({});
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

        console.log('businessId:', businessId);
        customerData.business_id = businessId;
        customerData.added_by = req.employeeId;
        
        const newCustomer = new CustomerModel(customerData);
        const result = await newCustomer.add(req.pool);
        if(result == -1) {
            return res.status(400).json({error: 'Failed to add customer'});
        }
        res.json(result);
    }
}


export default CustomerController;
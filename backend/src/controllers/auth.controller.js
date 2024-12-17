import EmployeeModel from "../models/employee.model.js";
import bcypt from 'bcryptjs';
import validator from 'validator';
import jwt from 'jsonwebtoken';

class AuthController {
    constructor() {
        this.employeeModel = new EmployeeModel({});
    }

    login = async (req, res) => {
        const empData = req.body;

        if(!empData.email || !empData.password) {
            return res.status(400).json({error: 'Email and password are required'});
        }

        const emp = await this.employeeModel.getByEmailForAuth(req.pool, empData.email);
        if(emp && emp.hashed_password) {
            const match = await bcypt.compare(empData.password, emp.hashed_password);
            if(match) {
                if(emp.verified === 0) 
                    return res.status(400).json({error: 'Account not verified, Please wait until an adminstrator approves your account', status: 0});
                else if(emp.verified === 2)
                    return res.status(400).json({error: 'Account suspended', status: 2});

                const token = jwt.sign({id: emp.id, businessId: emp.business_id}, process.env.JWT_SECRET, {expiresIn: '30d'});
                return res.json({token});
            }
        }
        res.status(400).json({error: 'Invalid email or password'});
    }

    verifyToken = async (req, res, next) => {
        const token = req.headers['authorization'];
        if(!token) {
            return res.status(401).json({error: 'Not authorized', 'session_end': false});
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.employeeId = decoded.id;
            req.businessId = decoded.businessId;
            next();
        } catch (error) {
            res.status(401).json({error: 'Not authorized', 'session_end': true});
        }
    }
    me = async (req, res) => {
        if(!req.employeeId) {
            return res.status(400).json({error: 'Invalid employee ID'});
        }

        const emp = await this.employeeModel.getById(req.pool, req.employeeId);
        if(emp.verified === 0) 
            return res.status(400).json({error: 'Account not verified, Please wait until an adminstrator approves your account', status: 0});
        else if(emp.verified === 2)
            return res.status(400).json({error: 'Account suspended', status: 2});
        res.json(emp);
    }
}


export default AuthController;
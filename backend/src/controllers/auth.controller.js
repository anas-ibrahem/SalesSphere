import EmployeeModel from "../models/employee.model.js";
import bcypt from 'bcryptjs';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import { hash } from "crypto";
import sendMail from "../utils/mailsender.js";

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

    changePassword = async (req, res) => {
        const empData = req.body;
        if(!empData.currentPassword || !empData.newPassword || !empData.confirmPassword) {
            return res.status(400).json({error: 'All fields are required'});
        }

        if(!validator.isStrongPassword(empData.newPassword)) {
            return res.status(400).json({error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character'});
        }

        if(empData.newPassword !== empData.confirmPassword) {
            return res.status(400).json({error: 'Passwords do not match'});
        }

        const emp = await this.employeeModel.getByIdForAuth(req.pool, req.employeeId);
        
        
        if(emp && emp.hashed_password) {
            const match = await bcypt.compare(empData.currentPassword, emp.hashed_password);
            if(match) {
                const hashedPassword = await bcypt.hash(empData.newPassword, 10);
                await this.employeeModel.updatePassword(req.pool, req.employeeId, hashedPassword);
                return res.json({message: 'Password updated successfully'});
            }
        }
        res.status(400).json({error: 'Invalid current password'});
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

    forgotPassword = async (req, res) => {
        const empData = req.body;
        if(!empData.email) {
            return res.status(400).json({error: 'Email is required'});
        }

        const emp = await this.employeeModel.getByEmailForAuth(req.pool, empData.email);
        if(emp && emp.email) {
            const code = Math.floor(100000 + Math.random() * 899999);
            await this.employeeModel.setPwdResetCode(req.pool, emp.id, code);
            sendMail(emp.email, 'Sales Sphere Reset Password', `Hi ${emp.first_name},<br>Your password reset code is <strong>${code}</strong> <br>If you did not request this, please ignore this email.`);
            return res.json({message: 'Verification code sent to your email, it expires in 1 hour'});
        }
        res.status(400).json({error: 'Invalid email'});
    }

    resetPassword = async (req, res) => {
        const empData = req.body;
        if(!empData.email || !empData.code || !empData.newPassword || !empData.confirmPassword) {
            return res.status(400).json({error: 'All fields are required'});
        }

        if(empData.newPassword !== empData.confirmPassword) {
            return res.status(400).json({error: 'Passwords do not match'});
        }

        const emp = await this.employeeModel.getByEmailForAuth(req.pool, empData.email);
        const reset_code = await this.employeeModel.getPwdResetCode(req.pool, emp.id);

        if(!reset_code.code || reset_code.code !== empData.code) {
            return res.status(400).json({error: 'Invalid reset code'});
        }
        if(reset_code.is_expired) {
            return res.status(400).json({error: 'Reset code expired, please request a new one'});
        }

        if(emp && reset_code.code === empData.code) {
            const hashedPassword = await bcypt.hash(empData.newPassword, 10);
            await this.employeeModel.updatePassword(req.pool, emp.id, hashedPassword);
            await this.employeeModel.deletePwdResetCode(req.pool, emp.id);
            return res.json({message: 'Password reset successfully'});
        }
        res.status(400).json({error: 'Invalid email or code'});
    }

}


export default AuthController;
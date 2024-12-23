import AdminModel from "../models/admin.model.js";
import bcypt from 'bcryptjs';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import LogsModel from "../models/logs.model.js";


class AdminController {
    constructor() {
        this.adminModel = new AdminModel({});
        this.logsModel = new LogsModel();
    }

    // Please use arrow function to bind 'this' to the class

    getAll = async (req, res) => {
        const admins = await this.adminModel.getAll(req.pool);
        res.json(admins);
    }

    getById = async (req, res) => {
        const admin = await this.adminModel.getById(req.pool, req.params.id);
        res.json(admin);
    }


    login = async (req, res) => {
            const adminData = req.body;
    
            if(!adminData.username || !adminData.password) {
                return res.status(400).json({error: 'email/username and password are required'});
            }
    
            const admin = await this.adminModel.getByEmailForAuth(req.pool, adminData.username);
            if(admin && admin.hashed_password) {
                const match = await bcypt.compare(adminData.password, admin.hashed_password);
                if(match) {
                    const token = jwt.sign(admin, process.env.JWT_SECRET, {expiresIn: '30d'});
                    return res.json({token});
                }
            }
            res.json({error: 'Invalid email/username or password'});
    }

    verifyToken = async (req, res, next) => {
            const token = req.headers['authorization'];
            if(!token) {
                return res.status(401).json({error: 'Not authorized', 'session_end': false});
            }
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.admin = decoded;
                next();
            } catch (error) {
                res.status(401).json({error: 'Not authorized', 'session_end': true});
            }
    }

    me = async (req, res) => {
        if(!req.admin || !req.admin.id) {
            return res.status(400).json({error: 'Invalid admin ID'});
        }
        
        const admin = await this.adminModel.getById(req.pool, req.admin.id);
        res.json(admin);
    }

    addAdmin = async (req, res) => {
        if(!req.admin || req.admin.privilege !== 1) {
            return res.status(400).json({error: 'Not authorized'});
        }
        const adminData = req.body;

        if(!adminData || typeof adminData !== 'object') {
            return res.status(400).json({error: 'Invalid admin data'});
        }

        if(adminData.username === undefined || adminData.username.trim() === '') {
            return res.status(400).
            json({error: 'Username is required'});
        }

        if(!adminData.email || !adminData.password || adminData.email.trim() === '' || adminData.password.trim() === '') {
            return res.status(400).json({error: 'Email and password are required'});
        }

        if(!validator.isEmail(adminData.email)) {
            return res.status(400).json({error: 'Invalid email format'});
        }

        const hashedPassword = await bcypt.hash(adminData.password, 10);
        adminData.hashed_password = hashedPassword;
        const admin = await this.adminModel.addAdmin(req.pool, adminData);
        res.json(admin);
    }

    updateAdmin = async (req, res) => {
        if(!req.admin || req.admin.privilege !== 1) {
            return res.status(400).json({error: 'Not authorized'});
        }
        const adminData = req.body;

        if(!adminData || typeof adminData !== 'object') {
            return res.status(400).json({error: 'Invalid admin data'});
        }

        if(adminData.email === undefined || adminData.email.trim() === '') {
            return res.status(400).json({error: 'Email is required'});
        }

        if(!validator.isEmail(adminData.email)) {
            return res.status(400).json({error: 'Invalid email format'});
        }

        if(adminData.password && adminData.password.length > 0) {
            if(adminData.password.replace(/\s/g, '').length > 0) {
                const hashedPassword = await bcypt.hash(adminData.password, 10);
                adminData.hashed_password = hashedPassword;
            }
        }

        const admin = await this.adminModel.updateAdmin(req.pool, adminData);
        res.json(admin);
    }

    deleteAdmin = async (req, res) => {
        if(!req.admin || req.admin.privilege !== 1) {
            return res.status(400).json({error: 'Not authorized'});
        }
        const adminId = req.params.id;
        const admin = await this.adminModel.getById(req.pool, adminId);
        if(admin.privilege === 1) {
            return res.status(400).json({error: 'Cannot delete super admin'});
        }
        const del = await this.adminModel.deleteAdmin(req.pool, adminId);
        res.json(del);
    }

    getAllBusinessRequests = async (req, res) => {
        const requests = await this.adminModel.getAllBusinessRequests(req.pool);
        res.json(requests);
    }

    acceptBusinessRequest = async (req, res) => {
        const requestId = req.params.id;
        const request = await this.adminModel.acceptBusinessRequest(req.pool, requestId);
        if(request) {
            const logData = {
                business_id: requestId,
                type: 0,
                content: 'Business registration request accepted'
            }
            this.logsModel.add(req.pool, logData);
        }
        res.json(request);
    }

    rejectBusinessRequest = async (req, res) => {
        const requestId = req.params.id;
        const request = await this.adminModel.rejectBusinessRequest(req.pool, requestId);
    
        if(request) {
            const logData = {
                business_id: requestId,
                type: 0,
                content: 'Business registration request rejected'
            }
            this.logsModel.add(req.pool, logData);
        }
        
        res.json(request);
    }


}


export default AdminController;
import AdminModel from "../models/admin.model.js";
import bcypt from 'bcryptjs';
import validator from 'validator';


class AdminController {
    constructor() {
        this.adminModel = new AdminModel({});
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
    
            if(!adminData.email || !adminData.password) {
                return res.status(400).json({error: 'Email and password are required'});
            }
    
            const admin = await this.adminModel.getByEmailForAuth(req.pool, adminData.email);
            if(admin && admin.hashed_password) {
                const match = await bcypt.compare(adminData.password, admin.hashed_password);
                if(match) {
                    const token = jwt.sign(admin, process.env.JWT_SECRET, {expiresIn: '30d'});
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
        const adminData = req.body;

        if(!adminData || typeof adminData !== 'object') {
            return res.status(400).json({error: 'Invalid admin data'});
        }

        if(!adminData.username) {
            return res.status(400).
            json({error: 'Username is required'});
        }

        if(!adminData.email || !adminData.password) {
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
        const adminData = req.body;

        if(!adminData || typeof adminData !== 'object') {
            return res.status(400).json({error: 'Invalid admin data'});
        }

        if(!adminData.username) {
            return res.status(400).json({error: 'Username is required'});
        }

        if(!adminData.email) {
            return res.status(400).json({error: 'Email is required'});
        }

        if(!validator.isEmail(adminData.email)) {
            return res.status(400).json({error: 'Invalid email format'});
        }

        if(adminData.password && adminData.password.length > 0) {
            const hashedPassword = await bcypt.hash(adminData.password, 10);
            adminData.hashed_password = hashedPassword;
        }

        const admin = await this.adminModel.updateAdmin(req.pool, adminData);
        res.json(admin);
    }


}


export default AdminController;
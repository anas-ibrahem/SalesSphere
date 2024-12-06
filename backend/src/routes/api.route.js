import express from 'express';

const router = express.Router();

// import /api/*.js
import employeeRouter from './api/employee.route.js';
import dealRouter from './api/deal.route.js';
import authRouter from './api/auth.route.js';
import AuthController from '../controllers/auth.controller.js';

const authController = new AuthController();

router.use('/employee', authController.verifyToken, employeeRouter);
router.use('/deal', authController.verifyToken, dealRouter);
router.use('/auth', authRouter);


// Export the router
export default router;
import express from 'express';

const router = express.Router();

// import /api/*.js
import employeeRouter from './api/employee.route.js';
import dealRouter from './api/deal.route.js';
import authRouter from './api/auth.route.js';
import businessRouter from './api/business.route.js';
import AuthController from '../controllers/auth.controller.js';
import BusinessController from '../controllers/business.controller.js';

const authController = new AuthController();
const businessController = new BusinessController();

// No authentication required for these routes
// all other files in /routes/api/*.js will require authentication
router.use('/auth', authRouter);
router.post('/business/register', businessController.register);

// routes with authentication required
router.use(authController.verifyToken);
router.use('/employee', employeeRouter);
router.use('/deal', dealRouter);
router.use('/business', businessRouter);
router.get('/me', authController.me);

// Export the router
export default router;
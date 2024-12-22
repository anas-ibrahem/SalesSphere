import express from 'express';

const router = express.Router();

// import /controllers/auth.controller.js
import AuthController from '../../controllers/auth.controller.js';

const authController = new AuthController();

// Define routes for /api/employee
router.post('/login', authController.login); // POST /api/auth/login
router.post('/forgot-password', authController.forgotPassword); // POST /api/auth/forgot-password
router.post('/reset-password', authController.resetPassword); // POST /api/auth/reset-password
router.post('/change-password', authController.verifyToken, authController.changePassword); // POST /api/auth/change-password

export default router;
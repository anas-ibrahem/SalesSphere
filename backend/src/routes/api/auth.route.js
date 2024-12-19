import express from 'express';

const router = express.Router();

// import /controllers/auth.controller.js
import AuthController from '../../controllers/auth.controller.js';

const authController = new AuthController();

// Define routes for /api/employee
router.post('/login', authController.login); // POST /api/auth/login
router.post('/change-password', authController.verifyToken, authController.changePassword); // POST /api/auth/change-password


export default router;
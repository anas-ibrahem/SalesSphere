import express from 'express';

const router = express.Router();

// import /controllers/auth.controller.js
import AuthController from '../../controllers/auth.controller.js';

const authController = new AuthController();

// Define routes for /api/employee
//router.post('/', authController.verifyToken, authController.hello); // POST /api/auth
router.post('/login', authController.login); // POST /api/auth/login
//router.post('/register', authController.register); // POST /api/auth/register


export default router;
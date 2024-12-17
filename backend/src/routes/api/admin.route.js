import express from 'express';

const router = express.Router();

// import /controllers/employee.js
import AdminController from '../../controllers/admin.controller.js';

const adminController = new AdminController();

router.post('/login', adminController.login);

router.use(adminController.verifyToken);

// Define routes for /api/employee
router.get('/', adminController.getAll);

router.get('/:id', adminController.getById);

router.get('/me', adminController.me);

router.post('/', adminController.addAdmin);

router.patch('/', adminController.updateAdmin);



export default router;
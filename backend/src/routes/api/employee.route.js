import express from 'express';

const router = express.Router();

// import /controllers/employee.js
import EmployeeController from '../../controllers/employee.controller.js';

const employeeController = new EmployeeController();

// Define routes for /api/employee
router.get('/', employeeController.getAll);

router.get('/:id', employeeController.getById);

// to register a new employee
router.put('/', employeeController.register);


export default router;
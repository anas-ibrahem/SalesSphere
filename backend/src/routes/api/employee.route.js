import express from 'express';

const router = express.Router();

// import /controllers/employee.js
import EmployeeController from '../../controllers/employee.controller.js';

const employeeController = new EmployeeController();

// Define routes for /api/employee
router.get('/', employeeController.getAll);

router.get('/:id', employeeController.getById);

router.get('/summary/all', employeeController.getAllSummary);
router.get('/summary/:id', employeeController.getSummary);
router.get('/metrics/top', employeeController.getTopEmployees);
router.get('/metrics/rank/:role', employeeController.getMyRank);

// to register a new employee
router.post('/', employeeController.register);

// to update employee profile
router.patch('/', employeeController.updateMyProfile);
router.patch('/:id', employeeController.updateEmployeeProfile);
// should be put instead of patch

// to delete an employee
router.delete('/:id', employeeController.deleteEmployee);

export default router;
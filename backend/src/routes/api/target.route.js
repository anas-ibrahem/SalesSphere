import express from 'express';

const router = express.Router();

// import /controllers/target.js
import TargetController from '../../controllers/target.controller.js';

const targetController = new TargetController();

// Define routes for /api/target
router.get('/', targetController.getAll);
router.get('/active', targetController.getAllActive);
router.get('/upcoming', targetController.getAllUpcoming);
router.get('/finished', targetController.getAllFinished);

router.get('/employee/:id', targetController.getAllByEmployee);
router.get('/employee/:id/active', targetController.getAllByEmployeeActive);
router.get('/employee/:id/upcoming', targetController.getAllByEmployeeUpcoming);
router.get('/employee/:id/finished', targetController.getAllByEmployeeFinished);

router.get('/:id', targetController.getById);
router.post('/', targetController.add);
router.post('/multiple', targetController.addForMultipleEmployees);

router.put('/:id', targetController.edit);


export default router;
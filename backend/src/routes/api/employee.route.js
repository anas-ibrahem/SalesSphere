import express from 'express';

const router = express.Router();

// import /controllers/employee.js
import EmployeeController from '../../controllers/employee.controller.js';


// Define routes for /api/employee
router.get('/', EmployeeController.getAll);

router.post('/', (req, res) => {
    res.send('Add a user');
});

export default router;
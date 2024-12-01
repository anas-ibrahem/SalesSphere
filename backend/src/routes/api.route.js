import express from 'express';

const router = express.Router();

// import /api/*.js
import employeeRouter from './api/employee.route.js';
import dealRouter from './api/deal.route.js';

// Mount the employee router under /employee
router.use('/employee', employeeRouter);
router.use('/deal', dealRouter);


// Export the router
export default router;
import express from 'express';

const router = express.Router();

// import /controllers/employee.js
import BusinessController from '../../controllers/business.controller.js';

const businessController = new BusinessController();

// Define routes for /api/employee
router.get('/', businessController.getAll);

router.get('/:id', businessController.getById);


export default router;
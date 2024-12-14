import express from 'express';

const router = express.Router();

// import /controllers/customer.js
import CustomerController from '../../controllers/customer.controller.js';

const customerController = new CustomerController();

// Define routes for /api/customer
router.get('/', customerController.getAll);

router.get('/:id', customerController.getById);

// to register a new customer
router.put('/', customerController.add);


export default router;
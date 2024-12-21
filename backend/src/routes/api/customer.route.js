import express from 'express';

const router = express.Router();

// import /controllers/customer.js
import CustomerController from '../../controllers/customer.controller.js';

const customerController = new CustomerController();

// Define routes for /api/customer
router.get('/', customerController.getAll);

router.get('/metrics/', customerController.getCustomersPerDate);
router.get('/metrics/revenue', customerController.getTopCustomersByRevenue);
router.get('/metrics/revenue/employee/', customerController.getTopCustomersByRevenueForEmployee);
router.get('/:id', customerController.getById);

// to register a new customer
router.post('/', customerController.add);


// to update a customer
router.put('/', customerController.update);

// to delete a customer
router.delete('/:id', customerController.delete);



export default router;
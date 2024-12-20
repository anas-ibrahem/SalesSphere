import express from 'express';

const router = express.Router();

import FinanceController from '../../controllers/finance.controller.js';

const financeController = new FinanceController();

// Define routes for /api/finance
router.get('/', financeController.getAll);
router.get('/expenses', financeController.getAllExpenses);
router.get('/profits', financeController.getAllProfits);

router.get('/deal/summary/:id', financeController.getByDealIdSummary);
router.get('/deal/:id', financeController.getByDealId);

router.get('/:id', financeController.getById);

// to create a new finance
router.post('/', financeController.add);



export default router;
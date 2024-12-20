import express from 'express';

const router = express.Router();

// import /controllers/deal.js
import DealController from '../../controllers/deal.controller.js';


// Define routes for /api/deal
router.get('/', DealController.getAll);
router.get('/claimed', DealController.getEmployeeClaimedDeals);
router.get('/closed', DealController.getEmployeeClosedDeals);
router.get('/open', DealController.getAllOpenDeals);
router.get('/:id', DealController.getById);

router.get('/employee/:id', DealController.getEmployeeDeals);
router.get('/customer/:id', DealController.getCustomerDeals);




router.post('/', DealController.add);

router.post('/claim', DealController.claim);

router.post('/close', DealController.close);

router.put('/', DealController.update);

router.delete('/:id', DealController.delete);

export default router;
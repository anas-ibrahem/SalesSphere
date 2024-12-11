import express from 'express';

const router = express.Router();

// import /controllers/deal.js
import DealController from '../../controllers/deal.controller.js';


// Define routes for /api/deal
router.get('/', DealController.getAll);
router.get('/claimed', DealController.getAllClaimedDeals);
router.get('/open', DealController.getAllOpenDeals);
router.get('/:id', DealController.getDealById);


router.post('/', (req, res) => {
    res.send('Add a user');
});

export default router;
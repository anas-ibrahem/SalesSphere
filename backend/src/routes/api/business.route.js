import express from 'express';

const router = express.Router();

// import /controllers/business.js
import BusinessController from '../../controllers/business.controller.js';

const businessController = new BusinessController();

// Define routes for /api/business
router.get('/', businessController.getAll);

router.get('/:id', businessController.getById);

router.patch('/:id', businessController.update);


export default router;
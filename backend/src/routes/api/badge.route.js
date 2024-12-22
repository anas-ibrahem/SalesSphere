import express from 'express';

const router = express.Router();

// import /controllers/badge.js
import BadgeController from '../../controllers/badge.controller.js';


const badgeController = new BadgeController();
// Define routes for /api/badge
router.get('/', badgeController.getAll);

export default router;
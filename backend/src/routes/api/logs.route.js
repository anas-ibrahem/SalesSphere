import express from 'express';

const router = express.Router();

// import /controllers/logs.js
import LogsController from '../../controllers/logs.controller.js';

const logsController = new LogsController();

// Define routes for /api/lgos
router.get('/', logsController.getAll);



export default router;
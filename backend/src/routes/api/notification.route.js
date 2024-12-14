import express from 'express';

const router = express.Router();

import NotificationController from '../../controllers/notification.controller.js';

const notificationController = new NotificationController();

// Define routes for /api/notification
router.get('/', notificationController.getAllByEmployee);

router.get('/:id', notificationController.getById);

router.get('/unread/count', notificationController.getUnreadCount);

// to create a new notification
router.post('/', notificationController.addNotification);

// to set a notification as seen
router.patch('/seen/:id', notificationController.setSeen);


export default router;
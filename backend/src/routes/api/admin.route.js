import express from 'express';

const router = express.Router();

// import /controllers/admin.js
import AdminController from '../../controllers/admin.controller.js';

const adminController = new AdminController();

router.post('/login', adminController.login);

router.use(adminController.verifyToken);

// Define routes for /api/admin
router.get('/me', adminController.me);
// api/admin/business
router.get('/business', adminController.getAllBusinessRequests);
// /api/admin/business/accept/:id
router.patch('/business/accept/:id', adminController.acceptBusinessRequest);
// /api/admin/business/reject/:id
router.patch('/business/reject/:id', adminController.rejectBusinessRequest);

router.get('/', adminController.getAll);

router.get('/:id', adminController.getById);

router.delete('/:id', adminController.deleteAdmin);


router.post('/', adminController.addAdmin);

router.patch('/', adminController.updateAdmin);



export default router;
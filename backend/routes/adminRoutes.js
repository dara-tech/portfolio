import express from 'express';
import { registerAdmin, loginAdmin, logoutAdmin,updateAdmin } from '../controllers/adminController.js';

const router = express.Router();

// Admin Register Route
router.post('/admin/register', registerAdmin);

// Admin Login Route
router.post('/admin/login', loginAdmin);

// Admin Logout Route
router.post('/admin/logout', logoutAdmin);
router.put('/admin/update/:id', updateAdmin);

export default router;

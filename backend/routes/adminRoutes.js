import express from 'express';
import { registerAdmin, loginAdmin, logoutAdmin } from '../controllers/adminController.js';

const router = express.Router();

// Admin Register Route
router.post('/admin/register', registerAdmin);

// Admin Login Route
router.post('/admin/login', loginAdmin);

// Admin Logout Route
router.post('/admin/logout', logoutAdmin);

export default router;

import express from 'express';
import { loginAdmin, logoutAdmin, getAdmin, updateAdmin, registerAdmin } from '../controllers/adminController.js';
import isAuthenticated from '../middleware/authMiddlware.js';

import multer from 'multer';


const router = express.Router();

// Configure multer for memory storage instead of disk
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

router.post('/admin/login', loginAdmin);
router.post('/admin/register', upload.fields([
  { name: 'profilePic', maxCount: 1 },
  { name: 'cv', maxCount: 1 }
]), registerAdmin);
router.post('/admin/logout', logoutAdmin);
router.get('/admin/profile', getAdmin);
router.put('/admin/update', upload.fields([
  { name: 'profilePic', maxCount: 1 },
  { name: 'cv', maxCount: 1 }
]), isAuthenticated, updateAdmin);

export default router;

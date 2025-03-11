import express from 'express';
import { getAllVideos, getVideo, createVideo, updateVideo, deleteVideo, incrementViewCount, searchVideos } from '../controllers/videoController.js';
import isAuthenticated from '../middleware/authMiddlware.js';

const router = express.Router();

// Public routes
router.get('/videos', getAllVideos);
router.get('/videos/search', searchVideos);
router.get('/videos/:id', getVideo);
router.post('/videos/:id/view', incrementViewCount);

// Protected routes
router.post('/admin/videos', isAuthenticated, createVideo);
router.put('/admin/videos/:id', isAuthenticated, updateVideo);
router.delete('/admin/videos/:id', isAuthenticated, deleteVideo);

export default router;

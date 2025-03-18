import express from 'express';
import { getRoadMaps, getRoadMapById, createRoadMap, updateRoadMap, deleteRoadMap } from '../controllers/roadMap.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/roadmaps', getRoadMaps);
router.get('/roadmaps/:id', getRoadMapById);

// Protected routes
router.post('/roadmaps', authenticateToken, createRoadMap);
router.put('/roadmaps/:id', authenticateToken, updateRoadMap);
router.delete('/roadmaps/:id', authenticateToken, deleteRoadMap);

export default router;

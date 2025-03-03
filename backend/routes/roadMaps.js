import express from 'express';
import { getRoadMaps, getRoadMapById, createRoadMap, updateRoadMap, deleteRoadMap } from '../controllers/roadMap.js';
import isAuthenticated from '../middleware/authMiddlware.js';

const router = express.Router();

// Public routes
router.get('/roadmaps', getRoadMaps);
router.get('/roadmaps/:id', getRoadMapById);

// Protected routes
router.post('/roadmaps',isAuthenticated, createRoadMap);
router.put('/roadmaps/:id', isAuthenticated, updateRoadMap);
router.delete('/roadmaps/:id', isAuthenticated, deleteRoadMap);

export default router;

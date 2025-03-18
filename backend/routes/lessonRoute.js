import express from 'express';
import { 
    createLesson, 
    getLessons, 
    getLessonById, 
    updateLesson, 
    deleteLesson,
    getLessonsByRoadmapId,
    searchLessons
} from '../controllers/lessonController.js';
import isAuthenticated from '../middleware/authMiddlware.js';
const router = express.Router();

// Public routes
router.get('/lessons', getLessons);
router.get('/lessons/search', searchLessons);
router.get('/lessons/roadmap/:roadmapId', getLessonsByRoadmapId);
router.get('/lessons/:id', getLessonById);

// Protected routes (admin only)
router.post('/admin/lessons',isAuthenticated, createLesson);
router.put('/admin/lessons/:id',isAuthenticated, updateLesson);
router.delete('/admin/lessons/:id', isAuthenticated, deleteLesson);

export default router;

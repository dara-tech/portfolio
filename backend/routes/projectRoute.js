import express from 'express';
import multer from 'multer';
import { createProject, getProjects, updateProject, deleteProject, getProjectById, incrementViewCount, getViewCount } from '../controllers/projectController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Configure Multer for file uploads (image is optional)
const upload = multer({ dest: 'uploads/' });

// Protected route: Only authenticated users can create a project
router.post('/projects', upload.single('image'), createProject);

// Protected route: Only authenticated users can update or delete a project
router.put('/projects/:id', upload.single('image'), updateProject);
router.delete('/projects/:id',  deleteProject);

// Public route: Anyone can view projects
router.get('/projects', getProjects);
router.get('/projects/:id', getProjectById);

// Public route: Anyone can view projects
router.post('/projects/:id/views', incrementViewCount);
router.get('/projects/:id/views', getViewCount);

export default router;
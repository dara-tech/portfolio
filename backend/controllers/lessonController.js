import Lesson from '../models/Lesson.js';
import Video from '../models/Video.js';
import mongoose from 'mongoose';

// Get all lessons
export const getLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find();
        res.status(200).json(lessons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single lesson by ID
export const getLessonById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid lesson ID' });
        }
        
        const lesson = await Lesson.findById(id);
        
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }
        
        res.status(200).json(lesson);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new lesson
export const createLesson = async (req, res) => {
    try {
        const lessonData = req.body;
        
        const newLesson = new Lesson(lessonData);
        await newLesson.save();
        
        res.status(201).json(newLesson);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a lesson
export const updateLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid lesson ID' });
        }
        
        updates.updatedAt = Date.now();
        
        const updatedLesson = await Lesson.findByIdAndUpdate(
            id, 
            updates, 
            { new: true, runValidators: true }
        );
        
        if (!updatedLesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }
        
        res.status(200).json(updatedLesson);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a lesson
export const deleteLesson = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid lesson ID' });
        }
        
        const deletedLesson = await Lesson.findByIdAndDelete(id);
        
        if (!deletedLesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }
        
        res.status(200).json({ message: 'Lesson deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get lessons by roadmap ID
export const getLessonsByRoadmapId = async (req, res) => {
    try {
        const { roadmapId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(roadmapId)) {
            return res.status(400).json({ message: 'Invalid roadmap ID' });
        }
        
        const lessons = await Lesson.find({ roadmapId }).sort({ stepIndex: 1 }).populate('videoId');
        
        res.status(200).json(lessons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search lessons
export const searchLessons = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }
        
        const lessons = await Lesson.find(
            { $text: { $search: query } },
            { score: { $meta: "textScore" } }
        )
        .sort({ score: { $meta: "textScore" } })
        .populate('videoId');
        
        res.status(200).json(lessons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        // required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    content: {
        type: String,
        required: false
    },
    stepIndex: {
        type: Number,
        default: 0
    },
    duration: {
        type: String
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    category: {
        type: String,
        trim: true,
        default: 'Uncategorized'
    },
    resources: [{
        title: {
            type: String,
            required: true
        },
        url: {
            type: String,
            // required: true
        },
        type: {
            type: String,
            default: 'Link'
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Create index for searching lessons
lessonSchema.index({ title: 'text', description: 'text', content: 'text' });

const Lesson = mongoose.model('Lesson', lessonSchema);

export default Lesson;

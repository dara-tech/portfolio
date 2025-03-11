import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    url: {
        type: String,
        required: false
    },
    youtubeId: {
        type: String,
        required: false,
        unique: true
    },
    thumbnail: {
        type: String
    },
    duration: {
        type: String
    },
    views: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Create index for searching videos
videoSchema.index({ title: 'text', description: 'text' });

const Video = mongoose.model('Video', videoSchema);

export default Video;

import mongoose from 'mongoose';

const roadMapSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  steps: [{
    name: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    resources: [{
      title: String,
      url: String
    }]
  }],
  category: {
    type: String,
    enum: ['Frontend', 'Backend', 'FullStack', 'DevOps', 'Mobile', 'Other']
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  estimatedTime: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: false  // Make it optional
  }
}, { timestamps: true });

const RoadMap = mongoose.model('RoadMap', roadMapSchema);

export default RoadMap;

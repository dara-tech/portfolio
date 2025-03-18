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
      required: [true, 'Step name is required'],
      trim: true,
      maxlength: [100, 'Step name cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Step description is required'],
      trim: true,
      maxlength: [500, 'Step description cannot exceed 500 characters']
    },
    resources: [{
      title: {
        type: String,
        required: [true, 'Resource title is required'],
        trim: true
      },
      url: {
        type: String,
        required: [true, 'Resource URL is required'],
        trim: true,
        validate: {
          validator: function(v) {
            return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
          },
          message: props => `${props.value} is not a valid URL!`
        }
      }
    }],
    estimatedTime: {
      type: String,
      trim: true
    }
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
  views: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: false  // Make it optional
  }
}, { timestamps: true });

const RoadMap = mongoose.model('RoadMap', roadMapSchema);

export default RoadMap;

import mongoose from 'mongoose';
import slugify from 'slugify';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Project title is required"],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    required: [true, "Project description is required"],
  },
  image: {
    type: String, // This will store the Cloudinary URL if provided
  },
  technologies: [{
    type: String,
    trim: true
  }],
  githubLink: {
    type: String,
    validate: {
      validator: function(v) {
        // Very simple GitHub URL pattern check
        return !v || /^(https?:\/\/)?(www\.)?(github\.com)\/.+$/.test(v);
      },
      message: props => `${props.value} is not a valid GitHub URL!`
    },
  },
  liveDemoLink: {
    type: String,
    validate: {
      validator: function(v) {
        // Check if the value starts with http:// or https:// (if provided)
        return !v || /^(https?:\/\/)/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    },
  },
  tags: [{
    type: String,
    trim: true
  }],
  views: {
    type: Number,
    default: 0
},
}, { timestamps: true });
  

// Pre-save hook to create a slug from the title
projectSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
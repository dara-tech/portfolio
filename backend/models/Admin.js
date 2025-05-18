import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, 'Username is required'], 
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long']
  },
  email: { 
    type: String, 
    required: false, 
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  describe: { 
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  exp: { 
    type: String,
    trim: true 
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  profilePic: { 
    type: String, 
    default: "" 
  },
  socialLinks: [{
    platform: {
      type: String,
      enum: ['github', 'linkedin', 'twitter', 'facebook', 'instagram', 'youtube', 'portfolio', 'other'],
      required: true
    },
    url: {
      type: String,
      required: true,
      match: [/^https?:\/\//, 'Please enter a valid URL']
    }
  }],
  cv: { 
    type: String,
    default:''
  },
  about: { 
    type: String,
    trim: true,
    maxlength: [2000, 'About section cannot exceed 2000 characters']
  },
  skills: [{
    type: String,
    trim: true
  }],
  location: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare passwords
adminSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

// Method to get public profile (excludes sensitive data)
adminSchema.methods.getPublicProfile = function() {
  const adminObject = this.toObject();
  delete adminObject.password;
  return adminObject;
};

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;

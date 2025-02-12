import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

// Admin Register Controller
const registerAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if username already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    // Create a new admin (the password will be hashed via the model's pre-save hook)
    const newAdmin = new Admin({ username, password });
    await newAdmin.save();

    // Create and send JWT token
    const token = jwt.sign(
      { id: newAdmin._id, username: newAdmin.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin Login Controller
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: 'Admin not found' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin Logout Controller
const logoutAdmin = async (req, res) => {
  // For JWT, logout is typically handled on the client by removing the token.
  // If you're using cookies to store the token, you can clear the cookie here.
  // Example: If token is stored in a cookie named "token", you can clear it:
  // res.clearCookie('token');

  // Otherwise, simply return a logout success message.
  res.status(200).json({ message: 'Logout successful' });
};

export { registerAdmin, loginAdmin, logoutAdmin };

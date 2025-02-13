import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';
import cloudinary from '../lib/cloudinary.js';

// Get Admin Details by ID
const getAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await Admin.findById(id).select("-password"); // Exclude password
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin Register with Profile Picture Upload
const registerAdmin = async (req, res) => {
  const { username, email, describe, password, profilePic } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
    if (existingAdmin) {
      return res.status(400).json({ message: "Username or email is already taken" });
    }

    let uploadedImageUrl = "";

    if (profilePic) {
      const uploadResponse = await cloudinary.v2.uploader.upload(profilePic, {
        folder: "admin_profiles",
      });
      uploadedImageUrl = uploadResponse.secure_url;
    }

    const newAdmin = new Admin({ 
      username, 
      email, 
      describe, 
      password, 
      profilePic: uploadedImageUrl 
    });

    await newAdmin.save();

    const token = jwt.sign(
      { id: newAdmin._id, username: newAdmin.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ message: "Admin registered successfully", token, profilePic: uploadedImageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Admin Profile
const updateAdmin = async (req, res) => {
  const { username, email, describe, profilePic } = req.body;
  const { id } = req.params;

  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    let uploadedImageUrl = admin.profilePic;

    if (profilePic) {
      const uploadResponse = await cloudinary.v2.uploader.upload(profilePic, {
        folder: "admin_profiles",
      });
      uploadedImageUrl = uploadResponse.secure_url;
    }

    admin.username = username || admin.username;
    admin.email = email || admin.email;
    admin.describe = describe || admin.describe;
    admin.profilePic = uploadedImageUrl;

    await admin.save();

    res.status(200).json({ message: "Profile updated successfully", admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin Login Controller
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 3600000, // 1 hour
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin Logout Controller
const logoutAdmin = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
};

export { registerAdmin, loginAdmin, logoutAdmin, updateAdmin, getAdmin };

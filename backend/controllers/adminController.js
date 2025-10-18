import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cloudinary from "../lib/cloudinary.js";

export const loginAdmin = async (req, res) => {
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
      { userId: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
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

export const logoutAdmin = (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ message: 'Logout successful' });
};

export const getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findOne().select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Migrate existing socialLinks data to include username field
    if (admin.socialLinks && admin.socialLinks.length > 0) {
      const migratedSocialLinks = admin.socialLinks.map(link => {
        if (!link.username && link.url) {
          // Extract username from URL
          const urlParts = link.url.split('/');
          const username = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2] || '';
          return { ...link, username };
        }
        return link;
      });

      // Update the admin document if migration was needed
      const needsSocialLinksMigration = admin.socialLinks.some(link => !link.username);
      if (needsSocialLinksMigration) {
        admin.socialLinks = migratedSocialLinks;
      }
    }

    // Migrate location from array to string
    if (Array.isArray(admin.location)) {
      admin.location = admin.location.join(', ');
    }

    // Save if any migration was needed
    const needsMigration = (admin.socialLinks && admin.socialLinks.some(link => !link.username)) || Array.isArray(admin.location);
    if (needsMigration) {
      await admin.save();
    }

    res.status(200).json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const { username, email, location, describe, exp, profilePic, cv, password, socialLinks, about, skills } = req.body;
    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    console.log("Files received:", req.files);  // Log the received files
    console.log("Body data:", req.body);  // Log the received body data

    // Parse JSON fields safely
    let parsedSocialLinks = [];
    let parsedSkills = [];

    try {
      if (socialLinks) {
        parsedSocialLinks = JSON.parse(socialLinks);
        
        // Ensure all socialLinks have username field (migrate existing data)
        parsedSocialLinks = parsedSocialLinks.map(link => {
          if (!link.username && link.url) {
            // Extract username from URL for existing data
            const urlParts = link.url.split('/');
            const username = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2] || '';
            return { ...link, username };
          }
          return link;
        });
      }
    } catch (error) {
      console.error("Error parsing socialLinks:", error);
      return res.status(400).json({ message: "Invalid socialLinks format" });
    }

    try {
      if (skills) {
        parsedSkills = JSON.parse(skills);
      }
    } catch (error) {
      console.error("Error parsing skills:", error);
      return res.status(400).json({ message: "Invalid skills format" });
    }

    // Migrate existing data if needed
    if (Array.isArray(admin.location)) {
      admin.location = admin.location.join(', ');
    }

    // Update admin fields
    if (username) admin.username = username;
    if (email) admin.email = email;
    if (location) admin.location = location;
    if (describe) admin.describe = describe;
    if (exp) admin.exp = exp;
    if (about) admin.about = about;
    if (parsedSocialLinks.length > 0) admin.socialLinks = parsedSocialLinks;
    if (parsedSkills.length > 0) admin.skills = parsedSkills;

    if (req.files) {
      if (req.files.profilePic) {
        // Using Promise to wait for the upload to complete
        const profilePicResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'admin_profiles' },
            (error, result) => {
              if (error) {
                reject(error); // Reject in case of error
              } else {
                resolve(result); // Resolve with the result of the upload
              }
            }
          );
          // Stream the image buffer to Cloudinary
          uploadStream.end(req.files.profilePic[0].buffer);
        });

        admin.profilePic = profilePicResult.secure_url;
      }

      if (req.files.cv) {
        // Using Promise to wait for the upload to complete
        const cvResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'admin_cvs', resource_type: 'auto' },
            (error, result) => {
              if (error) {
                reject(error); // Reject in case of error
              } else {
                resolve(result); // Resolve with the result of the upload
              }
            }
          );
          // Stream the cv buffer to Cloudinary
          uploadStream.end(req.files.cv[0].buffer);
        });

        admin.cv = cvResult.secure_url;
      }
    }

    if (password) {
      admin.password = await bcrypt.hash(password, 10);
    }

    await admin.save();

    res.status(200).json({
      message: "Profile updated successfully",
      data: {
        ...admin.toObject(),
        password: undefined
      }
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    if (error.message === 'Missing required parameter - file') {
      res.status(400).json({
        message: 'Missing required file',
        error: {
          message: 'Missing required parameter - file',
          name: 'Error',
          http_code: 400
        }
      });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
};

export const registerAdmin = async (req, res) => {
  try {
    const {
      username,
      email,
      describe,
      exp,
      password,
      socialLinks,
      about,
      skills
    } = req.body;

    const existingAdmin = await Admin.findOne({
      $or: [{ username }, { email }]
    });

    if (existingAdmin) {
      return res.status(400).json({ message: "Username or email is already taken" });
    }

    const uploadFile = async (file, folder) => {
      if (!file) return null;
      try {
        const result = await cloudinary.uploader.upload(file.path, { folder });
        return result.secure_url;
      } catch (error) {
        console.error(`Error uploading to ${folder}:`, error);
        throw new Error(`Failed to upload file to ${folder}`);
      }
    };

    const [profilePicUrl, cvUrl] = await Promise.all([
      req.files?.profilePic ? uploadFile(req.files.profilePic[0], 'admin_profiles') : Promise.resolve(null),
      req.files?.cv ? uploadFile(req.files.cv[0], 'admin_cvs') : Promise.resolve(null)
    ]);

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      username,
      email,
      describe,
      exp,
      password: hashedPassword,
      profilePic: profilePicUrl,
      cv: cvUrl,
      socialLinks: socialLinks ? JSON.parse(socialLinks) : undefined,
      about,
      skills: skills ? JSON.parse(skills) : undefined
    });

    await newAdmin.save();

    const token = jwt.sign(
      { userId: newAdmin._id, username: newAdmin.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Admin registered successfully",
      token,
      admin: {
        ...newAdmin.toObject(),
        password: undefined
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const checkTokenExpiration = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return next();
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.clearCookie('token');
    res.status(401).json({ message: 'Token expired, please login again' });
  }
};
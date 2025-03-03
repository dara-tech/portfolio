import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const isAuthenticated = async (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   // Debugging log

    // Change decoded.id to decoded.userId
    req.admin = await Admin.findById(decoded.userId).select("-password");

    if (!req.admin) {
      return res.status(401).json({ message: "Invalid access token" });
    }

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(401).json({ message: "Invalid token", error: error.message });
  }
};


export default isAuthenticated;

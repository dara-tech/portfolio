import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/adminRoutes.js'; // Ensure the file exists
import projectRoutes from './routes/projectRoute.js'; // Ensure the file exists

dotenv.config();

const app = express();
const port = process.env.PORT || 5002;

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: "http://localhost:5173", // Ensure this matches your frontend URL
    credentials: true,
  })
);
app.use(express.json({ limit: '50mb' }));

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

// Use auth and project routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes); // Adjusted route path for better clarity

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// Start the server
const startServer = async () => {
  try {
    await connectDB(); // Connect to the database before starting the server

    app.listen(port, () => {
      console.log(`🌐 Server is running on port ${port} ✅`);
    });

    // Auto-reload mechanism (prevent server sleeping on free hosting)
    setInterval(() => {
      fetch('https://daracheol.onrender.com')
        .then((res) => console.log('🔄 Auto-reload request sent. Status:', res.status))
        .catch((err) => console.error('❌ Auto-reload request failed:', err.message));
    }, 60000); // Every 1 minute

  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
};

startServer();

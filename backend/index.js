import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import https from 'https';

import authRoutes from './routes/adminRoutes.js';
import projectRoutes from './routes/projectRoute.js';
import roadmapRoutes from './routes/roadMaps.js';
import videoRoutes from './routes/videoRoute.js';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors({ 
  origin: [
    "http://localhost:5173",
    "http://localhost:5002",
    "https://daracheol.onrender.com/"
  ], 
  credentials: true 
}));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

app.use('/api', authRoutes);
app.use('/api', projectRoutes);
app.use('/api', roadmapRoutes);
app.use('/api', videoRoutes);
app.use(express.json({ limit: '10mb' }));

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const server = http.createServer(app);

const AUTO_RELOAD_INTERVAL = 800000;

const autoReload = () => {
  https.get("https://daracheol.onrender.com/", (res) => {
    console.log(`[${new Date().toISOString()}] 🔄 Auto-reload request sent. Status: ${res.statusCode}`);
  }).on("error", (err) => {
    console.error(`[${new Date().toISOString()}] ❌ Auto-reload failed: ${err.message}`);
  }).on("timeout", () => {
    console.warn(`[${new Date().toISOString()}] ⚠️ Auto-reload request timed out.`);
  }).setTimeout(10000);
};

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });

    autoReload();
    setInterval(autoReload, AUTO_RELOAD_INTERVAL);
  } catch (error) {
    console.error("❌ Failed to start server", error);
    process.exit(1);
  }
};

startServer();

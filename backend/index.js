import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from "http";
import path from "path";
import authRoutes from './routes/adminRoutes.js'; 
import projectRoutes from './routes/projectRoute.js';
import roadmapRoutes from './routes/roadMaps.js';
import { fileURLToPath } from "url";
import https from "https";
import cookieParser from "cookie-parser";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5002;

app.use(cors({ origin: [
  "http://localhost:5173",
  "http://localhost:5002", "https://darachoel-hm0a.onrender.com/"], credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected ✅");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

app.use('/api', authRoutes);
app.use('/api', projectRoutes);
app.use('/api', roadmapRoutes);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const server = http.createServer(app);

const startServer = async () => {
  try {
    await connectDB();
    server.listen(port, () => {
      console.log(`🌐 Server is running on port ${port} ✅`);
    });

    if (process.env.NODE_ENV === "production") {
      const autoReload = () => {
        https.get("https://darachoel-hm0a.onrender.com", (res) => {
          console.log(`Auto-reload request sent at ${new Date().toISOString()}. Status: ${res.statusCode}`);
        }).on("error", (err) => {
          console.error(`Error during auto-reload request at ${new Date().toISOString()}:`, err.message);
        }).on("timeout", () => {
          console.warn(`Auto-reload request timed out at ${new Date().toISOString()}`);
        }).setTimeout(30000); // 30 seconds timeout
      };

      setInterval(autoReload, 840000); // 14 minutes
      autoReload(); // Initial call
    }

  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
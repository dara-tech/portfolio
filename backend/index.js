import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from "http";
import path from "path";
import authRoutes from './routes/adminRoutes.js'; 
import projectRoutes from './routes/projectRoute.js';
import { fileURLToPath } from "url";
import https from "https";
import cookieParser from "cookie-parser";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5002;

// Middleware
app.use(cors({ origin: "https://portfolio-l5nx.onrender.com", credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected ✅");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};


// Routes
app.use('/api', authRoutes);
app.use('/api', projectRoutes);



// Serve frontend (always, not just in production)
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});


// Start Server
const server = http.createServer(app);

const startServer = async () => {
  try {
    await connectDB();
    server.listen(port, () => {
      console.log(`🌐 Server is running on port ${port} ✅`);
    });

    // Auto-reload only in production
    if (process.env.NODE_ENV === "production") {
      setInterval(() => {
        https.get("https://portfolio-l5nx.onrender.com", (res) => {
          console.log("Auto-reload request sent. Status:", res.statusCode);
        }).on("error", (err) => {
          console.error("Error during auto-reload request:", err.message);
        });
      }, 60000);
    }

  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();

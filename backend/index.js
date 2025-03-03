import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import https from 'https';
import authRoutes from './routes/adminRoutes.js';
import projectRoutes from './routes/projectRoute.js';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;
const __dirname = path.resolve();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:5173", "https://darachoel-hm0a.onrender.com"],
  credentials: true,
}));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
});

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`🌐 Server is running on port ${PORT} ✅`);
    });

    setInterval(() => {
      https.get('https://darachoel-hm0a.onrender.com', (res) => {
        console.log(`Auto-reload request sent. Status: ${res.statusCode}`);
      }).on('error', (err) => {
        console.error('Error during auto-reload request:', err.message);
      });
    }, 14 * 60 * 1000); // 14 minutes

    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
      });
    });

  } catch (error) {
    console.error('❌ Failed to start the server:', error);
    process.exit(1);
  }
};

startServer();
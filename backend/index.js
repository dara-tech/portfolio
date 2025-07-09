import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import http from 'http';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { trackVisit } from './middleware/visitTracker.js';

import authRoutes from './routes/adminRoutes.js';
import projectRoutes from './routes/projectRoute.js';
import roadmapRoutes from './routes/roadMaps.js';
import videoRoutes from './routes/videoRoute.js';
import lessonRoutes from './routes/lessonRoute.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5002;
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];

console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
console.log(`🔐 Allowed Origins: ${allowedOrigins.join(', ')}`);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('❌ Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(helmet()); // Security headers
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(trackVisit);

// Routes
app.use('/api', authRoutes);
app.use('/api', projectRoutes);
app.use('/api', roadmapRoutes);
app.use('/api', videoRoutes);
app.use('/api', lessonRoutes);

// Static serving
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Fallback for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// 404 API fallback
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

const server = http.createServer(app);

// 🔄 Auto-reload for Render (prevent sleeping)
const AUTO_RELOAD_INTERVAL = 1000 * 60 * 5; // 5 minutes
const autoReload = () => {
  const url = 'https://daracheol-6adc.onrender.com/';
  https.get(url, (res) => {
    console.log(`[${new Date().toISOString()}] 🔄 Auto-reload status: ${res.statusCode}`);
  }).on('error', (err) => {
    console.error(`[${new Date().toISOString()}] ❌ Auto-reload error: ${err.message}`);
  }).on('timeout', () => {
    console.warn(`[${new Date().toISOString()}] ⚠️ Auto-reload timed out.`);
  }).setTimeout(10000);
};

// 🧠 Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Graceful shutdown initiated...');
  await mongoose.disconnect();
  server.close(() => {
    console.log('✅ Server closed. Goodbye.');
    process.exit(0);
  });
});

// Connect DB + Start Server
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected!');
  } catch (err) {
    console.error('❌ MongoDB error:', err);
    process.exit(1);
  }
};

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    // Ping Render every 5 mins
    if (isProduction) {
      autoReload();
      setInterval(autoReload, AUTO_RELOAD_INTERVAL);
    }
  } catch (err) {
    console.error('❌ Startup error:', err);
    process.exit(1);
  }
};

startServer();

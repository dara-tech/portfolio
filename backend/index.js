import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import path from "path";
import authRoutes from "./routes/adminRoutes.js";
import projectRoutes from "./routes/projectRoute.js";
import { fileURLToPath } from "url";
import https from "https";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5002;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Development frontend
      "http://localhost:5002", // Local backend serving frontend
      "https://darachoel-hm0a.onrender.com", // Production frontend
    ],
    credentials: true, // Allow cookies to be sent with requests
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(helmet()); // Security headers
app.use(compression()); // Gzip compression for performance

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// API Routes
app.use("/api", authRoutes);
app.use("/api", projectRoutes);

// Serve Frontend (both in development & production)
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", async (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  } catch (error) {
    next(error);
  }
});

// Start HTTP Server
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
        https
          .get("https://darachoel-hm0a.onrender.com", (res) => {
            console.log("🔄 Auto-reload request sent. Status:", res.statusCode);
          })
          .on("error", (err) => {
            console.error("⚠️ Auto-reload request failed:", err.message);
          });
      }, 60000);
    }
  } catch (error) {
    console.error("❌ Failed to start server", error);
    process.exit(1);
  }
};

// Graceful Shutdown Handling
process.on("SIGINT", async () => {
  console.log("\n⚠️ Shutting down server...");
  server.close(() => {
    console.log("🔻 Server closed");
    process.exit(0);
  });
});

// Start the server
startServer();

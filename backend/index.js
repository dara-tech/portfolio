import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/adminRoutes.js'; // Add the .js extension when using ES6 modules
import projectRoutes from './routes/projectRoute.js';
import path from 'path';
 // Add the project routes

dotenv.config();

const app = express();
const port = process.env.PORT || 5002;
const __dirname = path.resolve();

app.use(
  cors({
    origin: "http://localhost:5173", // Make sure this is your frontend URL
    credentials: true,
  })
);
app.use(express.json({ limit: '50mb' }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Use auth and project routes
app.use('/api', authRoutes);
app.use('/api', projectRoutes); // Add this line

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Start the server
const startServer = async () => {
  try {
    await connectDB(); // Connect to the database before starting the server

    // Start the socket server
    server.listen(PORT, () => {
      console.log(`🌐 Server is running on port ${PORT} ✅`);
    });

    // Auto-reload mechanism (with an external service or heartbeat)
    setInterval(() => {
      https.get('https://daracheol.onrender.com', (res) => {
        console.log('Auto-reload request sent. Status:', res.statusCode);
      }).on('error', (err) => {
        console.error('Error during auto-reload request:', err.message);
      });
    }, 60000); // 60000 ms = 1 minute

  } catch (error) {
    console.error('Failed to connect to the database', error);
    process.exit(1); // Exit the process with failure
  }
};

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

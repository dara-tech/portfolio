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

app.use(cors());
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

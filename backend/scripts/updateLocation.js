import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import TelegramUser from '../models/TelegramUser.js';

const telegramId = '632799319'; // <-- Replace with your Telegram user ID
const longitude = -74.0060; // New York longitude
const latitude = 40.7128;   // New York latitude

async function updateLocation() {
  await mongoose.connect(process.env.MONGODB_URI);
  await TelegramUser.findOneAndUpdate(
    { telegramId },
    {
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      updatedAt: new Date()
    },
    { upsert: true }
  );
  console.log('Location updated for', telegramId);
  await mongoose.disconnect();
}

updateLocation(); 
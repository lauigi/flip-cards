'use server';

import mongoose from 'mongoose';

export async function testDatabaseConnection() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }

    if (mongoose.connection.readyState === 1) {
      console.log('Already connected to MongoDB');
      return true;
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Successfully connected to MongoDB!');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
}

/* eslint-disable @typescript-eslint/no-require-imports */
// scripts/init-db.ts
const mongoose = require('mongoose');
const { config } = require('dotenv');
const path = require('path');
const userSchema = require('../app/models/User').default;
const topicSchema = require('../app/models/Topic').default;
const chapterSchema = require('../app/models/Chapter').default;

// Load environment variables
config({
  path: path.resolve(process.cwd(), '.env.local'),
});

async function initDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Please set MONGODB_URI in .env.local file');
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const User = mongoose.model('User', userSchema);
    const Topic = mongoose.model('Topic', topicSchema);
    const Chapter = mongoose.model('Chapter', chapterSchema);

    await User.syncIndexes();
    await Topic.syncIndexes();
    await Chapter.syncIndexes();

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
  }
}

initDatabase().catch(console.error);

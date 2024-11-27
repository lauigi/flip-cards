import mongoose from 'mongoose';
import { config } from 'dotenv';
import path from 'path';
import { userSchema } from '../models/User';
import { topicSchema } from '../models/Topic';
import { chapterSchema } from '../models/Chapter';

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

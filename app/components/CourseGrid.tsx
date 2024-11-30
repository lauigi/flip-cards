import TopicModel from '../models/Topic';
import { TopicCard } from './TopicCard';
import connect from '@/lib/mongodb';
import { auth } from '@/lib/auth';
import User, { IUser } from '../models/User';
import { LoginButton } from './LoginButton';

async function getTopics(email: string) {
  try {
    await connect();
    // Find user and their topic IDs
    const user = await User.findOne({ email }).select('topics').lean();
    const topicIds = (user as unknown as Partial<IUser>)?.topics || [];
    if (!topicIds.length) {
      return [];
    }
    // Fetch full topic details for all user's topics
    const topics = await TopicModel.find({
      _id: { $in: topicIds },
    }).lean();
    return topics.map(topic => JSON.parse(JSON.stringify(topic)));
  } catch (error) {
    console.error('Error fetching topics:', error);
    throw error;
  }
}

export async function CourseGrid() {
  try {
    const session = await auth();
    let email = session?.user?.email;
    if (!email) {
      if (process.env.NODE_ENV === 'development') {
        email = 'demo@example.com';
      }
    }
    const topics = email ? await getTopics(email) : [];

    if (!email) {
      return (
        <div className="p-4 text-center">
          <LoginButton />
        </div>
      );
    } else if (!topics || topics.length === 0) {
      return (
        <div className="p-4 text-center">
          <p className="text-gray-500">No topics found.</p>
        </div>
      );
    }

    return (
      <>
        <div className="mb-4">
          <p className="text-sm text-gray-600">Found {topics.length} topics</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map(topic => (
            <TopicCard key={topic._id as string} topic={topic} />
          ))}
        </div>
      </>
    );
  } catch (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>Error loading topics: {(error as Error).message}</p>
      </div>
    );
  }
}

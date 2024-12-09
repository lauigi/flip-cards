import type { ITopic } from '../models/Topic';
import { TopicCard } from './TopicCard';
import connect from '@/lib/mongodb';
import { auth } from '@/lib/auth';
import User, { IUser } from '../models/User';
import { LoginButton } from './LoginButton';

async function getTopics(email: string) {
  try {
    await connect();
    const user = await User.findOne({ email }).lean().populate('topics');
    const topics = ((user as Partial<IUser>)?.topics as unknown as (ITopic & { _id: string })[]) || [];
    return topics;
  } catch (error) {
    console.error('Error fetching topics:', error);
    throw error;
  }
}

export async function CourseGrid() {
  try {
    const session = await auth();
    const email = session?.user?.email;

    if (!email) {
      return (
        <div className="p-4 text-center">
          <LoginButton />
        </div>
      );
    }

    const topics = await getTopics(email);
    if (!topics || topics.length === 0) {
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
            <TopicCard key={topic._id} topic={topic} />
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

import Topic from '@/models/Topic';
import TopicContent from './components/TopicContent';
import { notFound } from 'next/navigation';
import connect from '@/lib/mongodb';
import { IChapter } from '@/models/Chapter';

async function getTopicWithChapters(id: string) {
  try {
    await connect();
    const topic = await Topic.findById(id).populate('chapters');
    if (!topic) notFound();
    return JSON.parse(JSON.stringify(topic));
  } catch (error) {
    console.error('Error fetching topic:', error);
    return null;
  }
}

export default async function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const topic = await getTopicWithChapters(id);

  const courseData = {
    id: topic!._id,
    name: topic!.name,
    summary: topic!.summary,
    chapters: topic!.chapters.map((chapter: IChapter & { _id: string }) => ({
      id: chapter._id,
      name: chapter.name,
      summary: chapter.summary,
      cards: chapter.cards,
    })),
  };

  return <TopicContent course={courseData} />;
}

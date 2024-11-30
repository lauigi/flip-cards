import { NextResponse } from 'next/server';
import connect from '@/lib/mongodb';
import Topic from '@/models/Topic';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, context: Props) {
  try {
    await connect();
    const topicId = await (await context.params).id;
    const topic = await Topic.findById(topicId);

    if (!topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    return NextResponse.json(topic.name);
  } catch (error) {
    console.error('Failed to fetch topic:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import connect from '@/libs/mongodb';
import Topic from '@/app/models/Topic';

interface Props {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Props) {
  try {
    await connect();

    const topic = await Topic.findById(params.id);

    if (!topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    return NextResponse.json(topic.name);
  } catch (error) {
    console.error('Failed to fetch topic:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

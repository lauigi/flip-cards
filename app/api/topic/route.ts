import Chapter from '@/app/models/Chapter';
import Topic from '@/app/models/Topic';
import User from '@/app/models/User';
import { auth } from '@/libs/auth';
import connect from '@/libs/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, context: { params: { id: string } }) {
  return auth(async req => {
    let email = '';
    if (!req.auth) {
      if (process.env.NODE_ENV === 'development') {
        email = 'demo@example.com';
      } else {
        return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
      }
    } else {
      email = req.auth.user!.email as string;
    }
    await connect();
    const topicData = await request.json();
    console.log('Topic data:', topicData);
    const topic = new Topic({
      name: topicData.name,
      summary: topicData.summary,
      chapters: [],
      authorId: (await User.findOne({ email }))._id,
    });
    const savedTopic = await topic.save();
    // Update user's topics array
    await User.findOneAndUpdate({ email }, { $push: { topics: savedTopic._id } });
    const newChapterData = JSON.parse(topicData.chapters[0]);
    const chapter = new Chapter({
      name: newChapterData.name,
      summary: newChapterData.summary,
      topicId: savedTopic._id,
      cards: newChapterData.cards || [],
    });
    const savedChapter = await chapter.save();
    // Update topic's chapters array
    await Topic.findByIdAndUpdate(savedTopic._id, { $push: { chapters: savedChapter._id } });
    return NextResponse.json({
      topicId: savedTopic._id,
      message: 'Topic created successfully',
    });
  })(request, context);
}

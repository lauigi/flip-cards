import Chapter from '@/app/models/Chapter';
import Topic from '@/app/models/Topic';
import User from '@/app/models/User';
import { auth } from '@/libs/auth';
import connect from '@/libs/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, context: { params: { id: string } }) {
  return auth(async req => {
    const topicId = context.params.id;
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
    const user = await User.findOne({ email });
    if (!user.topics.includes(topicId)) {
      console.log(user.topics, topicId);
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    const rawReqData = await req.text();
    let newChapterData = JSON.parse(rawReqData);
    if (typeof newChapterData === 'string') {
      newChapterData = JSON.parse(newChapterData);
    }
    const chapter = new Chapter({
      name: newChapterData.name,
      summary: newChapterData.summary,
      topicId: topicId,
      cards: newChapterData.cards || {},
    });
    const savedChapter = await chapter.save();
    // Update topic's chapters array
    await Topic.findByIdAndUpdate(topicId, { $push: { chapters: savedChapter._id } });
    return NextResponse.json({
      chapterId: savedChapter._id,
      message: 'Chapter created successfully',
    });
  })(request, context);
}

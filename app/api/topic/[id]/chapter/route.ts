import Chapter from '@/models/Chapter';
import Topic from '@/models/Topic';
import User from '@/models/User';
import { auth } from '@/lib/auth';
import connect from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const topicId = params.id;
  let email = '';
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  } else {
    email = session.user!.email as string;
  }
  await connect();
  const user = await User.findOne({ email });
  if (!user.topics.includes(topicId)) {
    console.log(user.topics, topicId);
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }
  const rawReqData = await req.text();
  console.log('Chapter data:', rawReqData, typeof rawReqData, JSON.stringify(rawReqData));
  let newChapterData = JSON.parse(rawReqData);
  if (typeof newChapterData === 'string') {
    newChapterData = JSON.parse(newChapterData);
  }
  const chapter = new Chapter({
    name: newChapterData.name,
    summary: newChapterData.summary,
    longerSummary: newChapterData.longerSummary,
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
}

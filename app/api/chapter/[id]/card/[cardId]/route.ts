import { NextResponse } from 'next/server';
import connect from '@/lib/mongodb';
import Chapter, { ICard, IChapter } from '@/models/Chapter';
import { auth } from '@/lib/auth';
import User from '@/models/User';

export async function PATCH(request: Request, props: { params: Promise<{ id: string; cardId: string }> }) {
  const params = await props.params;
  let email = '';
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  } else {
    email = session.user!.email as string;
  }
  try {
    await connect();
    const chapter = (await Chapter.findOne({ _id: params.id }).lean()) as unknown as IChapter;
    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }
    const user = await User.findOne({ email });
    if (!user.topics.includes(chapter.topicId)) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const { rate, isRemoved } = await request.json();
    const newCards = chapter.cards.map((card: ICard) => {
      console.log('card.id:', card.id, 'params.cardId:', params.cardId);
      if (card.id === params.cardId) {
        return { ...card, ...(rate && { rate }), isRemoved: !!isRemoved };
      }
      return card;
    });
    const updatedChapter = await Chapter.findByIdAndUpdate(params.id, { cards: newCards }, { new: true });
    if (!updatedChapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    return NextResponse.json(updatedChapter);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update chapter', error }, { status: 500 });
  }
}

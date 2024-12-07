import { NextResponse } from 'next/server';
import connect from '@/lib/mongodb';
import Chapter from '@/models/Chapter';
import User from '@/models/User';
import { auth } from '@/lib/auth';
import { NextRequest } from 'next/server';
import type { ICard } from '@/models/Chapter';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get auth session
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    await connect();

    // First find all chapters that contain this card
    const chapters = await Chapter.find({ 'cards.id': params.id });
    if (!chapters || chapters.length === 0) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // Get the specific chapter that contains this card
    const chapter = chapters[0]; // Take the first chapter since card IDs should be unique
    const card = chapter.cards.find((c: ICard) => c.id === params.id);
    if (!card) {
      return NextResponse.json({ error: 'Card not found in chapter' }, { status: 404 });
    }

    // Check user permission
    const user = await User.findOne({ email: session.user.email });
    if (!user || !user.topics || !user.topics.includes(chapter.topicId)) {
      console.log('Permission denied:', {
        user: user?._id,
        topics: user?.topics,
        chapterTopicId: chapter.topicId,
      });
      return NextResponse.json({ message: 'Not authorized to modify this card' }, { status: 403 });
    }

    const { rate, isRemoved } = await request.json();

    // Validate rating parameter
    if (rate !== undefined && (!Number.isInteger(rate) || rate < 1 || rate > 5)) {
      return NextResponse.json({ error: 'Rate must be an integer between 1 and 5' }, { status: 400 });
    }

    // Validate removal parameter
    if (isRemoved !== undefined && typeof isRemoved !== 'boolean') {
      return NextResponse.json({ error: 'isRemoved must be a boolean value' }, { status: 400 });
    }

    // Build update object
    const updateFields: Record<string, number | boolean> = {};
    if (rate !== undefined) updateFields['cards.$.rate'] = rate;
    if (isRemoved !== undefined) updateFields['cards.$.isRemoved'] = isRemoved;

    // Validate if there are fields to update
    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    console.log('Updating card:', params.id, 'in chapter:', chapter._id, 'with fields:', updateFields);

    // Update the card
    const updatedChapter = await Chapter.findOneAndUpdate(
      { _id: chapter._id, 'cards.id': params.id },
      { $set: updateFields },
      { new: true, runValidators: true },
    );

    if (!updatedChapter) {
      return NextResponse.json({ error: 'Failed to update card' }, { status: 500 });
    }

    // Get the updated card information
    const updatedCard = updatedChapter.cards.find((c: ICard) => c.id === params.id);

    console.log('Updated card:', updatedCard);

    return NextResponse.json({
      message: 'Card updated successfully',
      card: updatedCard,
    });
  } catch (error) {
    console.error('Error updating card:', error);
    return NextResponse.json(
      {
        error: 'Failed to update card',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

import { NextResponse } from 'next/server';
import connect from '@/lib/mongodb';
import Chapter from '@/models/Chapter';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    await connect();
    const { name } = await request.json();

    const chapter = await Chapter.findByIdAndUpdate(params.id, { name }, { new: true });

    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update chapter', error }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connect();
    const chapter = await Chapter.findByIdAndDelete(params.id);

    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Chapter deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete chapter', error }, { status: 500 });
  }
}

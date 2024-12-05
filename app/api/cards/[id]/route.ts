import { NextResponse } from 'next/server';
import connect from '@/lib/mongodb';
import Chapter from '@/models/Chapter';
import { NextRequest } from 'next/server';

export async function PATCH(request: NextRequest, props: { params: { id: string } }) {
  try {
    await connect();

    // 查找包含该卡片的章节
    const chapter = await Chapter.findOne({ 'cards.id': props.params.id });
    if (!chapter) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    const { rate, isRemoved } = await request.json();

    // 验证评分参数
    if (rate !== undefined) {
      if (!Number.isInteger(rate) || rate < 1 || rate > 5) {
        return NextResponse.json({ error: 'Rate must be an integer between 1 and 5' }, { status: 400 });
      }
    }

    // 验证删除参数
    if (isRemoved !== undefined && typeof isRemoved !== 'boolean') {
      return NextResponse.json({ error: 'isRemoved must be a boolean value' }, { status: 400 });
    }

    // 构建更新对象
    const updateFields: Record<string, number | boolean> = {};
    if (rate !== undefined) updateFields['cards.$.rate'] = rate;
    if (isRemoved !== undefined) updateFields['cards.$.isRemoved'] = isRemoved;

    // 验证是否有要更新的字段
    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    // 更新卡片
    const updatedChapter = await Chapter.findOneAndUpdate(
      { 'cards.id': props.params.id },
      { $set: updateFields },
      { new: true, runValidators: true },
    );

    // 添加调试日志
    console.log('Update Fields:', updateFields);
    console.log('Updated Chapter:', updatedChapter);

    if (!updatedChapter) {
      return NextResponse.json({ error: 'Failed to update card' }, { status: 500 });
    }

    // 获取更新后的卡片信息
    const updatedCard = updatedChapter.cards.find((card: { id: string }) => card.id === props.params.id);

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

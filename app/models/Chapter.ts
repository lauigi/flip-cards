import mongoose from 'mongoose';

export interface ICard {
  id: string;
  question: string;
  answer: string;
  rate: number; // 1-5
  isRemoved: boolean;
}

export interface IChapter {
  _id: mongoose.Types.ObjectId;
  name: string;
  summary: string;
  topicId: mongoose.Types.ObjectId;
  cards: ICard[];
  createdAt: Date;
  updatedAt: Date;
}

export const chapterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    summary: { type: String, required: true },
    longerSummary: { type: String, required: true, default: '' },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
    cards: [
      {
        id: { type: String, required: true },
        question: { type: String, required: true },
        answer: { type: String, required: true },
        rate: { type: Number, required: true, enum: [1, 2, 3, 4, 5], default: 3 },
        isRemoved: { type: Boolean, required: true, default: false },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.models?.Chapter || mongoose.model<IChapter>('Chapter', chapterSchema);

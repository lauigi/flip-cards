import mongoose from 'mongoose';

export interface IChapter {
  _id: mongoose.Types.ObjectId;
  name: string;
  summary: string;
  topicId: mongoose.Types.ObjectId;
  cards: {
    id: string;
    question: string;
    answer: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const chapterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    summary: { type: String, required: true },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
    cards: [
      {
        id: { type: String, required: true },
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.models?.Chapter || mongoose.model<IChapter>('Chapter', chapterSchema);

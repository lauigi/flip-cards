import mongoose from 'mongoose';
import './Chapter';

export interface ITopic {
  name: string;
  summary: string;
  chapters: mongoose.Types.ObjectId[];
  authorId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const topicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    summary: { type: String, required: false },
    chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }],
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

export default mongoose.models?.Topic || mongoose.model<ITopic>('Topic', topicSchema);

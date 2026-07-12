import { Schema, model, Document, Types } from 'mongoose';

export interface IExecution extends Document {
  userId: Types.ObjectId;
  title: string;
  conversationId: Types.ObjectId; // Directly links to the target conversation
  createdAt: Date;
  updatedAt: Date;
}

const ExecutionSchema = new Schema<IExecution>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true }
}, { timestamps: true });

export const Execution = model<IExecution>('Execution', ExecutionSchema);
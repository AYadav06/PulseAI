import { Schema, model, Document, Types } from 'mongoose';

export interface IMessage {
  content: string;
  role: 'user' | 'assistant' | 'system';
  createdAt: Date;
}

export interface IConversation extends Document {
  userId: Types.ObjectId;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  content: { type: String, required: true },
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  createdAt: { type: Date, default: Date.now }
});

const ConversationSchema = new Schema<IConversation>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [MessageSchema]
}, { timestamps: true });

export const Conversation = model<IConversation>('Conversation', ConversationSchema);
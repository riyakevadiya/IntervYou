import mongoose, { Schema, Document, Model } from 'mongoose';

export interface UserDocument extends Document {
	username: string;
	email: string;
	passwordHash: string;
	createdAt: Date;
	lastLogin?: Date;
}

const userSchema = new Schema<UserDocument>({
	username: { type: String, required: true, unique: true, trim: true },
	email: { type: String, required: true, unique: true, lowercase: true, trim: true },
	passwordHash: { type: String, required: true },
	createdAt: { type: Date, default: () => new Date() },
	lastLogin: { type: Date },
});

export const User: Model<UserDocument> = mongoose.models.User || mongoose.model<UserDocument>('User', userSchema);

export interface InterviewFeedbackItem {
	question: string;
	answer: string;
	feedback?: string;
}

export interface InterviewSessionDocument extends Document {
	userId: mongoose.Types.ObjectId;
	type: string; // behavioral/technical/leadership
	level: string; // junior/mid/senior
	role: string;
	duration: number; // seconds
	score: number;
	feedback: InterviewFeedbackItem[];
	strengths: string[];
	improvements: string[];
	createdAt: Date;
}

const interviewFeedbackItemSchema = new Schema<InterviewFeedbackItem>({
	question: { type: String, required: true },
	answer: { type: String, required: true },
	feedback: { type: String },
});

const interviewSessionSchema = new Schema<InterviewSessionDocument>({
	userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
	type: { type: String, required: true },
	level: { type: String, required: true },
	role: { type: String, required: true },
	duration: { type: Number, required: true },
	score: { type: Number, required: true },
	feedback: { type: [interviewFeedbackItemSchema], default: [] },
	strengths: { type: [String], default: [] },
	improvements: { type: [String], default: [] },
	createdAt: { type: Date, default: () => new Date() },
});

export const InterviewSession: Model<InterviewSessionDocument> = mongoose.models.InterviewSession || mongoose.model<InterviewSessionDocument>('InterviewSession', interviewSessionSchema);


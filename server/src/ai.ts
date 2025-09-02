import { InterviewSession } from './models';

export interface GenerateQuestionsInput {
	userId: string;
	type: string; // behavioral/technical/leadership
	role: string;
	level: string; // junior/mid/senior
	count: number;
}

// Free question templates - no API calls needed
const questionTemplates = {
	behavioral: {
		entry: [
			"Tell me about a time when you had to learn a new skill quickly. How did you approach it?",
			"Describe a situation where you had to work with someone difficult. How did you handle it?",
			"Can you share an example of when you went above and beyond what was expected?",
			"What's a challenge you faced in your previous role and how did you overcome it?",
			"Tell me about a time when you had to make a decision without all the information you needed."
		],
		mid: [
			"Describe a project where you had to lead a team through a difficult situation.",
			"Tell me about a time when you had to implement a major change that wasn't popular.",
			"Can you share an example of when you had to resolve a conflict between team members?",
			"What's a strategic decision you made that had a significant impact on your organization?",
			"Tell me about a time when you had to manage competing priorities and deadlines."
		],
		senior: [
			"Describe a situation where you had to transform an underperforming team into a high-performing one.",
			"Tell me about a time when you had to make a difficult decision that affected the entire company.",
			"Can you share an example of when you had to navigate a major organizational change?",
			"What's a crisis you managed and what was the outcome?",
			"Tell me about a time when you had to influence stakeholders who were resistant to change."
		]
	},
	technical: {
		entry: [
			"How would you explain a complex technical concept to a non-technical person?",
			"Describe a technical problem you solved recently. What was your approach?",
			"What programming languages are you most comfortable with and why?",
			"How do you stay updated with the latest technology trends?",
			"Can you walk me through your debugging process when you encounter an issue?"
		],
		mid: [
			"Tell me about a complex system you designed and what challenges you faced.",
			"How do you approach code reviews and what do you look for?",
			"Describe a time when you had to refactor legacy code. What was your strategy?",
			"What's your experience with system architecture and design patterns?",
			"How do you handle technical debt in your projects?"
		],
		senior: [
			"Describe a large-scale system you architected and what made it successful.",
			"Tell me about a time when you had to make a major technical decision that affected multiple teams.",
			"How do you approach technical strategy and roadmap planning?",
			"What's your experience with leading technical transformations?",
			"Can you share an example of when you had to balance technical excellence with business needs?"
		]
	},
	leadership: {
		entry: [
			"Tell me about a time when you had to motivate a team member who was struggling.",
			"Describe a situation where you had to give difficult feedback to someone.",
			"How do you handle situations where team members disagree on an approach?",
			"What's your leadership style and how has it evolved?",
			"Can you share an example of when you had to lead by example?"
		],
		mid: [
			"Describe a time when you had to lead a team through a major organizational change.",
			"Tell me about a situation where you had to manage up to senior leadership.",
			"How do you approach building and developing high-performing teams?",
			"What's your experience with strategic planning and execution?",
			"Can you share an example of when you had to make unpopular decisions?"
		],
		senior: [
			"Describe a time when you had to lead a company-wide transformation initiative.",
			"Tell me about a crisis you managed and how you led your organization through it.",
			"How do you approach building a strong organizational culture?",
			"What's your experience with board-level strategic discussions?",
			"Can you share an example of when you had to lead through significant uncertainty?"
		]
	}
};

export async function generateUniqueQuestions(input: GenerateQuestionsInput): Promise<string[]> {
	const { userId, type, level, count } = input;

	// Gather user's previous questions to avoid duplicates
	const past = await InterviewSession.find({ userId }).select('feedback.question').lean();
	const seenQuestions = new Set<string>();
	for (const s of past) {
		for (const f of (s as any).feedback || []) {
			if (f.question) seenQuestions.add(String(f.question).trim());
		}
	}

	// Get appropriate questions based on type and level
	const levelKey = level === 'entry' ? 'entry' : level === 'mid' ? 'mid' : 'senior';
	const availableQuestions = questionTemplates[type as keyof typeof questionTemplates]?.[levelKey as keyof typeof questionTemplates.behavioral] || questionTemplates.behavioral.entry;

	// Filter out questions the user has already seen
	const unusedQuestions = availableQuestions.filter(q => !seenQuestions.has(q));

	// If we don't have enough unused questions, add some generic ones
	if (unusedQuestions.length < count) {
		const genericQuestions = [
			"What are your career goals for the next 3-5 years?",
			"How do you handle stress and pressure in the workplace?",
			"What do you think makes a great team member?",
			"How do you approach continuous learning and development?",
			"What's a recent accomplishment you're proud of?"
		];
		
		const unusedGeneric = genericQuestions.filter(q => !seenQuestions.has(q));
		unusedQuestions.push(...unusedGeneric);
	}

	// Shuffle and return the requested number of questions
	const shuffled = unusedQuestions.sort(() => Math.random() - 0.5);
	return shuffled.slice(0, count);
}

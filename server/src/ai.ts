import { InterviewSession } from './models';

export interface GenerateQuestionsInput {
	userId: string;
	type: string; // behavioral/technical/leadership
	role: string;
	level: string; // entry/mid/senior
	count: number;
}

// TECHNICAL: role -> level -> questions
const technicalTemplates: Record<string, Record<string, string[]>> = {
	'Software Engineer': {
		entry: [
			"Implement a function to check if a string is a palindrome.",
			"Given an array of integers, return the indices of two numbers that add up to a target.",
			"Explain the difference between stacks and queues with use cases.",
			"What is Big-O notation? Compare O(n), O(n log n), and O(n^2).",
			"Design a basic REST API for a todo list (endpoints, status codes).",
		],
		mid: [
			"Design a URL shortener like bit.ly. Discuss data model, API, and high throughput.",
			"Implement an LRU cache and explain time/space complexity.",
			"Merge two sorted arrays into one sorted array in O(n).",
			"Design a rate limiter (token bucket vs leaky bucket).",
			"Detect a cycle in a linked list and return the node where the cycle begins.",
		],
		senior: [
			"Design a scalable logging system (ingestion, storage, indexing, query). Discuss trade-offs.",
			"How would you shard and replicate a database for a multi-region app?",
			"Implement a concurrent worker pool that processes tasks with backpressure handling.",
			"Design a real-time chat system (presence, message delivery, scaling, consistency).",
			"Optimize a slow microservice: outline methodology (profiling, tracing, caching, batching).",
		],
	},
	'Data Scientist': {
		entry: [
			"Explain train/validation/test splits and why they matter.",
			"What is overfitting? How do you prevent it?",
			"Describe precision vs recall with scenarios.",
			"How would you handle missing values in a dataset?",
			"What is gradient descent?",
		],
		mid: [
			"Design an A/B test to evaluate a recommendation algorithm.",
			"Discuss feature selection (mutual information, PCA, embeddings).",
			"Compare XGBoost vs neural networks for tabular data.",
			"Explain bias-variance tradeoff with a concrete example.",
			"Handle class imbalance and robust evaluation.",
		],
		senior: [
			"Design a feature store (governance, versioning, lineage).",
			"Productionize a model (monitoring, drift detection, retraining).",
			"Discuss online vs batch learning in streaming systems.",
			"Optimize inference latency (quantization, distillation, batching).",
			"Design a metric hierarchy for a multi-objective recommender.",
		],
	},
	'Product Manager': {
		entry: [
			"Prioritize a simple backlog using MoSCoW.",
			"Define success metrics for a new onboarding flow.",
			"Write a basic PRD for a profile page.",
		],
		mid: [
			"Design an MVP for a marketplace. What metrics define success?",
			"Create a roadmap with goals, guardrails, and KPIs.",
			"Trade-off decision between time-to-market and quality.",
		],
		senior: [
			"Define and align North Star metrics across multiple teams.",
			"Drive a multi-quarter strategy amid conflicting stakeholders.",
			"Post-launch analysis and iteration plan for a key product bet.",
		],
	},
	'Designer': {
		entry: [
			"Heuristic evaluation for an onboarding flow.",
			"Design a simple form with accessibility in mind.",
		],
		mid: [
			"Create a design system for a small SaaS (atoms/molecules).",
			"Run a usability study and synthesize insights.",
		],
		senior: [
			"Scale a design system across 5 product teams.",
			"Balance brand consistency with experimental UI in a new product.",
		],
	},
};

// BEHAVIORAL: role -> level -> questions
const behavioralTemplates: Record<string, Record<string, string[]>> = {
	'Software Engineer': {
		entry: [
			"Tell me about a time you learned a new technology quickly.",
			"Describe a time you received code review feedback and how you responded.",
		],
		mid: [
			"Tell me about a conflict you had over technical direction and how you resolved it.",
			"Describe a project where you influenced without formal authority.",
		],
		senior: [
			"Describe a time you led engineering change across teams.",
			"Tell me about a strategic decision that failed. What did you learn?",
		],
	},
	'Product Manager': {
		entry: [
			"Tell me about prioritizing conflicting tasks with limited information.",
			"Describe a time you handled ambiguous requirements.",
		],
		mid: [
			"Influenced stakeholders with competing goals—how?",
			"Describe pushing back on a timeline and the result.",
		],
		senior: [
			"Led cross-org initiative amid resistance—what did you do?",
			"Describe a bet that didn't pay off and how you adapted.",
		],
	},
	'Data Scientist': {
		entry: [
			"Tell me about communicating complex analysis to non-technical peers.",
			"Describe a time you handled messy data under time pressure.",
		],
		mid: [
			"Conflicting experimental results—how did you reconcile them?",
			"Describe collaborating with engineering to ship a model.",
		],
		senior: [
			"Leading ML strategy across teams—how did you drive alignment?",
			"Handling model failure in production—response and learnings?",
		],
	},
	default: {
		entry: ["Tell me about a time you learned a new skill quickly."],
		mid: ["Tell me about a conflict you resolved at work."],
		senior: ["Describe a time you led a major change initiative."],
	},
};

// LEADERSHIP mirrors behavioral but focuses on org impact
const leadershipTemplates: Record<string, Record<string, string[]>> = {
	'Software Engineer': {
		entry: ["Mentoring a junior engineer—how did you ensure growth?"],
		mid: ["Leading a small team through delivery under pressure."],
		senior: ["Driving org-wide engineering excellence initiatives."],
	},
	'Product Manager': {
		entry: ["Coordinating cross-functional stakeholders on a small launch."],
		mid: ["Leading roadmap alignment across multiple squads."],
		senior: ["Defining product strategy with executive stakeholders."],
	},
	default: {
		entry: ["Leading by example in small teams—share an instance."],
		mid: ["Leading cross-functional delivery under constraints."],
		senior: ["Leading at scale: culture, strategy, and outcomes."],
	},
};

function gatherByPriority(
	type: string,
	role: string,
	level: string,
): string[] {
	const levelKey = level === 'entry' ? 'entry' : level === 'mid' ? 'mid' : 'senior';
	let pool: string[] = [];

	const source = ((): Record<string, Record<string, string[]>> => {
		if (type === 'technical') return technicalTemplates;
		if (type === 'behavioral') return behavioralTemplates as any;
		return leadershipTemplates as any;
	})();

	// 1) role + level
	if (source[role]?.[levelKey]) pool.push(...source[role][levelKey]);
	// 2) role + other levels
	if (source[role]) {
		Object.entries(source[role]).forEach(([k, arr]) => {
			if (k !== levelKey) pool.push(...arr);
		});
	}
	// 3) other roles same level (to fill)
	Object.entries(source).forEach(([r, levels]) => {
		if (r === role) return;
		if (levels[levelKey]) pool.push(...levels[levelKey]);
	});
	// 4) default templates if present
	if ((source as any).default?.[levelKey]) pool.push(...(source as any).default[levelKey]);

	return pool;
}

export async function generateUniqueQuestions(input: GenerateQuestionsInput): Promise<string[]> {
	const { userId, type, role, level, count } = input;

	// Gather user's previous questions to avoid duplicates
	const past = await InterviewSession.find({ userId }).select('feedback.question').lean();
	const seenQuestions = new Set<string>();
	for (const s of past) {
		for (const f of (s as any).feedback || []) {
			if (f.question) seenQuestions.add(String(f.question).trim());
		}
	}

	// Build prioritized pool
	let pool = gatherByPriority(type, role, level);
	// De-duplicate pool and filter seen
	const dedup = Array.from(new Set(pool)).filter(q => !seenQuestions.has(q));

	// If still not enough, expand with all remaining across types as a last resort
	let finalPool = dedup;
	if (finalPool.length < count) {
		const allExtra: string[] = [];
		[technicalTemplates, behavioralTemplates as any, leadershipTemplates as any].forEach(src => {
			Object.values(src).forEach(levels => {
				Object.values(levels).forEach(arr => allExtra.push(...arr));
			});
		});
		for (const q of allExtra) {
			if (!seenQuestions.has(q) && !finalPool.includes(q)) finalPool.push(q);
			if (finalPool.length >= count) break;
		}
	}

	// Shuffle and slice
	const shuffled = finalPool.sort(() => Math.random() - 0.5);
	return shuffled.slice(0, count);
}

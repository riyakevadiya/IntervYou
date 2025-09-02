import { apiGet, apiPost, apiDelete } from './api';

export interface InterviewConfigDto {
	type: string; // behavioral/technical/leadership
	role: string;
	experience: string; // junior/mid/senior (maps to level)
	duration: string; // minutes as string in UI
	focus: string[];
}

export interface InterviewResultsDto {
	score: number;
	feedback: Array<{ question: string; answer: string; score?: number; feedback?: string }>;
	duration: number; // seconds in UI
	strengths: string[];
	improvements: string[];
}

export async function saveInterviewSession(config: InterviewConfigDto, results: InterviewResultsDto) {
	const payload = {
		type: config.type,
		level: config.experience,
		role: config.role,
		duration: results.duration, // seconds
		score: results.score,
		feedback: results.feedback.map(f => ({ question: f.question, answer: f.answer, feedback: f.feedback })),
		strengths: results.strengths,
		improvements: results.improvements,
	};
	const { data } = await apiPost('/sessions', payload);
	return data;
}

export async function listInterviewSessions() {
	const { data } = await apiGet('/sessions');
	return data as any[];
}

export async function deleteInterviewSession(id: string) {
	const { data } = await apiDelete(`/sessions/${id}`);
	return data as { ok: boolean };
}

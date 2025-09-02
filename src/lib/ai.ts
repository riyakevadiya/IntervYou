import { apiPost } from './api';

export async function fetchAiQuestions(params: { type: string; role: string; level: string; count?: number }) {
	const { data } = await apiPost<{ questions: string[] }>("/ai/generate-questions", params);
	return data.questions;
}


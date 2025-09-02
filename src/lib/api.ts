const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export interface ApiResponse<T> {
	data: T;
	status: number;
}

function getAuthToken(): string | null {
	try {
		return localStorage.getItem('intervyou_token');
	} catch {
		return null;
	}
}

export async function apiGet<T>(path: string): Promise<ApiResponse<T>> {
	const res = await fetch(`${API_BASE_URL}${path}`, {
		headers: {
			'Content-Type': 'application/json',
			...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
		},
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data?.message || 'Request failed');
	return { data, status: res.status };
}

export async function apiPost<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
	const res = await fetch(`${API_BASE_URL}${path}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
		},
		body: JSON.stringify(body),
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data?.message || 'Request failed');
	return { data, status: res.status };
}

export async function apiDelete<T>(path: string): Promise<ApiResponse<T>> {
	const res = await fetch(`${API_BASE_URL}${path}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
		},
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data?.message || 'Request failed');
	return { data, status: res.status };
}

export function setAuthToken(token: string | null) {
	try {
		if (token) localStorage.setItem('intervyou_token', token);
		else localStorage.removeItem('intervyou_token');
	} catch {
		// ignore
	}
}


import React, { useEffect, useState } from 'react';
import { listInterviewSessions, deleteInterviewSession } from '@/lib/sessions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Session {
	_id: string;
	type: string;
	level: string;
	role: string;
	duration: number;
	score: number;
	createdAt: string;
}

const formatTime = (seconds: number) => {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}m ${secs}s`;
};

const SessionHistory: React.FC = () => {
	const [sessions, setSessions] = useState<Session[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const load = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const data = await listInterviewSessions();
			setSessions(data);
		} catch (e: any) {
			setError(e?.message || 'Failed to load sessions');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		load();
	}, []);

	const handleDelete = async (id: string) => {
		try {
			await deleteInterviewSession(id);
			setSessions(prev => prev.filter(s => s._id !== id));
		} catch (e) {
			// ignore for now
		}
	};

	return (
		<div className="container mx-auto px-4 py-12">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">Feedback History</h1>
				<p className="text-muted-foreground">Review your past interview sessions</p>
			</div>

			{isLoading && <div className="text-sm text-muted-foreground">Loading...</div>}
			{error && <div className="text-sm text-destructive">{error}</div>}

			<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
				{sessions.map((s) => (
					<Card key={s._id}>
						<CardHeader>
							<CardTitle className="flex items-center justify-between">
								<span className="flex items-center gap-2">
									<Badge variant="outline" className="capitalize">{s.type}</Badge>
									<span className="text-sm text-muted-foreground capitalize">{s.level}</span>
								</span>
								<span className="text-lg font-semibold">{s.score}</span>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Role</span>
								<span className="font-medium">{s.role}</span>
							</div>
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Duration</span>
								<span className="font-medium">{formatTime(s.duration)}</span>
							</div>
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Date</span>
								<span className="font-medium">{new Date(s.createdAt).toLocaleString()}</span>
							</div>
							<div className="pt-2 flex gap-2">
								<Button variant="outline" size="sm" onClick={() => handleDelete(s._id)}>Delete</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{!isLoading && sessions.length === 0 && (
				<div className="text-sm text-muted-foreground">No sessions yet. Complete an interview to see it here.</div>
			)}
		</div>
	);
};

export default SessionHistory;


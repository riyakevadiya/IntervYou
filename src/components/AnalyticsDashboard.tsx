import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, BarChart3, Activity, CheckCircle, AlertTriangle, PieChart as PieIcon } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface QuestionFeedback {
	question: string;
	score: number;
	analysis?: {
		metrics?: {
			wordCount?: number;
			speakingTime?: number;
			fillerWords?: number;
			confidence?: number;
		};
	};
}

interface AnalyticsDashboardProps {
	overallScore: number;
	feedback: QuestionFeedback[];
	strengths: string[];
	improvements: string[];
	historicalScores?: { name: string; score: number }[];
}

const COLORS = ['#16a34a', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6'];

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ overallScore, feedback, strengths, improvements, historicalScores }) => {
	const questionScores = feedback.map((f, i) => ({ name: `Q${i + 1}`, score: f.score }));
	const avgScore = Math.round(questionScores.reduce((s, q) => s + q.score, 0) / Math.max(questionScores.length, 1));
	const fillerData = feedback.map((f, i) => ({ name: `Q${i + 1}`, filler: f.analysis?.metrics?.fillerWords ?? 0 }));
	const confidenceData = feedback.map((f, i) => ({ name: `Q${i + 1}`, confidence: f.analysis?.metrics?.confidence ?? f.score }));

	// Pie: strengths vs weaknesses count
	const swPie = [
		{ name: 'Strengths', value: strengths.length || 0, color: '#16a34a' },
		{ name: 'Improvements', value: improvements.length || 0, color: '#ef4444' },
	];

	// Pie: score distribution buckets
	const dist = { excellent: 0, good: 0, average: 0, needs: 0 } as Record<string, number>;
	feedback.forEach(f => {
		if (f.score >= 90) dist.excellent++;
		else if (f.score >= 80) dist.good++;
		else if (f.score >= 70) dist.average++;
		else dist.needs++;
	});
	const distPie = [
		{ name: 'Excellent', value: dist.excellent, color: '#16a34a' },
		{ name: 'Good', value: dist.good, color: '#0ea5e9' },
		{ name: 'Average', value: dist.average, color: '#f59e0b' },
		{ name: 'Needs Work', value: dist.needs, color: '#ef4444' },
	];

	const strengthsTop = strengths.slice(0, 5);
	const improvementsTop = improvements.slice(0, 5);

	return (
		<div className="space-y-8">
			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg">
							<TrendingUp className="h-5 w-5" /> Overall Score
						</CardTitle>
						<CardDescription>Your aggregated interview performance</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-4xl font-bold mb-2">{overallScore}</div>
						<Progress value={overallScore} />
						<div className="text-xs text-muted-foreground mt-2">Target: 85+</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg">
							<BarChart3 className="h-5 w-5" /> Average Question Score
						</CardTitle>
						<CardDescription>Consistency across questions</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-4xl font-bold mb-2">{avgScore}</div>
						<ResponsiveContainer width="100%" height={100}>
							<LineChart data={questionScores}>
								<CartesianGrid strokeDasharray="3 3" stroke="#eee" />
								<XAxis dataKey="name" tick={{ fontSize: 12 }} />
								<YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
								<Tooltip />
								<Line type="monotone" dataKey="score" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3 }} />
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg">
							<Activity className="h-5 w-5" /> Confidence Trend
						</CardTitle>
						<CardDescription>Question relevance and clarity</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={140}>
							<BarChart data={confidenceData}>
								<CartesianGrid strokeDasharray="3 3" stroke="#eee" />
								<XAxis dataKey="name" tick={{ fontSize: 12 }} />
								<YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
								<Tooltip />
								<Bar dataKey="confidence" fill="#16a34a" radius={[4, 4, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>

			{/* Comparison vs previous sessions */}
			{historicalScores && historicalScores.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg">
							<TrendingUp className="h-5 w-5" /> Trend Over Recent Sessions
						</CardTitle>
						<CardDescription>How your total score evolved</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={200}>
							<LineChart data={historicalScores}>
								<CartesianGrid strokeDasharray="3 3" stroke="#eee" />
								<XAxis dataKey="name" tick={{ fontSize: 12 }} />
								<YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
								<Tooltip />
								<Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			)}

			{/* Question Scores */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-lg">
						<Target className="h-5 w-5" /> Question-wise Scores
					</CardTitle>
					<CardDescription>Identify strong and weak questions at a glance</CardDescription>
				</CardHeader>
				<CardContent>
					<ResponsiveContainer width="100%" height={240}>
						<BarChart data={questionScores}>
							<CartesianGrid strokeDasharray="3 3" stroke="#eee" />
							<XAxis dataKey="name" tick={{ fontSize: 12 }} />
							<YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
							<Tooltip />
							<Bar dataKey="score" radius={[6, 6, 0, 0]}>
								{questionScores.map((_, idx) => (
									<Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			{/* Strengths & Weaknesses + Pies */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg">
							<CheckCircle className="h-5 w-5 text-success" /> Strengths
						</CardTitle>
						<CardDescription>Your top demonstrated capabilities</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="space-y-3">
							{strengthsTop.map((s, i) => (
								<li key={i} className="flex items-start gap-3">
									<div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
									<span className="text-sm">{s}</span>
								</li>
							))}
						</ul>
						<div className="mt-6">
							<div className="text-xs text-muted-foreground mb-2">Strengths vs Improvements</div>
							<ResponsiveContainer width="100%" height={180}>
								<PieChart>
									<Pie data={swPie} dataKey="value" nameKey="name" outerRadius={70}>
										{swPie.map((entry, index) => (
											<Cell key={`cell-sw-${index}`} fill={entry.color} />
										))}
									</Pie>
									<Tooltip />
								</PieChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg">
							<PieIcon className="h-5 w-5" /> Score Distribution
						</CardTitle>
						<CardDescription>How your answers scored overall</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={220}>
							<PieChart>
								<Pie data={distPie} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80}>
									{distPie.map((entry, index) => (
										<Cell key={`cell-dist-${index}`} fill={entry.color} />
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default AnalyticsDashboard;

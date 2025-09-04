import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, Star, Home, Download, Share2 
} from 'lucide-react';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

interface InterviewResultsProps {
  results: {
    score: number;
    feedback: Array<{
      question: string;
      answer: string;
      score: number;
      feedback: string;
      analysis?: {
        communication: string;
        structure: string;
        content: string;
        suggestions: string[];
        metrics: {
          wordCount: number;
          speakingTime: number;
          fillerWords: number;
          confidence: number;
        };
      };
    }>;
    duration: number;
    strengths: string[];
    improvements: string[];
  };
  onRetakeInterview: () => void;
  onGoHome: () => void;
}

const InterviewResults = ({ results, onRetakeInterview, onGoHome }: InterviewResultsProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { label: 'Excellent', variant: 'default' as const };
    if (score >= 80) return { label: 'Good', variant: 'secondary' as const };
    if (score >= 70) return { label: 'Average', variant: 'outline' as const };
    return { label: 'Needs Work', variant: 'destructive' as const };
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center">
              <Trophy className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Interview Complete!</h1>
          <p className="text-muted-foreground">Your professional performance analysis</p>
        </div>

        {/* Overall Summary */}
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Star className="h-5 w-5" />
              Overall Performance
            </CardTitle>
            <CardDescription>Summary of your latest interview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Score</div>
                <div className="text-3xl font-bold">{results.score}</div>
                <Badge variant={getScoreBadge(results.score).variant}>{getScoreBadge(results.score).label}</Badge>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Duration</div>
                <div className="text-3xl font-bold">{formatTime(results.duration)}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Questions</div>
                <div className="text-3xl font-bold">{results.feedback.length}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Status</div>
                <div className="text-3xl font-bold">{results.score >= 85 ? 'On Track' : 'Improve'}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Analytics Dashboard */}
        <AnalyticsDashboard 
          overallScore={results.score}
          feedback={results.feedback.map(f => ({
            question: f.question,
            score: f.score,
            analysis: f.analysis,
          }))}
          strengths={results.strengths}
          improvements={results.improvements}
        />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" onClick={onGoHome} className="gap-2">
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
          <Button variant="secondary" className="gap-2" onClick={onRetakeInterview}>
            <Star className="h-4 w-4" />
            Retake Interview
          </Button>
          <Button variant="ghost" className="gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
          <Button variant="ghost" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewResults;
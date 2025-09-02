import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, TrendingUp, Clock, Star, CheckCircle, AlertCircle, 
  RotateCcw, Download, Share2, Home, BarChart3 
} from 'lucide-react';

interface InterviewResultsProps {
  results: {
    score: number;
    feedback: Array<{
      question: string;
      answer: string;
      score: number;
      feedback: string;
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

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { label: 'Excellent', variant: 'default' as const };
    if (score >= 80) return { label: 'Good', variant: 'secondary' as const };
    if (score >= 70) return { label: 'Average', variant: 'outline' as const };
    return { label: 'Needs Work', variant: 'destructive' as const };
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center">
              <Trophy className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Interview Complete!</h1>
          <p className="text-muted-foreground">Here's your detailed performance analysis</p>
        </div>

        {/* Overall Score */}
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Star className="h-5 w-5" />
              Overall Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className={`text-6xl font-bold ${getScoreColor(results.score)}`}>
                {results.score}
              </div>
              <div className="text-2xl text-muted-foreground">out of 100</div>
              <Badge variant={getScoreBadge(results.score).variant} className="text-base px-4 py-1">
                {getScoreBadge(results.score).label}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-8 max-w-md mx-auto">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  Duration
                </div>
                <div className="text-xl font-semibold">{formatTime(results.duration)}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-1">
                  <BarChart3 className="h-4 w-4" />
                  Questions
                </div>
                <div className="text-xl font-semibold">{results.feedback.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Strengths & Improvements */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-success">
                  <CheckCircle className="h-5 w-5" />
                  Strengths
                </CardTitle>
                <CardDescription>What you did well</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {results.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-warning">
                  <AlertCircle className="h-5 w-5" />
                  Areas for Improvement
                </CardTitle>
                <CardDescription>Focus on these for next time</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {results.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Feedback */}
          <Card>
            <CardHeader>
              <CardTitle>Question-by-Question Analysis</CardTitle>
              <CardDescription>Detailed feedback for each response</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto">
              {results.feedback.map((item, index) => (
                <div key={index} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Question {index + 1}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={item.score} className="w-16" />
                      <span className={`text-sm font-semibold ${getScoreColor(item.score)}`}>
                        {item.score}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      {item.question}
                    </div>
                    <div className="text-sm bg-muted p-2 rounded">
                      <strong>Feedback:</strong> {item.feedback}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" onClick={onGoHome} className="gap-2">
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
          <Button variant="secondary" className="gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
          <Button variant="ghost" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share Results
          </Button>
          <Button variant="hero" onClick={onRetakeInterview} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Practice Again
          </Button>
        </div>

        {/* Improvement Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Next Steps
            </CardTitle>
            <CardDescription>Recommended actions to improve your interview skills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold mb-2">Practice More</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Take another mock interview to reinforce your improvements
                </p>
                <Button variant="outline" size="sm" onClick={onRetakeInterview}>
                  Start New Interview
                </Button>
              </div>
              
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold mb-2">Study Resources</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Access curated materials based on your interview type
                </p>
                <Button variant="outline" size="sm">
                  View Resources
                </Button>
              </div>
              
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold mb-2">Track Progress</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  View your improvement over time with detailed analytics
                </p>
                <Button variant="outline" size="sm">
                  View Analytics
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InterviewResults;
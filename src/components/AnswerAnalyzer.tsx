import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, MessageSquare, Clock, TrendingUp, 
  AlertCircle, CheckCircle, Lightbulb, Target 
} from 'lucide-react';

interface AnswerAnalysis {
  question: string;
  answer: string;
  score: number;
  feedback: {
    communication: string;
    structure: string;
    content: string;
    suggestions: string[];
  };
  metrics: {
    wordCount: number;
    speakingTime: number;
    fillerWords: number;
    confidence: number;
  };
}

interface AnswerAnalyzerProps {
  question: string;
  answer: string;
  onAnalysisComplete: (analysis: AnswerAnalysis) => void;
}

const AnswerAnalyzer = ({ question, answer, onAnalysisComplete }: AnswerAnalyzerProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnswerAnalysis | null>(null);

  useEffect(() => {
    if (answer.trim()) {
      analyzeAnswer();
    }
  }, [answer]);

  const analyzeAnswer = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const analysisResult = performNLPAnalysis(question, answer);
    setAnalysis(analysisResult);
    onAnalysisComplete(analysisResult);
    setIsAnalyzing(false);
  };

  const performNLPAnalysis = (question: string, answer: string): AnswerAnalysis => {
    const words = answer.toLowerCase().split(/\s+/);
    const wordCount = words.length;
    
    // Calculate speaking time (average 150 words per minute)
    const speakingTime = Math.round((wordCount / 150) * 60);
    
    // Detect filler words
    const fillerWords = ['um', 'uh', 'like', 'you know', 'basically', 'actually', 'sort of', 'kind of'];
    const fillerCount = words.filter(word => fillerWords.includes(word)).length;
    
    // Analyze content relevance
    const questionKeywords = extractKeywords(question);
    const answerKeywords = extractKeywords(answer);
    const keywordMatch = calculateKeywordMatch(questionKeywords, answerKeywords);
    
    // Analyze structure (STAR method detection)
    const structureScore = analyzeStructure(answer);
    
    // Calculate overall score
    const score = Math.min(100, Math.max(0, 
      (keywordMatch * 0.4) + 
      (structureScore * 0.3) + 
      (Math.max(0, 100 - fillerCount * 5) * 0.2) + 
      (Math.min(100, wordCount * 2) * 0.1)
    ));

    return {
      question,
      answer,
      score: Math.round(score),
      feedback: generateFeedback(score, keywordMatch, structureScore, fillerCount, wordCount),
      metrics: {
        wordCount,
        speakingTime,
        fillerWords: fillerCount,
        confidence: Math.round(keywordMatch)
      }
    };
  };

  const extractKeywords = (text: string): string[] => {
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them']);
    
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));
  };

  const calculateKeywordMatch = (questionKeywords: string[], answerKeywords: string[]): number => {
    if (questionKeywords.length === 0) return 100;
    
    const matches = questionKeywords.filter(q => 
      answerKeywords.some(a => a.includes(q) || q.includes(a))
    );
    
    return Math.round((matches.length / questionKeywords.length) * 100);
  };

  const analyzeStructure = (answer: string): number => {
    const starIndicators = {
      situation: ['when', 'situation', 'time', 'worked', 'job', 'project'],
      task: ['task', 'goal', 'objective', 'responsibility', 'needed'],
      action: ['did', 'implemented', 'created', 'developed', 'worked', 'collaborated'],
      result: ['result', 'outcome', 'achieved', 'improved', 'successful', 'impact']
    };

    let structureScore = 0;
    const answerLower = answer.toLowerCase();

    Object.values(starIndicators).forEach(indicators => {
      if (indicators.some(indicator => answerLower.includes(indicator))) {
        structureScore += 25;
      }
    });

    return structureScore;
  };

  const generateFeedback = (
    score: number, 
    keywordMatch: number, 
    structureScore: number, 
    fillerCount: number, 
    wordCount: number
  ) => {
    const feedback = {
      communication: '',
      structure: '',
      content: '',
      suggestions: [] as string[]
    };

    // Communication feedback
    if (fillerCount === 0) {
      feedback.communication = "Excellent communication with no filler words. Clear and confident delivery.";
    } else if (fillerCount <= 2) {
      feedback.communication = "Good communication with minimal filler words. Consider pausing instead of using fillers.";
    } else {
      feedback.communication = "Communication could be improved by reducing filler words. Practice pausing and thinking before speaking.";
    }

    // Structure feedback
    if (structureScore >= 75) {
      feedback.structure = "Great use of the STAR method! Your answer is well-structured and easy to follow.";
    } else if (structureScore >= 50) {
      feedback.structure = "Good structure, but consider using the STAR method more explicitly for better organization.";
    } else {
      feedback.structure = "Consider using the STAR method (Situation, Task, Action, Result) to structure your response better.";
    }

    // Content feedback
    if (keywordMatch >= 80) {
      feedback.content = "Excellent content relevance! Your answer directly addresses the question.";
    } else if (keywordMatch >= 60) {
      feedback.content = "Good content, but try to be more specific and directly address the key points of the question.";
    } else {
      feedback.content = "Your answer could be more focused on the specific question. Consider rephrasing to better match the question.";
    }

    // Suggestions
    if (wordCount < 30) {
      feedback.suggestions.push("Provide more specific examples and details to strengthen your answer.");
    }
    if (fillerCount > 3) {
      feedback.suggestions.push("Practice speaking without filler words to sound more professional.");
    }
    if (structureScore < 50) {
      feedback.suggestions.push("Use the STAR method: describe the Situation, explain your Task, detail your Actions, and share the Results.");
    }
    if (keywordMatch < 70) {
      feedback.suggestions.push("Focus on directly answering the question with relevant examples.");
    }

    return feedback;
  };

  if (isAnalyzing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 animate-pulse" />
            Analyzing Your Answer...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-muted-foreground">Processing your response with AI analysis...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Answer Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Score */}
        <div className="text-center space-y-2">
          <div className="text-3xl font-bold text-primary">{analysis.score}/100</div>
          <div className="text-sm text-muted-foreground">Overall Score</div>
          <Progress value={analysis.score} className="w-full" />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-lg font-semibold">{analysis.metrics.wordCount}</div>
            <div className="text-xs text-muted-foreground">Words</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-lg font-semibold">{analysis.metrics.speakingTime}s</div>
            <div className="text-xs text-muted-foreground">Speaking Time</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-lg font-semibold">{analysis.metrics.fillerWords}</div>
            <div className="text-xs text-muted-foreground">Filler Words</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-lg font-semibold">{analysis.metrics.confidence}%</div>
            <div className="text-xs text-muted-foreground">Relevance</div>
          </div>
        </div>

        {/* Feedback Sections */}
        <div className="space-y-3">
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">Communication</span>
            </div>
            <p className="text-sm text-green-700">{analysis.feedback.communication}</p>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">Structure</span>
            </div>
            <p className="text-sm text-blue-700">{analysis.feedback.structure}</p>
          </div>

          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-purple-600" />
              <span className="font-medium text-purple-800">Content</span>
            </div>
            <p className="text-sm text-purple-700">{analysis.feedback.content}</p>
          </div>
        </div>

        {/* Suggestions */}
        {analysis.feedback.suggestions.length > 0 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-yellow-600" />
              <span className="font-medium text-yellow-800">Suggestions for Improvement</span>
            </div>
            <ul className="text-sm text-yellow-700 space-y-1">
              {analysis.feedback.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnswerAnalyzer;

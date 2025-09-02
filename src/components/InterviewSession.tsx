import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, MicOff, Video, VideoOff, Phone, Clock, Brain, 
  MessageSquare, RotateCcw, CheckCircle, AlertCircle 
} from 'lucide-react';
import SpeechRecorder from './SpeechRecorder';
import AnswerAnalyzer from './AnswerAnalyzer';

interface InterviewSessionProps {
  config: any;
  onEndInterview: (results: InterviewResults) => void;
}

interface InterviewResults {
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
}

const InterviewSession = ({ config, onEndInterview }: InterviewSessionProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isAnswering, setIsAnswering] => useState(false);
  const [answers, setAnswers] = useState<Array<{
    question: string;
    answer: string;
    analysis?: any;
  }>>([]);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // If AI-provided questions exist, use them; otherwise fallback to defaults
  const fallbackQuestions = [
    {
      id: 1,
      type: 'opening',
      question: "Hello! I'm your AI interviewer. Can you start by telling me about yourself and what brings you here today?",
      expectedDuration: 180
    },
    {
      id: 2,
      type: 'behavioral',
      question: "Tell me about a time when you had to overcome a significant challenge at work. How did you approach it?",
      expectedDuration: 240
    },
    {
      id: 3,
      type: 'technical',
      question: "How would you explain your technical skills and experience relevant to this role?",
      expectedDuration: 300
    },
    {
      id: 4,
      type: 'situational',
      question: "Imagine you're working on a project with a tight deadline, but you discover a major issue. What would you do?",
      expectedDuration: 180
    },
    {
      id: 5,
      type: 'closing',
      question: "Do you have any questions about the role or our company? And is there anything else you'd like to share?",
      expectedDuration: 120
    }
  ];

  const questions = (Array.isArray(config?.questions) && config.questions.length > 0)
    ? (config.questions as string[]).map((q: string, idx: number) => ({
        id: idx + 1,
        type: config.type || 'general',
        question: q,
        expectedDuration: 180,
      }))
    : fallbackQuestions;

  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSubmit = (answer: string) => {
    const newAnswer = {
      question: questions[currentQuestion].question,
      answer: answer
    };
    
    setAnswers(prev => [...prev, newAnswer]);
    setCurrentAnswer(answer);
    setShowAnalysis(true);
  };

  const handleAnalysisComplete = (analysis: any) => {
    setAnswers(prev => prev.map((ans, idx) => 
      idx === prev.length - 1 ? { ...ans, analysis } : ans
    ));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setCurrentAnswer('');
      setIsAnswering(false);
      setShowAnalysis(false);
    } else {
      // End interview
      const totalScore = answers.reduce((sum, ans) => sum + (ans.analysis?.score || 70), 0) / answers.length;
      
      const results: InterviewResults = {
        score: Math.round(totalScore),
        feedback: questions.map((q, idx) => {
          const answer = answers[idx] || { answer: "No answer provided", analysis: null };
          return {
            question: q.question,
            answer: answer.answer,
            score: answer.analysis?.score || 70,
            feedback: answer.analysis ? 
              `${answer.analysis.feedback.communication} ${answer.analysis.feedback.structure} ${answer.analysis.feedback.content}` :
              "Good structure and clear communication. Consider providing more specific examples.",
            analysis: answer.analysis
          };
        }),
        duration: timeElapsed,
        strengths: answers.filter(ans => ans.analysis?.score >= 80).length > 0 ? 
          ["Strong communication", "Good structure", "Relevant content"] : 
          ["Professional demeanor", "Good engagement"],
        improvements: answers.filter(ans => ans.analysis?.score < 70).length > 0 ?
          ["Improve answer structure", "Reduce filler words", "Provide more specific examples"] :
          ["Complete the full interview", "Provide more detailed responses"]
      };
      onEndInterview(results);
    }
  };

  const handleEndInterview = () => {
    const totalScore = answers.reduce((sum, ans) => sum + (ans.analysis?.score || 70), 0) / Math.max(answers.length, 1);
    
    const results: InterviewResults = {
      score: Math.round(totalScore),
      feedback: questions.slice(0, currentQuestion + 1).map((q, idx) => {
        const answer = answers[idx] || { answer: "No answer provided", analysis: null };
        return {
          question: q.question,
          answer: answer.answer,
          score: answer.analysis?.score || 70,
          feedback: answer.analysis ? 
            `${answer.analysis.feedback.communication} ${answer.analysis.feedback.structure} ${answer.analysis.feedback.content}` :
            "Interview ended early. Consider completing all questions for comprehensive feedback.",
          analysis: answer.analysis
        };
      }),
      duration: timeElapsed,
      strengths: answers.filter(ans => ans.analysis?.score >= 80).length > 0 ? 
        ["Strong communication", "Good structure", "Relevant content"] : 
        ["Professional start", "Good engagement"],
      improvements: answers.filter(ans => ans.analysis?.score < 70).length > 0 ?
        ["Improve answer structure", "Reduce filler words", "Provide more specific examples"] :
        ["Complete the full interview", "Provide more detailed responses"]
    };
    onEndInterview(results);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
                <span className="text-sm font-medium">Recording</span>
              </div>
              <Badge variant="outline">{config.type} Interview</Badge>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                {formatTime(timeElapsed)}
              </div>
              <Progress value={progress} className="w-32" />
              <span className="text-sm text-muted-foreground">
                {currentQuestion + 1} of {totalQuestions}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Interviewer */}
            <Card>
              <CardContent className="p-6">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-4 mx-auto">
                      <Brain className="h-10 w-10 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">AI Interviewer</h3>
                    <p className="text-sm text-muted-foreground">Sarah - Senior Interviewer</p>
                  </div>
                </div>
                
                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant={isMuted ? "destructive" : "secondary"}
                    size="icon"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant={!isVideoOn ? "destructive" : "secondary"}
                    size="icon"
                    onClick={() => setIsVideoOn(!isVideoOn)}
                  >
                    {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                  <Button variant="destructive" size="icon" onClick={handleEndInterview}>
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Speech Recorder */}
            <SpeechRecorder
              question={questions[currentQuestion]?.question || ''}
              onAnswerSubmit={handleAnswerSubmit}
              isRecording={isRecording}
              onRecordingChange={setIsRecording}
            />

            {/* Answer Analysis */}
            {showAnalysis && currentAnswer && (
              <AnswerAnalyzer
                question={questions[currentQuestion]?.question || ''}
                answer={currentAnswer}
                onAnalysisComplete={handleAnalysisComplete}
              />
            )}
          </div>

          {/* Question & Info Panel */}
          <div className="space-y-6">
            {/* Current Question */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Question {currentQuestion + 1}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-foreground leading-relaxed">
                    {questions[currentQuestion]?.question}
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Suggested: {Math.floor(questions[currentQuestion]?.expectedDuration / 60)}m {questions[currentQuestion]?.expectedDuration % 60}s
                  </div>

                  <div className="space-y-2">
                    {currentAnswer ? (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Answer Submitted</span>
                        </div>
                        <p className="text-sm text-green-700">Your answer has been recorded and analyzed.</p>
                      </div>
                    ) : (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Mic className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">Ready to Answer</span>
                        </div>
                        <p className="text-sm text-blue-700">Use the voice recorder below to answer this question.</p>
                      </div>
                    )}
                    
                    {currentQuestion < questions.length - 1 ? (
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="w-full"
                        onClick={handleNextQuestion}
                        disabled={!currentAnswer}
                      >
                        Next Question
                      </Button>
                    ) : (
                      <Button 
                        variant="success" 
                        size="sm" 
                        className="w-full gap-2"
                        onClick={handleNextQuestion}
                        disabled={!currentAnswer}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Complete Interview
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interview Info */}
            <Card>
              <CardHeader>
                <CardTitle>Interview Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Type:</span>
                  <Badge variant="outline" className="capitalize">{config.type}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Role:</span>
                  <span className="font-medium">{config.role}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{config.duration} min</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress:</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Quick Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Look directly at the camera</li>
                  <li>• Speak clearly and at a steady pace</li>
                  <li>• Use the STAR method for behavioral questions</li>
                  <li>• Take a moment to think before responding</li>
                  <li>• Ask clarifying questions if needed</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;
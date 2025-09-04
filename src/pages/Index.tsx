import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeatureShowcase from '@/components/FeatureShowcase';
import InterviewSetup from '@/components/InterviewSetup';
import InterviewSession from '@/components/InterviewSession';
import InterviewResults from '@/components/InterviewResults';
import { saveInterviewSession, listInterviewSessions } from '@/lib/sessions';
import SessionHistory from '@/components/SessionHistory';
import { fetchAiQuestions } from '@/lib/ai';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';


type AppSection = 'home' | 'setup' | 'interview' | 'results' | 'practice' | 'analytics' | 'feedback';

interface InterviewConfig {
  type: string;
  role: string;
  experience: string;
  duration: string;
  focus: string[];
  questions?: string[];
}

interface InterviewResultsType {
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

const Index = () => {
  const [currentSection, setCurrentSection] = useState<AppSection>('home');
  const [interviewConfig, setInterviewConfig] = useState<InterviewConfig | null>(null);
  const [interviewResults, setInterviewResults] = useState<InterviewResultsType | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  const handleStartInterview = () => {
    setCurrentSection('setup');
  };

  const handleConfigureInterview = async (config: InterviewConfig) => {
    // Fetch AI questions from backend (non-repeating for user)
    try {
      const questions = await fetchAiQuestions({ type: config.type, role: config.role, level: config.experience, count: 5 });
      setInterviewConfig({ ...config, questions });
    } catch {
      // If AI fails, fall back to no questions (component will use defaults)
      setInterviewConfig(config);
    }
    setCurrentSection('interview');
  };

  const handleEndInterview = async (results: InterviewResultsType) => {
    setInterviewResults(results);
    setCurrentSection('results');
    try {
      if (interviewConfig) {
        await saveInterviewSession(interviewConfig, results);
      }
    } catch (e) {
      console.error('Failed to save session', e);
    }
  };

  const handleRetakeInterview = () => {
    setInterviewConfig(null);
    setInterviewResults(null);
    setCurrentSection('setup');
  };

  const handleGoHome = () => {
    setInterviewConfig(null);
    setInterviewResults(null);
    setCurrentSection('home');
  };

  const handleNavigation = (section: string) => {
    if (section === 'home') {
      handleGoHome();
    } else {
      setCurrentSection(section as AppSection);
    }
  };

  // Auto-load latest session for analytics if none in memory
  useEffect(() => {
    const loadLatest = async () => {
      if (currentSection !== 'analytics' || interviewResults) return;
      try {
        setLoadingAnalytics(true);
        const sessions = await listInterviewSessions();
        if (Array.isArray(sessions) && sessions.length > 0) {
          const s = sessions[0]; // assuming sorted desc by backend
          const transformed: InterviewResultsType = {
            score: s.score ?? 0,
            duration: s.duration ?? 0,
            feedback: (s.feedback ?? []).map((f: any) => ({
              question: f.question ?? '',
              answer: f.answer ?? '',
              score: f.score ?? 0,
              feedback: f.feedback ?? '',
              analysis: f.analysis ?? undefined,
            })),
            strengths: s.strengths ?? [],
            improvements: s.improvements ?? [],
          };
          setInterviewResults(transformed);
        }
      } catch (e) {
        console.error('Failed to load analytics', e);
      } finally {
        setLoadingAnalytics(false);
      }
    };
    loadLatest();
  }, [currentSection, interviewResults]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Always visible */}
      <Header 
        onNavigate={handleNavigation} 
        currentSection={currentSection}
      />

      {/* Main Content */}
      <main>
        {currentSection === 'home' && (
          <>
            <HeroSection onStartInterview={handleStartInterview} />
            <FeatureShowcase />
          </>
        )}

        {currentSection === 'setup' && (
          <InterviewSetup 
            onStartInterview={handleConfigureInterview}
            onBack={handleGoHome}
          />
        )}

        {currentSection === 'interview' && interviewConfig && (
          <InterviewSession 
            config={interviewConfig}
            onEndInterview={handleEndInterview}
          />
        )}

        {currentSection === 'results' && interviewResults && (
          <InterviewResults 
            results={interviewResults}
            onRetakeInterview={handleRetakeInterview}
            onGoHome={handleGoHome}
          />
        )}

        {currentSection === 'practice' && (
          <div className="container mx-auto px-4 py-24 text-center">
            <h1 className="text-3xl font-bold mb-4">Practice Center</h1>
            <p className="text-muted-foreground mb-8">Choose your practice mode</p>
            <div className="space-y-4">
              <button 
                onClick={handleStartInterview}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Start New Interview
              </button>
            </div>
          </div>
        )}

        {currentSection === 'analytics' && (
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-6">Performance Analytics</h1>
            {loadingAnalytics ? (
              <div className="text-sm text-muted-foreground">Loading analytics...</div>
            ) : interviewResults ? (
              <AnalyticsDashboard 
                overallScore={interviewResults.score}
                feedback={interviewResults.feedback.map(f => ({
                  question: f.question,
                  score: f.score,
                  analysis: f.analysis
                }))}
                strengths={interviewResults.strengths}
                improvements={interviewResults.improvements}
              />
            ) : (
              <div className="text-sm text-muted-foreground">No recent interview results. Complete an interview to see analytics.</div>
            )}
          </div>
        )}

        {currentSection === 'feedback' && (
          <SessionHistory />
        )}
      </main>

      {/* Footer - Only on home page */}
      {currentSection === 'home' && (
        <footer className="border-t border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold">I</span>
                  </div>
                  <span className="font-bold">IntervYou</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  AI-powered interview preparation platform helping you ace your next job interview.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Platform</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition-colors">How it works</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Enterprise</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Resources</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition-colors">Interview Tips</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Career Guides</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Support</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
              © 2024 IntervYou. All rights reserved. Powered by AI.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Index;

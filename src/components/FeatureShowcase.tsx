import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, MessageSquare, BarChart3, Clock, Shield, Users, 
  Zap, Target, Award, Mic, Video, FileText 
} from 'lucide-react';
import aiAnalysisIcon from '@/assets/ai-analysis-icon.jpg';

const FeatureShowcase = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Interviews',
      description: 'Advanced AI conducts realistic interviews tailored to your role and experience level.',
      badge: 'Core Feature',
      gradient: 'from-primary/10 to-primary/5'
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Get instant feedback on your performance with detailed scoring and analysis.',
      badge: 'Popular',
      gradient: 'from-success/10 to-success/5'
    },
    {
      icon: MessageSquare,
      title: 'Natural Conversations',
      description: 'Practice with conversational AI that adapts to your responses and asks follow-ups.',
      badge: 'AI-Enhanced',
      gradient: 'from-warning/10 to-warning/5'
    },
    {
      icon: Target,
      title: 'Personalized Questions',
      description: 'Questions customized for your specific role, industry, and experience level.',
      badge: 'Customizable',
      gradient: 'from-destructive/10 to-destructive/5'
    },
    {
      icon: Clock,
      title: 'Flexible Duration',
      description: 'Choose from 15-minute quick sessions to full 60-minute comprehensive interviews.',
      badge: 'Flexible',
      gradient: 'from-secondary/10 to-secondary/5'
    },
    {
      icon: Award,
      title: 'Performance Tracking',
      description: 'Track your improvement over time with detailed progress reports and insights.',
      badge: 'Pro Feature',
      gradient: 'from-primary/10 to-primary/5'
    }
  ];

  const stats = [
    { label: 'Success Rate', value: '95%', description: 'of users report improved confidence' },
    { label: 'AI Accuracy', value: '98%', description: 'feedback accuracy rating' },
    { label: 'Response Time', value: '<2s', description: 'average AI response time' },
    { label: 'Interview Types', value: '10+', description: 'different interview formats' }
  ];

  const capabilities = [
    {
      icon: Mic,
      title: 'Voice Recognition',
      description: 'Advanced speech-to-text with natural language processing'
    },
    {
      icon: Video,
      title: 'Video Analysis',
      description: 'Body language and presentation feedback (coming soon)'
    },
    {
      icon: FileText,
      title: 'Resume Integration',
      description: 'Upload your resume for personalized question generation'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your interview data is encrypted and never shared'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Platform Features
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            Everything You Need to 
            <span className="bg-gradient-hero bg-clip-text text-transparent"> Ace Your Interview</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform provides comprehensive interview preparation with real-time feedback and personalized coaching.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-elevation transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Section */}
        <Card className="mb-16 overflow-hidden">
          <CardContent className="p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-foreground mb-1">{stat.label}</div>
                  <div className="text-xs text-muted-foreground">{stat.description}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Analysis Highlight */}
        <Card className="mb-16 overflow-hidden">
          <CardContent className="p-0">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="p-8 lg:p-12 space-y-6">
                <Badge variant="default" className="mb-2">
                  AI Technology
                </Badge>
                <h3 className="text-2xl font-bold">
                  Advanced AI Analysis Engine
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our proprietary AI engine analyzes your responses in real-time, providing instant feedback on content quality, communication skills, and interview techniques. Get insights that help you improve with every practice session.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    Natural language processing for content analysis
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    Real-time feedback and scoring
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    Personalized improvement recommendations
                  </li>
                </ul>
              </div>
              <div className="relative">
                <img 
                  src={aiAnalysisIcon} 
                  alt="AI Analysis Dashboard" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/20 to-transparent" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Capabilities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <div key={index} className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                  <Icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{capability.title}</h4>
                  <p className="text-sm text-muted-foreground">{capability.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
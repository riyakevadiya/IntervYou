import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Star, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AuthDialog from './AuthDialog';
import heroImage from '@/assets/hero-interview.jpg';

interface HeroSectionProps {
  onStartInterview: () => void;
}

const HeroSection = ({ onStartInterview }: HeroSectionProps) => {
  const { isAuthenticated } = useAuth();

  const handleStartInterview = () => {
    if (isAuthenticated) {
      onStartInterview();
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-accent/30 to-primary/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      <div className="container mx-auto px-4 py-24 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              <Star className="h-4 w-4 fill-current" />
              AI-Powered Interview Preparation
            </div>

            {/* Headlines */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                Master Your Next
                <span className="bg-gradient-hero bg-clip-text text-transparent block">
                  Interview
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Practice with our AI interviewer, get real-time feedback, and build confidence for your dream job.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-foreground">500K+</div>
                <div className="text-sm text-muted-foreground">Interviews Conducted</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-foreground">95%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-foreground">24/7</div>
                <div className="text-sm text-muted-foreground">AI Availability</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <Button 
                  variant="hero" 
                  size="lg" 
                  onClick={handleStartInterview}
                  className="gap-2 text-base"
                >
                  <Play className="h-5 w-5" />
                  Start Interview
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <AuthDialog
                  trigger={
                    <Button 
                      variant="hero" 
                      size="lg" 
                      className="gap-2 text-base"
                    >
                      <Play className="h-5 w-5" />
                      Start Interview
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  }
                  defaultTab="register"
                />
              )}
              <Button variant="outline" size="lg" className="gap-2 text-base">
                <Users className="h-5 w-5" />
                View Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-primary border-2 border-background flex items-center justify-center text-xs font-medium text-primary-foreground"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                Trusted by <span className="font-medium text-foreground">10,000+</span> job seekers
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-elevation">
              <img 
                src={heroImage} 
                alt="Professional interview preparation with AI"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-6 -left-6 bg-card border border-border rounded-xl p-4 shadow-elevation backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-success-foreground" />
                </div>
                <div>
                  <div className="text-sm font-medium">Performance</div>
                  <div className="text-lg font-bold text-success">+85%</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 bg-card border border-border rounded-xl p-4 shadow-elevation backdrop-blur-sm">
              <div className="text-sm font-medium text-muted-foreground">AI Confidence Score</div>
              <div className="text-2xl font-bold text-primary">9.2/10</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
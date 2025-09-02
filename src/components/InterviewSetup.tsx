import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Clock, Brain, Users, Code, MessageSquare, ArrowLeft, Play } from 'lucide-react';

interface InterviewSetupProps {
  onStartInterview: (config: InterviewConfig) => void;
  onBack: () => void;
}

interface InterviewConfig {
  type: string;
  role: string;
  experience: string;
  duration: string;
  focus: string[];
}

const InterviewSetup = ({ onStartInterview, onBack }: InterviewSetupProps) => {
  const [config, setConfig] = useState<InterviewConfig>({
    type: '',
    role: '',
    experience: '',
    duration: '',
    focus: []
  });

  const interviewTypes = [
    { id: 'behavioral', name: 'Behavioral', icon: MessageSquare, description: 'STAR method questions' },
    { id: 'technical', name: 'Technical', icon: Code, description: 'Coding & system design' },
    { id: 'case-study', name: 'Case Study', icon: Brain, description: 'Problem-solving scenarios' },
    { id: 'leadership', name: 'Leadership', icon: Users, description: 'Management situations' }
  ];

  const roles = [
    'Software Engineer', 'Product Manager', 'Data Scientist', 'Designer',
    'Marketing Manager', 'Sales Representative', 'Consultant', 'Analyst'
  ];

  const experienceLevels = [
    { id: 'entry', name: 'Entry Level', description: '0-2 years' },
    { id: 'mid', name: 'Mid Level', description: '3-5 years' },
    { id: 'senior', name: 'Senior Level', description: '6-10 years' },
    { id: 'executive', name: 'Executive', description: '10+ years' }
  ];

  const durations = [
    { id: '15', name: '15 minutes', description: 'Quick practice' },
    { id: '30', name: '30 minutes', description: 'Standard session' },
    { id: '45', name: '45 minutes', description: 'Comprehensive' },
    { id: '60', name: '60 minutes', description: 'Full interview' }
  ];

  const focusAreas = [
    'Communication', 'Problem Solving', 'Technical Skills', 'Leadership',
    'Teamwork', 'Adaptability', 'Creativity', 'Time Management'
  ];

  const toggleFocus = (focus: string) => {
    setConfig(prev => ({
      ...prev,
      focus: prev.focus.includes(focus) 
        ? prev.focus.filter(f => f !== focus)
        : [...prev.focus, focus]
    }));
  };

  const isConfigComplete = config.type && config.role && config.experience && config.duration;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Customize Your Interview</h1>
            <p className="text-muted-foreground">Tailor the AI interview to match your needs</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Configuration */}
          <div className="space-y-6">
            {/* Interview Type */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Interview Type
                </CardTitle>
                <CardDescription>Choose the style of interview questions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {interviewTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <div
                        key={type.id}
                        onClick={() => setConfig(prev => ({ ...prev, type: type.id }))}
                        className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-elevation ${
                          config.type === type.id 
                            ? 'border-primary bg-primary/5 shadow-primary' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Icon className={`h-6 w-6 mb-2 ${config.type === type.id ? 'text-primary' : 'text-muted-foreground'}`} />
                        <div className="font-medium">{type.name}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Role & Experience */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Role</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={config.role} onValueChange={(value) => setConfig(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={config.experience} onValueChange={(value) => setConfig(prev => ({ ...prev, experience: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map((level) => (
                        <SelectItem key={level.id} value={level.id}>
                          {level.name} - {level.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>

            {/* Duration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Interview Duration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {durations.map((duration) => (
                    <div
                      key={duration.id}
                      onClick={() => setConfig(prev => ({ ...prev, duration: duration.id }))}
                      className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-elevation ${
                        config.duration === duration.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="font-medium">{duration.name}</div>
                      <div className="text-xs text-muted-foreground">{duration.description}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Focus Areas */}
            <Card>
              <CardHeader>
                <CardTitle>Focus Areas (Optional)</CardTitle>
                <CardDescription>Select skills you want to emphasize</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {focusAreas.map((focus) => (
                    <Badge
                      key={focus}
                      variant={config.focus.includes(focus) ? "default" : "secondary"}
                      className="cursor-pointer hover:shadow-elevation transition-all"
                      onClick={() => toggleFocus(focus)}
                    >
                      {focus}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Interview Preview</CardTitle>
                <CardDescription>Your customized interview setup</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {config.type && (
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="font-medium capitalize">{config.type} Interview</span>
                  </div>
                )}
                {config.role && (
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>{config.role} Position</span>
                  </div>
                )}
                {config.experience && (
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="capitalize">{config.experience} Level</span>
                  </div>
                )}
                {config.duration && (
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>{config.duration} Minutes</span>
                  </div>
                )}
                {config.focus.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Focus Areas:</div>
                    <div className="flex flex-wrap gap-1">
                      {config.focus.map((focus) => (
                        <Badge key={focus} variant="outline" className="text-xs">
                          {focus}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Button 
                  variant="hero" 
                  size="lg" 
                  className="w-full gap-2 mt-6"
                  disabled={!isConfigComplete}
                  onClick={() => isConfigComplete && onStartInterview(config)}
                >
                  <Play className="h-5 w-5" />
                  Start AI Interview
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetup;
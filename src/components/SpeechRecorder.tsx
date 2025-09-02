import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Play, Square, RotateCcw, CheckCircle } from 'lucide-react';

interface SpeechRecorderProps {
  onAnswerSubmit: (answer: string) => void;
  question: string;
  isRecording: boolean;
  onRecordingChange: (recording: boolean) => void;
}

const SpeechRecorder = ({ onAnswerSubmit, question, isRecording, onRecordingChange }: SpeechRecorderProps) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript = transcript;
          }
        }

        setTranscript(prev => finalTranscript + interimTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        // Don't stop listening on errors, just log them
        if (event.error === 'no-speech') {
          // Restart recognition if no speech detected
          setTimeout(() => {
            if (isListening && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (e) {
                console.log('Recognition already started');
              }
            }
          }, 100);
        }
      };

      recognitionRef.current.onend = () => {
        // Auto-restart recognition if we're still supposed to be listening and not paused
        if (isListening && !isPaused && recognitionRef.current) {
          setTimeout(() => {
            try {
              recognitionRef.current?.start();
            } catch (e) {
              console.log('Recognition already started');
            }
          }, 100);
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isListening]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      // Start media recording
      mediaRecorderRef.current.start(1000); // Collect data every second
      onRecordingChange(true);
      setIsListening(true);

      // Start speech recognition with retry logic
      const startRecognition = () => {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
            console.log('Speech recognition started');
          } catch (e) {
            console.log('Recognition already started, retrying...');
            setTimeout(startRecognition, 100);
          }
        }
      };

      startRecognition();

      // Start recording timer
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const pauseRecording = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (recognitionRef.current && isListening && isPaused) {
      try {
        recognitionRef.current.start();
        setIsPaused(false);
      } catch (e) {
        console.log('Recognition already started');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      onRecordingChange(false);
      setIsListening(false);
      setIsPaused(false);
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
  };

  const playRecording = () => {
    if (audioBlob && !isPlaying) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
      setIsPlaying(true);

      audioRef.current.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
    }
  };

  const stopPlaying = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const resetRecording = () => {
    setTranscript('');
    setAudioBlob(null);
    setRecordingTime(0);
    onRecordingChange(false);
    setIsListening(false);
    setIsPlaying(false);
  };

  const submitAnswer = () => {
    if (transcript.trim()) {
      onAnswerSubmit(transcript.trim());
      resetRecording();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Voice Response
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Question Display */}
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm font-medium text-foreground">{question}</p>
        </div>

        {/* Recording Controls */}
        <div className="flex items-center justify-center gap-3">
          <Button
            variant={isListening ? "destructive" : "default"}
            size="lg"
            onClick={isListening ? stopRecording : startRecording}
            disabled={!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)}
            className={`w-20 h-20 rounded-full ${isListening ? 'animate-pulse' : ''}`}
          >
            {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </Button>
          
          {isListening && (
            <Button
              variant={isPaused ? "default" : "outline"}
              size="sm"
              onClick={isPaused ? resumeRecording : pauseRecording}
              className="w-16 h-16 rounded-full"
            >
              {isPaused ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>
          )}
        </div>
        
        {/* Continuous Recording Info */}
        {isListening && (
          <div className="text-center p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              💡 <strong>Continuous Mode:</strong> Speak naturally - the system will keep recording until you stop
            </p>
          </div>
        )}

        {/* Recording Status */}
        {isListening && (
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-destructive animate-pulse'}`} />
              <span className={`text-sm font-medium ${isPaused ? 'text-yellow-600' : 'text-destructive'}`}>
                {isPaused ? 'Paused' : 'Recording...'}
              </span>
            </div>
            <Badge variant="outline">{formatTime(recordingTime)}</Badge>
            {isPaused && (
              <p className="text-xs text-yellow-600">Click the small mic button to resume</p>
            )}
          </div>
        )}

        {/* Audio Playback Controls */}
        {audioBlob && !isListening && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={isPlaying ? stopPlaying : playRecording}
            >
              {isPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? 'Stop' : 'Play'}
            </Button>
          </div>
        )}

        {/* Transcript Display */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Answer (Transcript):</label>
          <Textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Your answer will appear here as you speak..."
            className="min-h-[100px] resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetRecording}
            className="flex-1"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={submitAnswer}
            disabled={!transcript.trim()}
            className="flex-1"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Submit Answer
          </Button>
        </div>

        {/* Browser Support Warning */}
        {!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ Speech recognition is not supported in this browser. 
              Please use Chrome, Edge, or Safari for voice input.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpeechRecorder;

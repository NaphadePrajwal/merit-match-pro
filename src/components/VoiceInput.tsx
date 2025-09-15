import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  language?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const VoiceInput = ({ 
  onTranscript, 
  language = 'en', 
  placeholder = "Tap to speak...",
  disabled = false,
  className = ""
}: VoiceInputProps) => {
  const [hasSpoken, setHasSpoken] = useState(false);
  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const { speak, stop: stopSpeaking, isSpeaking, isSupported: ttsSupported } = useTextToSpeech();

  useEffect(() => {
    if (transcript && hasSpoken) {
      onTranscript(transcript);
      setHasSpoken(false);
    }
  }, [transcript, hasSpoken, onTranscript]);

  const handleStartListening = () => {
    resetTranscript();
    setHasSpoken(true);
    startListening(language);
  };

  const handleStopListening = () => {
    stopListening();
    setHasSpoken(false);
  };

  const toggleListening = () => {
    if (isListening) {
      handleStopListening();
    } else {
      handleStartListening();
    }
  };

  const speakPlaceholder = () => {
    if (ttsSupported) {
      speak(placeholder, language);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Badge variant="secondary" className="text-xs">
          🎤 Voice not supported in this browser
        </Badge>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Button
        variant={isListening ? "default" : "outline"}
        size="icon"
        onClick={toggleListening}
        disabled={disabled}
        className={`transition-all duration-200 ${
          isListening 
            ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground animate-pulse' 
            : 'hover:scale-105'
        }`}
      >
        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </Button>
      
      {ttsSupported && (
        <Button
          variant="ghost"
          size="icon"
          onClick={isSpeaking ? stopSpeaking : speakPlaceholder}
          disabled={disabled}
          className="hover:scale-105 transition-transform"
        >
          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
      )}

      {isListening && (
        <Badge variant="default" className="animate-pulse">
          🎤 Listening...
        </Badge>
      )}

      {transcript && (
        <Badge variant="secondary" className="max-w-[200px] truncate">
          "{transcript}"
        </Badge>
      )}
    </div>
  );
};

export default VoiceInput;
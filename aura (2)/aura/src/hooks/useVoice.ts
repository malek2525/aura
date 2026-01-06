import { useState, useCallback } from 'react';

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

const useVoice = () => {
  const [hasSpeechSupport] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  });

  const [hasTTSSupport] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !!window.speechSynthesis;
  });

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useCallback(() => {
    if (typeof window === 'undefined' || !hasSpeechSupport) return null;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    return new SpeechRecognition();
  }, [hasSpeechSupport]);

  const startListening = useCallback(() => {
    if (!hasSpeechSupport) {
      setError('Speech recognition not supported');
      return;
    }

    const recognition = recognitionRef();
    if (!recognition) return;

    setLastTranscript('');
    setError(null);
    setIsListening(true);

    (recognition as any).continuous = false;
    (recognition as any).interimResults = false;
    (recognition as any).lang = 'en-US';

    (recognition as any).onstart = () => {
      setIsListening(true);
      setError(null);
    };

    (recognition as any).onresult = (event: SpeechRecognitionEvent) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setLastTranscript(transcript);
      setIsListening(false);
    };

    (recognition as any).onerror = (event: SpeechRecognitionErrorEvent) => {
      const errorMessages: Record<string, string> = {
        'network': 'Network error. Please check your connection.',
        'no-speech': 'No speech detected. Please try again.',
        'not-allowed': 'Microphone access denied. Please enable mic permissions.',
        'audio-capture': 'No microphone found.',
      };
      setError(errorMessages[event.error] || `Error: ${event.error}`);
      setIsListening(false);
    };

    (recognition as any).onend = () => {
      setIsListening(false);
    };

    (recognition as any).start();
  }, [hasSpeechSupport, recognitionRef]);

  const stopListening = useCallback(() => {
    const recognition = recognitionRef();
    if (recognition) {
      (recognition as any).stop();
    }
    setIsListening(false);
  }, [recognitionRef]);

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !hasTTSSupport || !text.trim()) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1.1;
    utterance.volume = 1;

    // Try to find a feminine voice
    const voices = window.speechSynthesis.getVoices();
    const feminineVoice = voices.find((voice) => {
      const lowerName = voice.name.toLowerCase();
      return (
        lowerName.includes('female') ||
        lowerName.includes('woman') ||
        lowerName.includes('amy') ||
        lowerName.includes('aria') ||
        lowerName.includes('emma') ||
        lowerName.includes('joanna') ||
        lowerName.includes('sara') ||
        lowerName.includes('luna')
      );
    });

    if (feminineVoice) {
      utterance.voice = feminineVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [hasTTSSupport]);

  const stopSpeaking = useCallback(() => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const clearTranscript = useCallback(() => {
    setLastTranscript('');
  }, []);

  return {
    hasSpeechSupport,
    hasTTSSupport,
    isListening,
    isSpeaking,
    lastTranscript,
    error,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    clearTranscript,
  };
};

export default useVoice;

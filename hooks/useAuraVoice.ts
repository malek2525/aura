import { useState, useCallback, useRef, useEffect } from 'react';

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

interface UseAuraVoiceReturn {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  lastFinalTranscript: string;
  error: string | null;
  hasSpeechSupport: boolean;
  hasTTSSupport: boolean;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  clearTranscript: () => void;
}

const getFeminineVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
  const feminineNames = ['amy', 'joanna', 'aria', 'sara', 'emma', 'luna', 'samantha', 'victoria', 'karen', 'moira', 'tessa', 'female'];
  
  for (const name of feminineNames) {
    const match = voices.find(v => v.name.toLowerCase().includes(name));
    if (match) return match;
  }
  
  const englishVoice = voices.find(v => v.lang.startsWith('en'));
  return englishVoice || voices[0] || null;
};

export const useAuraVoice = (): UseAuraVoiceReturn => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastFinalTranscript, setLastFinalTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isMountedRef = useRef(true);

  const hasSpeechSupport = typeof window !== 'undefined' && 
    !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  
  const hasTTSSupport = typeof window !== 'undefined' && !!window.speechSynthesis;

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      if (hasTTSSupport) {
        window.speechSynthesis.cancel();
      }
    };
  }, [hasTTSSupport]);

  const startListening = useCallback(() => {
    if (!hasSpeechSupport) {
      setError('Speech recognition not supported in this browser');
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }

    setTranscript('');
    setLastFinalTranscript('');
    setError(null);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      if (isMountedRef.current) {
        setIsListening(true);
        setError(null);
      }
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (!isMountedRef.current) return;

      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      if (finalTranscript) {
        setLastFinalTranscript(finalTranscript);
        setTranscript(finalTranscript);
      } else {
        setTranscript(interimTranscript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (!isMountedRef.current) return;

      const errorMessages: Record<string, string> = {
        'network': 'Network error. Check your connection.',
        'no-speech': 'No speech detected. Please try again.',
        'not-allowed': 'Microphone access denied.',
        'audio-capture': 'No microphone found.',
        'aborted': '',
      };

      const message = errorMessages[event.error] || `Error: ${event.error}`;
      if (message) {
        setError(message);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      if (isMountedRef.current) {
        setIsListening(false);
      }
    };

    try {
      recognition.start();
    } catch (e) {
      setError('Failed to start speech recognition');
      setIsListening(false);
    }
  }, [hasSpeechSupport]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  }, []);

  const speak = useCallback((text: string) => {
    if (!hasTTSSupport || !text.trim()) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    utterance.rate = 1;
    utterance.pitch = 1.1;
    utterance.volume = 1;

    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const voice = getFeminineVoice(voices);
      if (voice) {
        utterance.voice = voice;
      }
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      setVoice();
    } else {
      window.speechSynthesis.onvoiceschanged = setVoice;
    }

    utterance.onstart = () => {
      if (isMountedRef.current) {
        setIsSpeaking(true);
      }
    };

    utterance.onend = () => {
      if (isMountedRef.current) {
        setIsSpeaking(false);
      }
    };

    utterance.onerror = () => {
      if (isMountedRef.current) {
        setIsSpeaking(false);
      }
    };

    window.speechSynthesis.speak(utterance);
  }, [hasTTSSupport]);

  const stopSpeaking = useCallback(() => {
    if (hasTTSSupport) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, [hasTTSSupport]);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setLastFinalTranscript('');
  }, []);

  return {
    isListening,
    isSpeaking,
    transcript,
    lastFinalTranscript,
    error,
    hasSpeechSupport,
    hasTTSSupport,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    clearTranscript,
  };
};

export default useAuraVoice;

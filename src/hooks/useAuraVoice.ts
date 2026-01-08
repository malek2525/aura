
import { useState, useCallback, useRef, useEffect } from 'react';
import { speakWithAuraTTS } from '../services/tts';

// Types for Web Speech API
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

const getBestFeminineVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
  // Priority list for premium/natural sounding voices
  const premiumNames = ['aria', 'jenny', 'salli', 'joanna', 'emma', 'amy', 'sara', 'google us english female'];
  for (const name of premiumNames) {
    const match = voices.find(v => v.name.toLowerCase().includes(name));
    if (match) return match;
  }

  // Fallback to any voice marked "neural" or "female"
  const neuralVoice = voices.find(v => 
    v.name.toLowerCase().includes('neural') && 
    (v.name.toLowerCase().includes('female') || v.lang.startsWith('en'))
  );
  if (neuralVoice) return neuralVoice;

  const secondaryNames = ['samantha', 'victoria', 'karen', 'moira', 'tessa', 'zira', 'hazel', 'susan', 'linda', 'female'];
  for (const name of secondaryNames) {
    const match = voices.find(v => v.name.toLowerCase().includes(name));
    if (match) return match;
  }

  // Fallback to English
  return voices.find(v => v.lang === 'en-US') || voices.find(v => v.lang.startsWith('en')) || null;
};

export const useAuraVoice = (): UseAuraVoiceReturn => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastFinalTranscript, setLastFinalTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const isMountedRef = useRef(true);

  const hasSpeechSupport = typeof window !== 'undefined' && 
    !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  
  const hasTTSSupport = typeof window !== 'undefined' && !!window.speechSynthesis;

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
      if (hasTTSSupport) {
        window.speechSynthesis.cancel();
      }
    };
  }, [hasTTSSupport]);

  const startListening = useCallback(() => {
    if (!hasSpeechSupport) {
      setError('Speech recognition not supported');
      return;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
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
      console.warn("Speech recognition error", event.error);
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
          setError(event.error);
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
      try { recognitionRef.current.stop(); } catch {}
    }
    setIsListening(false);
  }, []);

  const speak = useCallback((text: string) => {
    if (!text.trim() || !hasTTSSupport) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0; 
    utterance.pitch = 1.05; // Slightly higher pitch for friendliness
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const voice = getBestFeminineVoice(voices);
    if (voice) utterance.voice = voice;

    utterance.onstart = () => isMountedRef.current && setIsSpeaking(true);
    utterance.onend = () => isMountedRef.current && setIsSpeaking(false);
    utterance.onerror = () => isMountedRef.current && setIsSpeaking(false);

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

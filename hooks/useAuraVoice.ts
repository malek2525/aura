import { useState, useCallback, useRef, useEffect } from 'react';
import { speakWithAuraTTS, checkTTSHealth } from '../services/voiceService';

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
  hasCloudTTS: boolean;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  clearTranscript: () => void;
}

const getBestFeminineVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
  const premiumNames = ['aria', 'jenny', 'salli', 'joanna', 'emma', 'amy', 'sara'];
  for (const name of premiumNames) {
    const match = voices.find(v => v.name.toLowerCase().includes(name));
    if (match) return match;
  }

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

  const enUSVoice = voices.find(v => v.lang === 'en-US');
  if (enUSVoice) return enUSVoice;

  const enGBVoice = voices.find(v => v.lang === 'en-GB');
  if (enGBVoice) return enGBVoice;

  const englishVoice = voices.find(v => v.lang.startsWith('en'));
  return englishVoice || voices[0] || null;
};

export const useAuraVoice = (): UseAuraVoiceReturn => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastFinalTranscript, setLastFinalTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hasCloudTTS, setHasCloudTTS] = useState(false);

  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMountedRef = useRef(true);

  const hasSpeechSupport = typeof window !== 'undefined' && 
    !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  
  const hasTTSSupport = typeof window !== 'undefined' && !!window.speechSynthesis;

  useEffect(() => {
    isMountedRef.current = true;
    
    checkTTSHealth().then(available => {
      if (isMountedRef.current) {
        setHasCloudTTS(available);
        console.log(`Cloud TTS available: ${available}`);
      }
    });

    return () => {
      isMountedRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
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

  const speakWithBrowserTTS = useCallback((text: string) => {
    if (!hasTTSSupport) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
    utterance.volume = 1;

    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const voice = getBestFeminineVoice(voices);
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

  const speakWithCloudTTS = useCallback(async (text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
          }

          setIsSpeaking(true);
          
          const audio = await speakWithAuraTTS(text);
          audioRef.current = audio;

          audio.onplay = () => {
            if (isMountedRef.current) {
              setIsSpeaking(true);
            }
          };

          audio.onended = () => {
            if (isMountedRef.current) {
              setIsSpeaking(false);
            }
            audioRef.current = null;
            resolve();
          };

          audio.onerror = () => {
            if (isMountedRef.current) {
              setIsSpeaking(false);
            }
            audioRef.current = null;
            reject(new Error('Audio playback failed'));
          };

          await audio.play();
        } catch (err) {
          console.error('Cloud TTS error:', err);
          if (isMountedRef.current) {
            setIsSpeaking(false);
          }
          reject(err);
        }
      })();
    });
  }, []);

  const speak = useCallback((text: string) => {
    if (!text.trim()) return;

    if (hasCloudTTS) {
      speakWithCloudTTS(text).catch(() => {
        if (hasTTSSupport) {
          speakWithBrowserTTS(text);
        } else {
          setError('No text-to-speech available');
          setIsSpeaking(false);
        }
      });
    } else if (hasTTSSupport) {
      speakWithBrowserTTS(text);
    } else {
      setError('No text-to-speech available in this browser');
    }
  }, [hasCloudTTS, hasTTSSupport, speakWithCloudTTS, speakWithBrowserTTS]);

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
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
    hasCloudTTS,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    clearTranscript,
  };
};

export default useAuraVoice;

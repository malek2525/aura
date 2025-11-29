import React, { useEffect, useRef } from 'react';

interface VoiceHook {
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

interface VoiceControlsProps {
  voice: VoiceHook;
  onFinalTranscript: (text: string) => void;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({ voice, onFinalTranscript }) => {
  const {
    isListening,
    isSpeaking,
    transcript,
    lastFinalTranscript,
    error,
    hasSpeechSupport,
    startListening,
    stopListening,
    stopSpeaking,
    clearTranscript,
  } = voice;

  const processedTranscriptRef = useRef<string>('');

  useEffect(() => {
    if (
      lastFinalTranscript &&
      lastFinalTranscript !== processedTranscriptRef.current &&
      !isListening
    ) {
      processedTranscriptRef.current = lastFinalTranscript;
      onFinalTranscript(lastFinalTranscript);
      clearTranscript();
    }
  }, [lastFinalTranscript, isListening, onFinalTranscript, clearTranscript]);

  const handleMicClick = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
    
    if (isListening) {
      stopListening();
    } else {
      processedTranscriptRef.current = '';
      startListening();
    }
  };

  const getStatusText = () => {
    if (isListening && transcript) {
      return transcript;
    }
    if (isListening) {
      return 'Listening...';
    }
    if (isSpeaking) {
      return 'Aura is speaking';
    }
    if (error) {
      return error;
    }
    return 'Tap mic to talk';
  };

  if (!hasSpeechSupport) {
    return (
      <div className="flex items-center gap-2 text-[10px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
          Voice not available
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleMicClick}
        disabled={isSpeaking}
        className={`relative rounded-full p-3 border transition-all duration-300 ${
          isListening
            ? 'bg-red-500/20 border-red-500/50 text-red-300 shadow-lg shadow-red-500/20'
            : isSpeaking
            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 cursor-not-allowed opacity-70'
            : 'bg-white/10 border-white/15 text-slate-300 hover:bg-violet-500/20 hover:border-violet-500/40 hover:text-violet-300'
        }`}
        title={isListening ? 'Stop listening' : isSpeaking ? 'Aura is speaking' : 'Start talking'}
      >
        {isListening && (
          <span className="absolute inset-0 rounded-full animate-ping bg-red-500/30" />
        )}
        
        <svg
          className="w-5 h-5 relative z-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      </button>

      {isSpeaking && (
        <button
          type="button"
          onClick={stopSpeaking}
          className="rounded-full p-2.5 bg-white/10 border border-white/15 text-slate-300 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-300 transition-all duration-200"
          title="Stop Aura"
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        </button>
      )}

      <div className="flex-1 min-w-0">
        <div className={`text-[11px] font-mono tracking-wide truncate ${
          error 
            ? 'text-red-400' 
            : isListening 
            ? 'text-red-300' 
            : isSpeaking 
            ? 'text-amber-300' 
            : 'text-slate-500'
        }`}>
          {getStatusText()}
        </div>
        
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`w-1.5 h-1.5 rounded-full ${
            isListening 
              ? 'bg-red-500 animate-pulse' 
              : isSpeaking 
              ? 'bg-amber-500 animate-pulse' 
              : 'bg-slate-600'
          }`} />
          <span className="text-[9px] text-slate-500 uppercase tracking-wider">
            {isListening ? 'Recording' : isSpeaking ? 'Playing' : 'Voice Ready'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VoiceControls;

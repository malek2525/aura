import React, { useEffect, useRef } from 'react';
import { useAuraVoice } from '../hooks/useAuraVoice';

interface VoiceControlsProps {
  onFinalTranscript: (text: string) => void;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({ onFinalTranscript }) => {
  const {
    isListening,
    isSpeaking,
    lastFinalTranscript,
    error,
    hasSpeechSupport,
    startListening,
    stopListening,
    stopSpeaking,
    clearTranscript,
  } = useAuraVoice();

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
    if (isListening) {
      stopListening();
    } else {
      processedTranscriptRef.current = '';
      startListening();
    }
  };

  const getStatusIndicator = () => {
    if (isListening) {
      return (
        <span className="flex items-center gap-1.5 text-red-400">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          Listening
        </span>
      );
    }
    if (isSpeaking) {
      return (
        <span className="flex items-center gap-1.5 text-amber-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Aura Speaking
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 text-slate-500">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
        Voice Ready
      </span>
    );
  };

  if (!hasSpeechSupport) {
    return (
      <div className="flex items-center gap-2 text-[10px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
          Voice not supported
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleMicClick}
        className={`rounded-full p-2.5 border transition-all duration-200 ${
          isListening
            ? 'bg-red-500/20 border-red-500/40 text-red-300 hover:bg-red-500/30'
            : 'bg-white/10 border-white/10 text-slate-300 hover:bg-white/15 hover:border-white/20'
        }`}
        title={isListening ? 'Stop listening' : 'Start listening'}
      >
        <svg
          className="w-4 h-4"
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
          className="rounded-full p-2 bg-white/10 border border-white/10 text-slate-300 hover:bg-white/15 hover:border-white/20 transition-all duration-200"
          title="Stop speaking"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <rect x="6" y="6" width="12" height="12" rx="1" />
          </svg>
        </button>
      )}

      <div className="text-[10px] font-mono tracking-wide">
        {error ? (
          <span className="text-red-400">{error}</span>
        ) : (
          getStatusIndicator()
        )}
      </div>
    </div>
  );
};

export default VoiceControls;

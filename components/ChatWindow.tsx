import React, { useEffect } from 'react';
import useVoice from '../hooks/useVoice';

interface VoiceControlsProps {
  onFinalTranscript: (text: string) => void;
  lastAuraReply?: string;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({ onFinalTranscript, lastAuraReply }) => {
  const {
    hasSpeechSupport,
    isListening,
    isSpeaking,
    lastTranscript,
    error,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    clearTranscript,
  } = useVoice();

  // When transcript is finalized, send it and clear
  useEffect(() => {
    if (lastTranscript && !isListening) {
      onFinalTranscript(lastTranscript);
      clearTranscript();
    }
  }, [lastTranscript, isListening, onFinalTranscript, clearTranscript]);

  // Auto-speak Aura's response
  useEffect(() => {
    if (lastAuraReply && lastAuraReply.trim()) {
      speak(lastAuraReply);
    }
  }, [lastAuraReply, speak]);

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!hasSpeechSupport) {
    return (
      <div className="flex flex-col gap-2">
        <button
          disabled
          className="glass-panel px-6 py-2.5 rounded-full text-sm font-medium text-slate-400 opacity-50 cursor-not-allowed"
        >
          🎙 Voice not supported
        </button>
        <p className="text-xs text-slate-600 text-center">
          Your browser doesn't support voice input
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <button
          onClick={handleMicClick}
          className={`flex-1 pill-button px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
            isListening
              ? 'bg-red-600/30 text-red-100 border-red-500/30 animate-pulse-soft'
              : 'glass-panel text-slate-200 hover:bg-white/10'
          }`}
        >
          {isListening ? '🔴 Listening…' : '🎙 Talk'}
        </button>

        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            className="glass-panel px-4 py-2.5 rounded-full text-sm font-medium text-slate-200 hover:bg-white/10 transition-all"
            title="Stop speaking"
          >
            ⏹
          </button>
        )}
      </div>

      <p className="text-xs text-slate-500 text-center h-4">
        {error && <span className="text-red-400">⚠ {error}</span>}
        {!error && isListening && <span>● Mic live</span>}
        {!error && isSpeaking && <span>🔊 Aura speaking…</span>}
        {!error && !isListening && !isSpeaking && <span>Voice Ready</span>}
      </p>
    </div>
  );
};

export default VoiceControls;

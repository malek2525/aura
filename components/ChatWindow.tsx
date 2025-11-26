import React, { useState, useRef, useEffect } from 'react';
import { AuraChatMessage } from '../types';
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

  const handleMicClick = (e: React.MouseEvent) => {
    e.preventDefault();
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
          type="button"
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
          type="button"
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
            type="button"
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

interface ChatWindowProps {
  messages: AuraChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  const getLastAuraReply = (): string => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].from === 'aura') {
        return messages[i].text;
      }
    }
    return '';
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl text-sm ${
                msg.from === 'user'
                  ? 'bg-gradient-to-r from-violet-600/40 to-blue-600/40 text-violet-100 border border-violet-500/30'
                  : 'glass-panel-light text-slate-200 border border-white/10'
              }`}
            >
              <p className="leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="glass-panel-light px-4 py-3 rounded-2xl text-sm text-slate-300 border border-white/10">
              <div className="flex gap-2 items-center">
                <span className="text-xs text-slate-500">Aura is thinking</span>
                <span className="animate-pulse">●</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell your Aura something..."
            disabled={isLoading}
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="glass-panel px-6 py-3 rounded-full text-sm font-medium text-slate-200 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>

        {/* Voice controls below input */}
        <VoiceControls onFinalTranscript={onSendMessage} lastAuraReply={getLastAuraReply()} />
      </form>
    </div>
  );
};

export default ChatWindow;

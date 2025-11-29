import React, { useState, useEffect, useRef } from 'react';
import { AuraProfile, AuraState, AuraChatMessage } from '../types';
import { chatWithAura } from '../services/auraLLM';
import VoiceControls from '../components/VoiceControls';

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

interface NeuralLinkScreenProps {
  profile: AuraProfile;
  history: AuraChatMessage[];
  setHistory: React.Dispatch<React.SetStateAction<AuraChatMessage[]>>;
  auraState: AuraState;
  setAuraState: React.Dispatch<React.SetStateAction<AuraState>>;
  onOpenReplyLab?: (prefillText?: string) => void;
  voice: VoiceHook;
}

const NeuralLinkScreen: React.FC<NeuralLinkScreenProps> = ({ 
  profile, 
  history, 
  setHistory, 
  auraState, 
  setAuraState,
  onOpenReplyLab,
  voice
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastSpokenIdRef = useRef<string>('');

  const {
    isListening,
    isSpeaking,
    speak,
    hasTTSSupport,
  } = voice;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  useEffect(() => {
    if (history.length === 0) return;

    const lastMsg = history[history.length - 1];
    
    if (
      lastMsg.from === 'aura' &&
      lastMsg.id !== lastSpokenIdRef.current &&
      hasTTSSupport &&
      !isListening
    ) {
      lastSpokenIdRef.current = lastMsg.id;
      const delay = setTimeout(() => {
        speak(lastMsg.text);
      }, 200);
      return () => clearTimeout(delay);
    }
  }, [history, hasTTSSupport, isListening, speak]);

  const handleSendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: AuraChatMessage = {
      id: Date.now().toString(),
      from: 'user',
      text: trimmed,
      timestamp: Date.now()
    };
    
    const newHistory = [...history, userMsg];
    setHistory(newHistory);
    setInput('');
    setIsLoading(true);

    const { replyText, auraState: newAuraState } = await chatWithAura(profile, newHistory, trimmed);

    setAuraState(newAuraState);

    const auraMsg: AuraChatMessage = {
      id: (Date.now() + 1).toString(),
      from: 'aura',
      text: replyText,
      timestamp: Date.now()
    };

    setHistory(prev => [...prev, auraMsg]);
    setIsLoading(false);
  };

  const handleSend = () => {
    handleSendMessage(input);
  };

  const handleVoiceTranscript = (text: string) => {
    handleSendMessage(text);
  };

  return (
    <div className="h-full flex flex-col p-4 lg:p-5">
      
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
        <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_10px] animate-pulse ${
          isListening ? 'bg-red-400 shadow-red-400/80' : isSpeaking ? 'bg-amber-400 shadow-amber-400/80' : 'bg-emerald-400 shadow-emerald-400/80'
        }`} />
        <div className="flex-1">
          <h2 className="text-sm font-semibold text-white">
            Neural Link with {profile.displayName}'s Aura
          </h2>
          <p className="text-[10px] text-slate-400 tracking-wide">
            {isListening ? 'Listening to you...' : isSpeaking ? 'Aura is speaking...' : 'Talk, vent, or think out loud'}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] uppercase tracking-[0.15em] text-slate-300">
            {auraState.mood}
          </span>
        </div>
      </div>
          
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2 min-h-0">
        {history.length === 0 && (
          <div className="text-xs text-slate-500 text-center mt-10 space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-violet-600/20 to-blue-600/20 border border-white/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-slate-400">Start with a message or voice note.</p>
            <p className="text-[11px] opacity-70">Aura mirrors your vibe and keeps energy gentle.</p>
          </div>
        )}
        {history.map(m => (
          <div
            key={m.id}
            className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed break-words ${
              m.from === 'user'
                ? 'ml-auto bg-gradient-to-br from-violet-600/90 to-blue-600/90 text-white shadow-lg'
                : 'mr-auto bg-slate-800/80 border border-white/10 text-slate-100'
            }`}
          >
            {m.text}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" />
            </div>
            <span>Aura is thinking in your voice…</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="pt-4 space-y-3 border-t border-white/10 mt-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Tell Aura what's on your mind…"
            disabled={isLoading}
            className="flex-1 rounded-full bg-slate-950/70 border border-white/15 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all disabled:opacity-50"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="rounded-full px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-500 hover:to-blue-500 hover:shadow-lg hover:shadow-violet-500/20 disabled:opacity-60 disabled:hover:shadow-none transition-all"
          >
            Send
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <VoiceControls voice={voice} onFinalTranscript={handleVoiceTranscript} />
            
            {onOpenReplyLab && (
              <button
                type="button"
                onClick={() => onOpenReplyLab(input.trim() || undefined)}
                className="rounded-full border border-white/15 px-3 py-1.5 text-[10px] text-slate-300 bg-slate-950/60 hover:bg-slate-900/80 hover:border-violet-400/30 transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Reply Lab
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeuralLinkScreen;

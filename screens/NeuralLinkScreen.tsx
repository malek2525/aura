import React, { useState, useEffect, useRef } from 'react';
import { AuraProfile, AuraState, AuraChatMessage } from '../types';
import { chatWithAura } from '../services/auraLLM';
import { useAuraVoice } from '../hooks/useAuraVoice';
import AuraAvatar from '../components/AuraAvatar';
import VoiceControls from '../components/VoiceControls';

interface NeuralLinkScreenProps {
  profile: AuraProfile;
  history: AuraChatMessage[];
  setHistory: React.Dispatch<React.SetStateAction<AuraChatMessage[]>>;
  auraState: AuraState;
  setAuraState: React.Dispatch<React.SetStateAction<AuraState>>;
  onOpenReplyLab?: (prefillText?: string) => void;
}

const NeuralLinkScreen: React.FC<NeuralLinkScreenProps> = ({ 
  profile, 
  history, 
  setHistory, 
  auraState, 
  setAuraState,
  onOpenReplyLab
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
  } = useAuraVoice();

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
    <div className="h-full flex flex-col">
      
      <div className="rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl p-6 mb-4">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          
          <div className="flex-shrink-0">
            <AuraAvatar
              profile={profile}
              auraState={auraState}
              size="lg"
              showName={false}
              showVibes={false}
              showMood={false}
              isSpeaking={isSpeaking}
              isListening={isListening}
            />
          </div>
          
          <div className="flex-1 text-center lg:text-left space-y-3">
            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <div className={`w-2 h-2 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse ${
                isListening ? 'bg-red-400' : isSpeaking ? 'bg-amber-400' : 'bg-emerald-400'
              }`} />
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-slate-400">
                {isListening ? 'Listening' : isSpeaking ? 'Speaking' : 'Neural link online'}
              </span>
            </div>
            
            <h2 className="text-xl lg:text-2xl font-semibold text-white">
              {profile.displayName}'s Aura
            </h2>
            
            <p className="text-sm text-slate-300 max-w-md">
              A calm, non-judgmental mirror for your social life. Tell Aura what's on your mind — vent, rehearse, or think out loud.
            </p>
            
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-[0.15em] text-slate-300">
                {auraState.mood}
              </span>
              {profile.vibeWords?.slice(0, 2).map((word, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-[0.15em] text-slate-400"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
          
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2 min-h-0">
        {history.length === 0 && (
          <div className="text-xs text-slate-500 text-center mt-10 space-y-2">
            <p>Start with a message or voice note.</p>
            <p className="text-[11px] opacity-70">Aura mirrors your vibe and keeps energy gentle.</p>
          </div>
        )}
        {history.map(m => (
          <div
            key={m.id}
            className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed break-words ${
              m.from === 'user'
                ? 'ml-auto bg-slate-100 text-slate-900'
                : 'mr-auto bg-slate-800/80 border border-white/10 text-slate-100'
            }`}
          >
            {m.text}
          </div>
        ))}
        {isLoading && (
          <div className="text-[11px] text-slate-500 font-mono animate-pulse">
            Aura is thinking in your voice…
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
            className="flex-1 rounded-full bg-slate-950/70 border border-white/15 px-4 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-slate-100/40 focus:ring-1 focus:ring-slate-100/20 transition-all disabled:opacity-50"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="rounded-full px-4 py-2 text-sm font-medium bg-slate-100 text-slate-900 hover:bg-white hover:shadow-lg disabled:opacity-60 transition-all"
          >
            Send
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <VoiceControls onFinalTranscript={handleVoiceTranscript} />
            
            {onOpenReplyLab && (
              <button
                type="button"
                onClick={() => onOpenReplyLab(input.trim() || undefined)}
                className="rounded-full border border-white/15 px-3 py-1.5 text-[10px] text-slate-300 bg-slate-950/60 hover:bg-slate-900/80 hover:border-violet-400/30 transition-colors"
              >
                ✍️ Reply Lab
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeuralLinkScreen;

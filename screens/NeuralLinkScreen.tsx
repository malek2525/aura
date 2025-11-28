import React, { useState, useEffect, useRef } from 'react';
import { AuraProfile, AuraState, AuraChatMessage } from '../types';
import { chatWithAura } from '../services/auraLLM';
import useVoice from '../hooks/useVoice';

interface NeuralLinkScreenProps {
  profile: AuraProfile;
  history: AuraChatMessage[];
  setHistory: React.Dispatch<React.SetStateAction<AuraChatMessage[]>>;
  auraState: AuraState;
  setAuraState: React.Dispatch<React.SetStateAction<AuraState>>;
}

const NeuralLinkScreen: React.FC<NeuralLinkScreenProps> = ({ 
  profile, 
  history, 
  setHistory, 
  auraState, 
  setAuraState 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const voice = useVoice();
  const lastSpokenReplyRef = useRef<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  useEffect(() => {
    if (voice.lastTranscript && !voice.isListening) {
      handleSendMessage(voice.lastTranscript);
      voice.clearTranscript();
    }
  }, [voice.lastTranscript, voice.isListening]);

  useEffect(() => {
    if (history.length > 0) {
      const lastMsg = history[history.length - 1];
      if (
        lastMsg.from === 'aura' &&
        lastMsg.text !== lastSpokenReplyRef.current &&
        !voice.isListening &&
        voice.hasTTSSupport
      ) {
        lastSpokenReplyRef.current = lastMsg.text;
        setTimeout(() => voice.speak(lastMsg.text), 200);
      }
    }
  }, [history, voice.isListening, voice.hasTTSSupport, voice.speak]);

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

  return (
    <div className="h-full flex flex-col p-4">
      
      {/* Header */}
      <div className="pb-4 border-b border-white/10 mb-4">
        <div className="text-[10px] tracking-[0.3em] uppercase text-slate-500">Neural link online</div>
        <p className="text-xs text-slate-400 mt-1">
          Tell Aura what's on your mind. You can vent, rehearse, or think out loud.
        </p>
      </div>
          
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
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

      {/* Input Area */}
      <div className="pt-4 space-y-3 border-t border-white/10 mt-4">
        {/* Text Input Row */}
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

        {/* Voice Controls Row */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 gap-2">
          <button
            type="button"
            onClick={voice.isListening ? voice.stopListening : voice.startListening}
            disabled={!voice.hasSpeechSupport}
            className="rounded-full border border-white/15 px-3 py-1 text-[10px] text-slate-300 bg-slate-950/60 hover:bg-slate-900/80 disabled:opacity-40 transition-colors"
          >
            {voice.hasSpeechSupport
              ? voice.isListening
                ? '⏹ Stop'
                : '🎙 Speak'
              : 'No voice'}
          </button>
          <div className="flex items-center gap-1">
            {voice.isListening
              ? '● Mic live'
              : voice.isSpeaking
              ? '🔊 Speaking'
              : '● Ready'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeuralLinkScreen;

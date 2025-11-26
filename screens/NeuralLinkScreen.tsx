import React, { useState, useEffect, useRef } from 'react';
import AvatarCircle from '../components/AvatarCircle';
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

  // Auto-send voice transcript when ready
  useEffect(() => {
    if (voice.lastTranscript && !voice.isListening) {
      handleSendMessage(voice.lastTranscript);
      voice.clearTranscript();
    }
  }, [voice.lastTranscript, voice.isListening]);

  // Auto-speak Aura replies
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

    // 1. Add user message
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

    // 2. Call LLM
    const { replyText, auraState: newAuraState } = await chatWithAura(profile, newHistory, trimmed);

    // 3. Update state
    setAuraState(newAuraState);

    // 4. Add Aura message
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
    <div className="w-full h-full flex items-start justify-center p-4 lg:p-6">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr,1.8fr] gap-6">
        
        {/* LEFT: AURA STAGE */}
        <section className="rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-2xl shadow-2xl p-6 lg:p-8 flex flex-col gap-6 h-[min(70vh,600px)] lg:h-full">
          {/* Header */}
          <div className="space-y-2">
            <div className="text-[11px] tracking-[0.3em] uppercase text-slate-500">Neural Link</div>
            <h1 className="text-3xl font-semibold text-slate-50">
              {profile.displayName}'s Aura
            </h1>
            <p className="text-sm text-slate-300 max-w-md">
              {profile.summary}
            </p>
          </div>

          {/* Avatar Orb */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative h-56 w-56 rounded-full">
              <div className="absolute -inset-6 rounded-full bg-gradient-to-br from-slate-500/40 via-indigo-500/30 to-sky-500/20 blur-3xl" />
              <div className="relative h-full w-full rounded-full overflow-hidden border border-white/15 bg-slate-950/60 backdrop-blur-2xl flex items-center justify-center shadow-[0_0_80px_rgba(15,23,42,0.9)]">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.displayName} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-6xl drop-shadow-lg">🟣</span>
                )}
              </div>
            </div>
          </div>

          {/* Stats Pills */}
          <div className="flex flex-wrap gap-2 text-[11px] text-slate-200">
            <span className="px-3 py-1.5 rounded-full bg-slate-900/70 border border-white/10 backdrop-blur-lg">
              Introversion: {profile.introversionLevel}/10
            </span>
            <span className="px-3 py-1.5 rounded-full bg-slate-900/70 border border-white/10 backdrop-blur-lg">
              Pace: {profile.socialSpeed}
            </span>
            {profile.vibeWords?.slice(0, 2).map((vibe, i) => (
              <span key={i} className="px-3 py-1.5 rounded-full bg-slate-900/70 border border-white/10 backdrop-blur-lg">
                {vibe}
              </span>
            ))}
          </div>
        </section>

        {/* RIGHT: CHAT + VOICE */}
        <section className="rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-2xl shadow-2xl p-4 lg:p-6 flex flex-col h-[min(70vh,600px)] lg:h-full gap-4">
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {history.length === 0 && (
              <div className="text-xs text-slate-500 text-center mt-10">
                Start the link with a message. Aura will respond in your vibe.
              </div>
            )}
            {history.map(m => (
              <div
                key={m.id}
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed break-words ${
                  m.from === 'user'
                    ? 'ml-auto bg-slate-100 text-slate-900'
                    : 'mr-auto bg-slate-900/80 border border-white/10 text-slate-100'
                }`}
              >
                {m.text}
              </div>
            ))}
            {isLoading && (
              <div className="text-[11px] text-slate-500 font-mono animate-pulse">
                Aura is thinking…
              </div>
            )}
          </div>

          {/* Text Input Row */}
          <div className="mt-auto flex items-center gap-3">
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
              placeholder="Type something for your Aura twin…"
              disabled={isLoading}
              className="flex-1 rounded-full bg-slate-950/70 border border-white/15 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-slate-100/40 focus:ring-1 focus:ring-slate-100/20 transition-all disabled:opacity-50"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="rounded-full px-5 py-2.5 text-sm font-medium bg-slate-100 text-slate-900 hover:bg-white hover:shadow-lg disabled:opacity-60 transition-all"
            >
              Send
            </button>
          </div>

          {/* Voice Controls Row */}
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={voice.isListening ? voice.stopListening : voice.startListening}
                disabled={!voice.hasSpeechSupport}
                className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-slate-100 bg-slate-950/60 hover:bg-slate-900/80 disabled:opacity-40 transition-colors"
              >
                {voice.hasSpeechSupport
                  ? voice.isListening
                    ? '⏹ Stop listening'
                    : '🎙 Tap to speak'
                  : 'Voice not supported'}
              </button>
              {voice.error && (
                <span className="text-red-300 text-[10px]">{voice.error}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {voice.isListening
                ? '● Mic live'
                : voice.isSpeaking
                ? '🔊 Aura speaking'
                : '● Voice ready'}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default NeuralLinkScreen;

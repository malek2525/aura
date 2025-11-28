import React, { useState, useEffect } from 'react';
import { AuraProfile, ReplyOptions } from '../types';
import { generateReplyOptions } from '../services/auraLLM';
import { logEvent } from '../utils/telemetry';

interface ReplyLabScreenProps {
  profile: AuraProfile;
  prefillText?: string;
}

type ToneType = 'safe' | 'direct' | 'playful';
type ContextType = 'General' | 'Friend' | 'Dating' | 'Work';

interface ToneConfig {
  label: string;
  sublabel: string;
  chipBg: string;
  chipText: string;
  chipBorder: string;
}

const TONE_CONFIGS: Record<ToneType, ToneConfig> = {
  safe: {
    label: 'Safe / Polite',
    sublabel: 'Cautious, no risk',
    chipBg: 'bg-sky-500/20',
    chipText: 'text-sky-300',
    chipBorder: 'border-sky-500/30',
  },
  direct: {
    label: 'Direct / Honest',
    sublabel: 'Clear and to the point',
    chipBg: 'bg-amber-500/20',
    chipText: 'text-amber-300',
    chipBorder: 'border-amber-500/30',
  },
  playful: {
    label: 'Playful / Warm',
    sublabel: 'Fun side showing',
    chipBg: 'bg-pink-500/20',
    chipText: 'text-pink-300',
    chipBorder: 'border-pink-500/30',
  },
};

const CONTEXT_OPTIONS: ContextType[] = ['General', 'Friend', 'Dating', 'Work'];

interface ReplyCardProps {
  tone: ToneType;
  text: string;
  onCopy: () => void;
  copied: boolean;
}

const ReplyCard: React.FC<ReplyCardProps> = ({ tone, text, onCopy, copied }) => {
  const config = TONE_CONFIGS[tone];
  
  return (
    <div className="rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl p-4 flex flex-col gap-3 transition-all duration-200 hover:scale-[1.02] hover:border-white/25">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide border ${config.chipBg} ${config.chipText} ${config.chipBorder}`}>
            {tone}
          </span>
          <div>
            <p className="text-sm font-medium text-slate-100">{config.label}</p>
            <p className="text-[10px] uppercase tracking-wide text-slate-500">{config.sublabel}</p>
          </div>
        </div>
        <button
          onClick={onCopy}
          className="rounded-full px-3 py-1 text-[10px] font-medium bg-white/10 text-slate-300 hover:bg-white/20 transition-colors border border-white/10"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <p className="text-sm text-slate-200 leading-relaxed">
        {text || <span className="text-slate-500 italic">Waiting for Aura...</span>}
      </p>
    </div>
  );
};

const ReplyLabScreen: React.FC<ReplyLabScreenProps> = ({ profile, prefillText }) => {
  const [inputText, setInputText] = useState(prefillText || '');
  const [context, setContext] = useState<ContextType>('General');
  const [isLoading, setIsLoading] = useState(false);
  const [replies, setReplies] = useState<ReplyOptions | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    logEvent('reply_lab_opened');
  }, []);

  useEffect(() => {
    if (prefillText) {
      setInputText(prefillText);
    }
  }, [prefillText]);

  const handleGenerateReplies = async () => {
    if (!inputText.trim()) {
      setError("Please paste or type a message first.");
      return;
    }

    setError(null);
    setIsLoading(true);
    setReplies(null);

    try {
      const result = await generateReplyOptions(profile, inputText.trim());
      setReplies(result);
      
      logEvent('reply_lab_generated', {
        length: inputText.trim().length,
        context: context,
      });
    } catch (err) {
      console.error("[ReplyLabScreen] Error generating replies:", err);
      setError("Aura is a bit overwhelmed. Try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (tone: ToneType, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(tone);
      
      logEvent('reply_lab_used_option', { tone });
      
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 lg:p-6 overflow-y-auto custom-scrollbar">
      
      {/* Header */}
      <div className="mb-6">
        <div className="text-[11px] tracking-[0.3em] uppercase text-slate-500 mb-2">Reply Lab</div>
        <h2 className="text-2xl font-semibold text-slate-100">Draft replies in your voice</h2>
        <p className="text-slate-400 text-sm mt-2">
          Paste a message you received and Aura will draft three replies – safe, direct, or playful – matching your personality and boundaries.
        </p>
      </div>

      {/* Input Area */}
      <div className="space-y-4 mb-6">
        {/* Context Dropdown */}
        <div className="flex items-center gap-3">
          <label htmlFor="context-select" className="text-[11px] uppercase tracking-wide text-slate-500">
            Context
          </label>
          <select
            id="context-select"
            value={context}
            onChange={(e) => setContext(e.target.value as ContextType)}
            className="rounded-xl bg-slate-950/70 border border-white/15 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-slate-100/40 focus:ring-1 focus:ring-slate-100/20 transition-all appearance-none cursor-pointer backdrop-blur-xl"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.25rem', paddingRight: '2rem' }}
          >
            {CONTEXT_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="bg-slate-900 text-slate-100">
                {opt}
              </option>
            ))}
          </select>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste or type the message you want to reply to..."
          rows={4}
          className="w-full rounded-2xl bg-slate-950/70 border border-white/15 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-slate-100/40 focus:ring-1 focus:ring-slate-100/20 transition-all resize-none"
        />
        
        <button
          onClick={handleGenerateReplies}
          disabled={isLoading || !inputText.trim()}
          className="w-full rounded-full py-3 text-sm font-medium bg-slate-100 text-slate-900 hover:bg-white disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-slate-400 border-t-slate-900 rounded-full animate-spin" />
              Thinking...
            </span>
          ) : (
            "Let Aura draft replies"
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      {/* Reply Cards */}
      {replies && (
        <div className="space-y-4 animate-fade-in">
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">
            Choose your style
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <ReplyCard
              tone="safe"
              text={replies.safe}
              onCopy={() => handleCopy('safe', replies.safe)}
              copied={copiedKey === 'safe'}
            />
            
            <ReplyCard
              tone="direct"
              text={replies.direct}
              onCopy={() => handleCopy('direct', replies.direct)}
              copied={copiedKey === 'direct'}
            />
            
            <ReplyCard
              tone="playful"
              text={replies.playful}
              onCopy={() => handleCopy('playful', replies.playful)}
              copied={copiedKey === 'playful'}
            />
          </div>
        </div>
      )}

      {/* Empty State */}
      {!replies && !isLoading && !error && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-slate-500 text-sm max-w-xs">
            <p className="mb-2">Paste a message above and Aura will help you craft the perfect reply.</p>
            <p className="text-[11px] opacity-70">Your voice, your boundaries, three options.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReplyLabScreen;

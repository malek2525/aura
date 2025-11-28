import React, { useState } from 'react';
import { AuraProfile, ReplyOptions } from '../types';
import { generateReplyOptions } from '../services/auraLLM';

interface ReplyLabScreenProps {
  profile: AuraProfile;
}

interface ReplyCardProps {
  label: string;
  sublabel: string;
  text: string;
  onCopy: () => void;
  copied: boolean;
}

const ReplyCard: React.FC<ReplyCardProps> = ({ label, sublabel, text, onCopy, copied }) => {
  return (
    <div className="rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl p-4 flex flex-col gap-3 transition-all hover:border-white/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-100">{label}</p>
          <p className="text-[10px] uppercase tracking-wide text-slate-500">{sublabel}</p>
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

const ReplyLabScreen: React.FC<ReplyLabScreenProps> = ({ profile }) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [replies, setReplies] = useState<ReplyOptions | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

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
    } catch (err) {
      console.error("[ReplyLabScreen] Error generating replies:", err);
      setError("Aura is a bit overwhelmed. Try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (key: 'safe' | 'direct' | 'playful', text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
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
              label="Safe / Polite"
              sublabel="Cautious, no risk"
              text={replies.safe}
              onCopy={() => handleCopy('safe', replies.safe)}
              copied={copiedKey === 'safe'}
            />
            
            <ReplyCard
              label="Direct / Honest"
              sublabel="Clear and to the point"
              text={replies.direct}
              onCopy={() => handleCopy('direct', replies.direct)}
              copied={copiedKey === 'direct'}
            />
            
            <ReplyCard
              label="Playful / Warm"
              sublabel="Fun side showing"
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

import React, { useState } from "react";

import { AuraProfile } from "../types";
import { generateReplyOptions, ReplyContext } from "../services/auraLLM";

interface SkillsPanelProps {
  profile: AuraProfile;
}

interface ReplyCard {
  label: string;
  sublabel: string;
  key: "safe" | "direct" | "playful";
  color: string;
  bgColor: string;
  borderColor: string;
}

const REPLY_CARDS: ReplyCard[] = [
  {
    label: "Safe",
    sublabel: "Polite",
    key: "safe",
    color: "text-emerald-300",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
  },
  {
    label: "Direct",
    sublabel: "Honest",
    key: "direct",
    color: "text-blue-300",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
  {
    label: "Playful",
    sublabel: "Warm",
    key: "playful",
    color: "text-pink-300",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/30",
  },
];

const CONTEXTS: { value: ReplyContext; label: string }[] = [
  { value: "General", label: "General" },
  { value: "Friend", label: "Friend" },
  { value: "Dating", label: "Dating" },
  { value: "Work", label: "Work" },
];

const SkillsPanel: React.FC<SkillsPanelProps> = ({ profile }) => {
  const [incomingMessage, setIncomingMessage] = useState("");
  const [context, setContext] = useState<ReplyContext>("General");
  const [replies, setReplies] = useState<{
    safe: string;
    direct: string;
    playful: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleAskAura = async () => {
    if (!incomingMessage.trim()) {
      setError("Please paste a message to reply to.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setReplies(null);

    try {
      const result = await generateReplyOptions(
        profile,
        incomingMessage.trim(),
        context,
      );
      setReplies(result);
    } catch (err) {
      console.error("[SkillsPanel] Error generating replies:", err);
      setError("Failed to generate replies. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleClear = () => {
    setIncomingMessage("");
    setReplies(null);
    setError(null);
  };

  return (
    <div className="h-full flex flex-col p-4 lg:p-5">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-slate-400">
            Reply Lab · Skills
          </span>
        </div>
        <h2 className="text-lg font-semibold text-white mb-1">
          Draft Smart Replies
        </h2>
        <p className="text-xs text-slate-400">
          Paste a message you received, and Aura will draft three reply options
          matching your vibe.
        </p>
      </div>

      <div className="space-y-4 flex-1 flex flex-col min-h-0">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-mono tracking-wider uppercase text-slate-500">
              Incoming Message
            </label>
            <select
              value={context}
              onChange={(e) => setContext(e.target.value as ReplyContext)}
              className="text-[10px] bg-slate-950/60 border border-white/10 rounded-lg px-2 py-1 text-slate-300 focus:outline-none focus:border-violet-500/50"
            >
              {CONTEXTS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={incomingMessage}
            onChange={(e) => setIncomingMessage(e.target.value)}
            placeholder="Paste the message you want to reply to..."
            rows={4}
            className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 resize-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAskAura}
            disabled={isLoading || !incomingMessage.trim()}
            className="flex-1 rounded-xl px-4 py-3 text-sm font-medium bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-500 hover:to-blue-500 hover:shadow-lg hover:shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span>Ask Aura</span>
              </>
            )}
          </button>

          {(incomingMessage || replies) && (
            <button
              onClick={handleClear}
              className="rounded-xl px-4 py-3 text-sm text-slate-400 bg-slate-800/50 border border-white/10 hover:bg-slate-700/50 hover:text-white transition-all"
            >
              Clear
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-300 flex items-center gap-2">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {replies && (
          <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
            {REPLY_CARDS.map((card) => (
              <div
                key={card.key}
                className={`rounded-xl border ${card.borderColor} ${card.bgColor} p-4 transition-all hover:shadow-lg`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${card.color}`}>
                      {card.label}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      / {card.sublabel}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(replies[card.key], card.key)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
                      copiedKey === card.key
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {copiedKey === card.key ? (
                      <>
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {replies[card.key]}
                </p>
              </div>
            ))}
          </div>
        )}

        {!replies && !isLoading && !error && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600/20 to-blue-600/20 border border-white/10 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-violet-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-sm text-slate-400 max-w-xs">
              Paste a message above and click "Ask Aura" to get three tailored
              reply options.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsPanel;

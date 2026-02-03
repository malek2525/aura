import React, { useEffect, useRef, useState } from "react";
import { AuraProfile } from "../types";
import {
  MatchMessage,
  fetchMessages,
  sendMessage,
} from "../services/chatService";

interface MatchChatScreenProps {
  currentUser: { uid: string; profile: AuraProfile };
  otherUser: { uid: string; profile: AuraProfile };
  matchId: string;
  onBack: () => void;
  onOpenReplyLab: (prefillText: string) => void;
}

const MatchChatScreen: React.FC<MatchChatScreenProps> = ({
  currentUser,
  otherUser,
  matchId,
  onBack,
  onOpenReplyLab,
}) => {
  const [messages, setMessages] = useState<MatchMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const data = await fetchMessages(matchId);
        setMessages(data);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [matchId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    const msg = await sendMessage(matchId, currentUser.uid, text);
    setMessages((prev) => [...prev, msg]);
  };

  const latestFromOther = [...messages]
    .reverse()
    .find((m) => m.fromUid === otherUser.uid);

  const handleAskAura = () => {
    const text =
      latestFromOther?.text ||
      `I want to reply to ${otherUser.profile.displayName}. Help me phrase something that fits my vibe.`;
    onOpenReplyLab(text);
  };

  const otherPhoto =
    (otherUser.profile.photos && otherUser.profile.photos[0]?.url) ||
    (otherUser.profile.photoUrls && otherUser.profile.photoUrls[0]) ||
    "";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-950/70">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1 rounded-full hover:bg-white/10 text-slate-300"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 rounded-full overflow-hidden border border-white/20 bg-slate-900/80">
              {otherPhoto ? (
                <img
                  src={otherPhoto}
                  alt={otherUser.profile.displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/70 via-violet-500/70 to-sky-400/70" />
                  <span className="relative z-10 flex h-full w-full items-center justify-center text-xs font-semibold text-white">
                    {otherUser.profile.displayName.charAt(0).toUpperCase()}
                  </span>
                </>
              )}
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 border border-slate-900" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white">
                {otherUser.profile.displayName}
              </span>
              <span className="text-[10px] text-slate-400">
                Match chat · Aura can help
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAskAura}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-violet-400/40 text-[10px] text-violet-100 hover:bg-violet-500/20 transition-all"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h.01M15 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Ask Aura
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 py-3 space-y-3 custom-scrollbar"
      >
        {loading && (
          <div className="flex justify-center py-4">
            <div className="w-8 h-8 rounded-full border-2 border-slate-600 border-t-violet-400 animate-spin" />
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-2">
            <p className="text-xs text-slate-200">
              You haven&apos;t said hi yet.
            </p>
            <p className="text-[11px] text-slate-500 max-w-xs">
              You can start with something simple. If you feel stuck, tap{" "}
              <span className="text-violet-300 font-semibold">Ask Aura</span>.
            </p>
          </div>
        )}

        {messages.map((m) => {
          const isMe = m.fromUid === currentUser.uid;
          return (
            <div
              key={m.id}
              className={`flex mb-1 ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-[11px] leading-relaxed border ${
                  isMe
                    ? "bg-violet-500/20 border-violet-400/60 text-violet-50 rounded-br-sm"
                    : "bg-slate-900/80 border-white/15 text-slate-50 rounded-bl-sm"
                }`}
              >
                {m.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="border-t border-white/10 bg-slate-950/80 px-3 py-2">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={1}
            placeholder="Type a message..."
            className="flex-1 bg-slate-900/80 border border-white/15 rounded-2xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-violet-400/60 focus:ring-1 focus:ring-violet-400/30 resize-none"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim()}
            className="h-9 w-9 rounded-full flex items-center justify-center bg-gradient-to-br from-violet-500 to-sky-500 text-white shadow-lg shadow-violet-500/40 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 12l14-7-4 14-3-5-5-2z"
              />
            </svg>
          </button>
        </div>
        <div className="mt-1 text-[9px] text-slate-500 flex justify-between">
          <span>
            Aura isn&apos;t inside this chat, but you can still ask it for help.
          </span>
          <button
            type="button"
            onClick={handleAskAura}
            className="underline underline-offset-2 text-violet-300"
          >
            Open Reply Lab
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchChatScreen;

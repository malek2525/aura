import React, { useEffect, useMemo, useRef, useState } from "react";
import { AuraChatMessage } from "../types";

type Props = {
  messages: AuraChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
};

const formatTime = (ts?: number) => {
  if (!ts) return "";
  try {
    return new Date(ts).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

const ChatWindow: React.FC<Props> = ({
  messages,
  onSendMessage,
  isLoading = false,
  title = "Aura",
  subtitle = "Neural Link",
}) => {
  const [draft, setDraft] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const safeMessages = useMemo(() => messages || [], [messages]);

  // Auto-scroll to bottom on new messages/loading
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [safeMessages.length, isLoading]);

  const send = () => {
    const text = draft.trim();
    if (!text || isLoading) return;
    onSendMessage(text);
    setDraft("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="h-full w-full rounded-3xl bg-slate-950/40 border border-white/10 backdrop-blur-2xl shadow-[0_0_80px_rgba(15,23,42,0.65)] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-950/40">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative h-9 w-9 rounded-full overflow-hidden border border-white/10 bg-gradient-to-tr from-blue-500/80 to-purple-600/80 shadow-[0_0_18px_rgba(99,102,241,0.35)]" />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white truncate">
              {title}
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {subtitle}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full border ${
              isLoading
                ? "text-amber-200 border-amber-300/20 bg-amber-500/10"
                : "text-emerald-200 border-emerald-300/20 bg-emerald-500/10"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                isLoading ? "bg-amber-300" : "bg-emerald-300"
              }`}
            />
            {isLoading ? "Thinking" : "Online"}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={listRef}
        className="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-3"
      >
        {safeMessages.length === 0 && (
          <div className="h-full flex items-center justify-center text-center px-6">
            <div className="max-w-sm">
              <div className="text-sm text-slate-200 font-medium">
                Start a conversation
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Ask Aura anything. Use Shift+Enter for a new line.
              </div>
            </div>
          </div>
        )}

        {safeMessages.map((m) => {
          const isUser = m.from === "user";
          return (
            <div
              key={m.id}
              className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[92%] sm:max-w-[78%]`}>
                <div
                  className={[
                    "px-4 py-3 rounded-2xl border shadow-sm",
                    isUser
                      ? "bg-gradient-to-br from-blue-600/80 to-purple-600/80 border-white/10 text-white"
                      : "bg-slate-900/60 border-white/10 text-slate-100",
                  ].join(" ")}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {m.text}
                  </p>
                </div>
                <div
                  className={`mt-1 text-[10px] text-slate-500 ${
                    isUser ? "text-right" : "text-left"
                  }`}
                >
                  {formatTime(m.timestamp)}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="w-full flex justify-start">
            <div className="max-w-[92%] sm:max-w-[78%]">
              <div className="px-4 py-3 rounded-2xl bg-slate-900/60 border border-white/10 text-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:120ms]" />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:240ms]" />
                  <span className="text-xs text-slate-400 ml-2">
                    Aura is thinking…
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="p-3 border-t border-white/10 bg-slate-950/40">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <div
              className={[
                "rounded-2xl border bg-slate-950/40 overflow-hidden",
                isComposing ? "border-blue-400/30" : "border-white/10",
              ].join(" ")}
            >
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onFocus={() => setIsComposing(true)}
                onBlur={() => setIsComposing(false)}
                onKeyDown={onKeyDown}
                placeholder="Message Aura…"
                rows={1}
                className="w-full resize-none bg-transparent outline-none px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500"
              />
            </div>
            <div className="mt-1 text-[10px] text-slate-500 px-1">
              Enter to send • Shift+Enter new line
            </div>
          </div>

          <button
            type="button"
            onClick={send}
            disabled={isLoading || !draft.trim()}
            className="h-[46px] px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold border border-white/10 shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-500 hover:to-purple-500 transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;

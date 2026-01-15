import React, { useEffect, useMemo, useRef, useState } from "react";
import { AuraChatMessage } from "../types";
import { Icons } from "./Icons";

type Props = {
  messages: AuraChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
  onClose?: () => void;
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

export const ChatWindow: React.FC<Props> = ({
  messages,
  onSendMessage,
  isLoading = false,
  title = "Aura",
  subtitle = "Neural Link",
  onClose
}) => {
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  const safeMessages = useMemo(() => messages || [], [messages]);

  // Auto-scroll
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
    <div className="h-full w-full bg-warm-white flex flex-col relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-warm-gray sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
           {onClose && (
             <button onClick={onClose} className="mr-1 text-text-sec hover:text-text-main">
               <Icons.ChevronLeft size={24} />
             </button>
           )}
          <div className="relative h-10 w-10 rounded-full bg-gradient-to-tr from-coral to-gold p-[2px]">
             <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <Icons.Sparkles size={18} className="text-coral" />
             </div>
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-text-main truncate">
              {title}
            </div>
            <div className="text-[10px] text-text-sec truncate font-medium flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-gold animate-pulse' : 'bg-sage'}`}></span>
              {isLoading ? "Thinking..." : subtitle}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={listRef}
        className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-4 bg-warm-white"
      >
        {safeMessages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-6 opacity-60">
            <div className="w-16 h-16 bg-coral-light/50 rounded-full flex items-center justify-center mb-4">
               <Icons.MessageCircle size={32} className="text-coral" />
            </div>
            <div className="text-sm text-text-main font-bold">
              Start a conversation
            </div>
            <div className="text-xs text-text-muted mt-1 max-w-[200px]">
              Ask Aura for advice on matches, profile tips, or icebreakers.
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
              <div className={`max-w-[85%]`}>
                <div
                  className={[
                    "px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                    isUser
                      ? "bg-coral text-white rounded-tr-sm"
                      : "bg-white border border-warm-gray text-text-main rounded-tl-sm",
                  ].join(" ")}
                >
                  <p className="whitespace-pre-wrap break-words">
                    {m.text}
                  </p>
                </div>
                <div
                  className={`mt-1 text-[10px] text-text-muted font-medium ${
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
            <div className="bg-white border border-warm-gray px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:120ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:240ms]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="p-3 bg-white border-t border-warm-gray pb-6">
        <div className="flex items-end gap-2 bg-warm-white border border-warm-gray rounded-3xl p-1 pr-2 shadow-inner">
           <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Message Aura..."
              rows={1}
              className="flex-1 bg-transparent outline-none px-4 py-3 text-sm text-text-main placeholder:text-text-muted resize-none max-h-32"
           />
           <button
             type="button"
             onClick={send}
             disabled={isLoading || !draft.trim()}
             className="h-10 w-10 mb-1 rounded-full bg-coral text-white flex items-center justify-center shadow-md disabled:opacity-50 disabled:shadow-none hover:bg-coral-dark transition-colors"
           >
             <Icons.Send size={18} className={draft.trim() ? "ml-0.5" : ""} />
           </button>
        </div>
      </div>
    </div>
  );
};

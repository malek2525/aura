import React, { useState, useRef, useEffect } from 'react';
import { AuraChatMessage } from '../types';

interface ChatWindowProps {
  messages: AuraChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden">
      <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-slate-500 text-center text-sm">
            <div>
              <p className="text-base mb-2">👋 Say hello to initialize the Neural Link</p>
              <p className="text-xs text-slate-600">Your Aura is ready to listen</p>
            </div>
          </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs rounded-2xl px-4 py-3 ${
                msg.from === 'user'
                  ? 'glass-panel-light bg-gradient-to-br from-violet-600/25 to-violet-600/15 text-violet-50 border border-violet-500/20 rounded-br-none'
                  : 'glass-panel-light text-slate-200 border border-slate-700/20 rounded-bl-none'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start w-full">
            <div className="glass-panel-light rounded-2xl px-4 py-3 rounded-bl-none">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 bg-slate-400/60 rounded-full animate-pulse-soft" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-slate-400/60 rounded-full animate-pulse-soft" style={{ animationDelay: '200ms' }} />
                <div className="w-2 h-2 bg-slate-400/60 rounded-full animate-pulse-soft" style={{ animationDelay: '400ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/5 bg-slate-900/30 backdrop-blur-sm flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Your thought..."
            className="flex-1 glass-panel-light px-4 py-2.5 text-sm text-white placeholder-slate-500 rounded-xl focus:outline-none focus:border-violet-500/50 transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="glass-panel hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;

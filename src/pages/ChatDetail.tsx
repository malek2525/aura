
import React, { useState, useEffect } from 'react';
import { Icons } from '../components/Icons';
import { UserProfile } from '../types';
import { fetchMessages, sendMessage, MatchMessage } from '../services/messaging.ts';
import { generateReplyOptions } from '../services/auraLLM.ts';

interface ChatDetailProps {
  match: UserProfile;
  onBack: () => void;
}

export const ChatDetail: React.FC<ChatDetailProps> = ({ match, onBack }) => {
  const [messages, setMessages] = useState<MatchMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [showReplyLab, setShowReplyLab] = useState(false);
  const [replySuggestions, setReplySuggestions] = useState<{safe: string, direct: string, playful: string} | null>(null);

  useEffect(() => {
    const load = async () => {
        const msgs = await fetchMessages(match.id);
        setMessages(msgs);
    };
    load();
  }, [match.id]);

  const handleSend = async (text?: string) => {
    const txt = text || inputText;
    if (!txt.trim()) return;
    
    // Optimistic
    const temp: MatchMessage = {
        id: "temp",
        matchId: match.id,
        fromUid: "me",
        text: txt,
        createdAt: Date.now()
    };
    setMessages(prev => [...prev, temp]);
    setInputText("");
    setShowReplyLab(false);

    await sendMessage(match.id, "me", txt);
  };

  const handleOpenReplyLab = async () => {
    if (showReplyLab) {
        setShowReplyLab(false);
        return;
    }
    
    const lastMsg = messages[messages.length - 1]?.text || "Hello";
    const opts = await generateReplyOptions(match, lastMsg);
    setReplySuggestions(opts);
    setShowReplyLab(true);
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-warm-gray flex items-center gap-3 sticky top-0 bg-white/95 backdrop-blur-md z-10 shadow-sm">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-warm-white rounded-full text-text-sec">
           <Icons.ChevronLeft size={24} />
        </button>
        
        <div className="flex-1 flex items-center gap-3">
           <div className="w-10 h-10 rounded-full overflow-hidden border border-warm-gray relative">
              <img src={match.photos[0]} className="w-full h-full object-cover" />
              {match.verified && <div className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-white rounded-full"></div>}
           </div>
           <div>
              <h2 className="font-bold text-text-main text-sm">{match.name}</h2>
              <div className="flex items-center gap-1">
                 <span className="w-1.5 h-1.5 bg-success rounded-full"></span>
                 <span className="text-xs text-text-muted">Online</span>
              </div>
           </div>
        </div>

        <button className="p-2 text-text-muted hover:text-coral transition-colors">
           <Icons.ShieldCheck size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-warm-white/30">
        
        {/* Aura Intro */}
        <div className="flex justify-center my-6">
           <div className="bg-gradient-to-r from-coral-light/50 to-orange-100 p-3 rounded-2xl border border-coral/10 max-w-[80%] text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1 text-coral">
                 <Icons.Sparkles size={14} className="fill-coral" />
                 <span className="text-[10px] font-bold uppercase">Aura Intro</span>
              </div>
              <p className="text-xs text-text-sec italic">
                 "You both like {match.interests[0] || 'chatting'}. That's a great starter!"
              </p>
           </div>
        </div>

        {/* Messages */}
        {messages.map((m, i) => {
            const isMe = m.fromUid === 'me';
            return (
                <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} gap-2`}>
                   {!isMe && (
                       <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mt-auto">
                         <img src={match.photos[0]} className="w-full h-full object-cover" />
                       </div>
                   )}
                   <div className={`px-4 py-3 rounded-2xl max-w-[75%] shadow-sm text-sm ${isMe ? 'bg-coral text-white rounded-tr-sm' : 'bg-white border border-warm-gray text-text-main rounded-tl-sm'}`}>
                      <p>{m.text}</p>
                   </div>
                </div>
            )
        })}
      </div>

      {/* Reply Lab / Input Area */}
      <div className="bg-white border-t border-warm-gray">
          
          {/* Suggestions */}
          {showReplyLab && replySuggestions && (
              <div className="p-4 bg-warm-white border-b border-warm-gray animate-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-2 mb-3">
                      <Icons.Sparkles size={14} className="text-coral" />
                      <span className="text-xs font-bold text-coral uppercase">Aura Suggestions</span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar">
                      {Object.entries(replySuggestions).map(([key, text]) => (
                          <button 
                            key={key} 
                            onClick={() => handleSend(text)}
                            className="flex-shrink-0 max-w-[200px] p-3 rounded-xl bg-white border border-warm-gray text-left hover:border-coral hover:bg-coral-light/10 transition-colors text-xs text-text-main shadow-sm"
                          >
                             <span className="block font-bold text-text-muted uppercase text-[10px] mb-1">{key}</span>
                             {text}
                          </button>
                      ))}
                  </div>
              </div>
          )}

          <div className="p-3 flex items-center gap-2">
             <button onClick={handleOpenReplyLab} className={`p-2 rounded-full transition-colors ${showReplyLab ? 'bg-coral-light text-coral' : 'text-text-muted hover:bg-warm-white'}`}>
                <Icons.Sparkles size={24} />
             </button>
             <div className="flex-1 bg-warm-white border border-warm-gray rounded-full px-4 py-2 flex items-center">
                <input 
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  type="text" 
                  placeholder="Type a message..." 
                  className="bg-transparent w-full outline-none text-sm text-text-main placeholder-text-muted"
                />
             </div>
             <button onClick={() => handleSend()} className="p-2 bg-coral text-white rounded-full shadow-md hover:scale-105 transition-transform">
                <Icons.Send size={20} className="ml-0.5" />
             </button>
          </div>
      </div>
    </div>
  );
};

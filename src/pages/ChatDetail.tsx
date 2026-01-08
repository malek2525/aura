import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { UserProfile } from '../types';

interface ChatDetailProps {
  match: UserProfile;
  onBack: () => void;
  onViewProfile?: () => void;
}

export const ChatDetail: React.FC<ChatDetailProps> = ({ match, onBack, onViewProfile }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      // TODO: Integrate with chatService.sendMessage()
      console.log('Sending:', message);
      setMessage('');
    }
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-warm-gray flex items-center gap-3 sticky top-0 bg-white/95 backdrop-blur-md z-10 shadow-sm">
        <button 
          onClick={onBack} 
          className="p-2 -ml-2 hover:bg-warm-white rounded-full text-text-sec"
        >
          <Icons.ChevronLeft size={24} />
        </button>
        
        <div 
          className="flex-1 flex items-center gap-3 cursor-pointer"
          onClick={onViewProfile}
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border border-warm-gray relative">
            <img src={match.photos[0]} className="w-full h-full object-cover" alt={match.name} />
            {match.verified && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-white rounded-full" />
            )}
          </div>
          <div>
            <h2 className="font-bold text-text-main text-sm">{match.name}</h2>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-success rounded-full" />
              <span className="text-xs text-text-muted">Online</span>
            </div>
          </div>
        </div>

        <button className="p-2 text-text-muted hover:text-coral transition-colors">
          <Icons.ShieldCheck size={20} />
        </button>
        <button className="p-2 text-text-muted hover:text-coral transition-colors">
          <Icons.Video size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-warm-white/30">
        
        {/* Timestamp */}
        <div className="text-center">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Today 2:30 PM</span>
        </div>

        {/* Aura Intro */}
        <div className="flex justify-center my-6">
          <div className="bg-gradient-to-r from-coral-light/50 to-orange-100 p-3 rounded-2xl border border-coral/10 max-w-[80%] text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1 text-coral">
              <Icons.Sparkles size={14} className="fill-coral" />
              <span className="text-[10px] font-bold uppercase">Aura Intro</span>
            </div>
            <p className="text-xs text-text-sec italic">
              "You both love {match.interests[0] || 'similar things'}. Maybe ask {match.name} about their favorite spot?"
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex justify-end">
          <div className="bg-coral text-white px-4 py-3 rounded-2xl rounded-tr-sm max-w-[75%] shadow-sm">
            <p className="text-sm">Hey! I saw you're into {match.interests[0] || 'cool stuff'} too! 🎮</p>
          </div>
        </div>

        <div className="flex justify-start gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mt-auto">
            <img src={match.photos[0]} className="w-full h-full object-cover" alt={match.name} />
          </div>
          <div className="bg-white border border-warm-gray text-text-main px-4 py-3 rounded-2xl rounded-tl-sm max-w-[75%] shadow-sm">
            <p className="text-sm">Yes!! Currently obsessed with it. What about you?</p>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-warm-gray flex items-center gap-2">
        <button className="p-2 text-text-muted hover:bg-warm-white rounded-full transition-colors">
          <Icons.Plus size={24} />
        </button>
        
        <div className="flex-1 bg-warm-white border border-warm-gray rounded-full px-4 py-2 flex items-center">
          <input 
            type="text" 
            placeholder="Type a message..." 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="bg-transparent w-full outline-none text-sm text-text-main placeholder-text-muted"
          />
          <button className="text-text-muted hover:text-coral transition-colors">
            <Icons.Smile size={20} />
          </button>
        </div>
        
        <button 
          onClick={handleSend}
          className="p-2 bg-coral text-white rounded-full shadow-md hover:scale-105 transition-transform"
        >
          <Icons.Send size={20} className="ml-0.5" />
        </button>
      </div>
    </div>
  );
};

export default ChatDetail;

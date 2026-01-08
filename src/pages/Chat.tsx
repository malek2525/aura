import React from 'react';
import { Icons } from '../components/Icons';

interface ChatProps {
  onChatSelect: (matchId: string) => void;
}

export const Chat: React.FC<ChatProps> = ({ onChatSelect }) => {
  return (
    <div className="h-full bg-white flex flex-col pt-4 pb-24 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text-main">Chats</h1>
        <button className="p-2 text-text-sec hover:bg-warm-white rounded-full">
          <Icons.Search size={20} />
        </button>
      </div>

      {/* New Matches Row */}
      <div className="mb-6">
        <h2 className="text-xs font-bold text-coral uppercase tracking-wider mb-3">Matches & Stories</h2>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {/* Add Story */}
          <div className="flex flex-col items-center gap-1 min-w-[70px]">
            <div className="w-[68px] h-[68px] rounded-full bg-warm-white border border-warm-gray flex items-center justify-center relative cursor-pointer">
              <Icons.Plus className="text-text-muted" size={24} />
            </div>
            <span className="text-xs font-medium text-text-sec">Add Story</span>
          </div>

          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className="flex flex-col items-center gap-1 min-w-[70px] cursor-pointer" 
              onClick={() => onChatSelect(i.toString())}
            >
              <div className={`w-[68px] h-[68px] rounded-full p-[2px] ${
                i === 1 ? 'bg-gradient-to-tr from-green-400 to-emerald-600' : 'bg-gradient-to-tr from-coral to-gold'
              }`}>
                <div className="w-full h-full rounded-full border-2 border-white overflow-hidden relative">
                  <img 
                    src={`https://picsum.photos/100/100?random=${i+50}`} 
                    className="w-full h-full object-cover" 
                    alt="Match"
                  />
                </div>
              </div>
              <span className="text-xs font-medium text-text-main">Sarah</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Messages</h2>
        <div className="space-y-2">
          
          {/* Active Chat */}
          <div 
            onClick={() => onChatSelect('julia')}
            className="flex items-center gap-3 p-3 hover:bg-warm-white rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-warm-gray group"
          >
            <div className="w-14 h-14 rounded-full overflow-hidden bg-warm-gray">
              <img 
                src="https://picsum.photos/100/100?random=61" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                alt="Julia"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-text-main">Julia</h3>
                <span className="text-[10px] text-text-muted">2h ago</span>
              </div>
              <p className="text-sm text-text-main font-medium line-clamp-1">
                That sounds amazing! I'd love to...
              </p>
            </div>
            <div className="w-2 h-2 rounded-full bg-coral" />
          </div>

          {/* Aura Chat */}
          <div 
            onClick={() => onChatSelect('emma')}
            className="flex items-center gap-3 p-3 hover:bg-warm-white rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-warm-gray group"
          >
            <div className="w-14 h-14 rounded-full overflow-hidden bg-warm-gray grayscale opacity-80">
              <img 
                src="https://picsum.photos/100/100?random=62" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                alt="Emma"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-text-sec">Emma</h3>
                <span className="text-[10px] text-text-muted">1d ago</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Icons.Sparkles size={12} className="text-coral" />
                <p className="text-sm text-text-sec line-clamp-1 italic">
                  Aura: I found 2 new potential matches...
                </p>
              </div>
            </div>
          </div>

          {/* Empty state hint */}
          <div className="text-center py-8 text-text-muted">
            <p className="text-sm">Start swiping to get more matches!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

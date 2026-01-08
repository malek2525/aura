import React from 'react';
import { Icons } from '../components/Icons';
import { UserProfile } from '../types';

interface ChatProps {
  onChatSelect: (matchId: string) => void;
}

export const Chat: React.FC<ChatProps> = ({ onChatSelect }) => {
  return (
    <div className="h-full bg-warm-white flex flex-col pt-6 pb-28 px-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-extrabold text-text-main">Connections</h1>
        <button className="p-3 bg-white border border-warm-gray text-text-main rounded-2xl shadow-sm hover:text-coral transition-colors">
          <Icons.Search size={20} />
        </button>
      </div>

      {/* New Matches Row */}
      <div className="mb-8">
        <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4 ml-1">New Matches</h2>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
           {/* Add Story / Self */}
           <div className="flex flex-col items-center gap-2 min-w-[72px]">
             <div className="w-[72px] h-[72px] rounded-[24px] bg-white border-2 border-dashed border-warm-gray flex items-center justify-center relative cursor-pointer hover:border-coral transition-colors text-coral">
               <Icons.Plus size={24} />
             </div>
             <span className="text-xs font-bold text-text-muted">You</span>
           </div>

           {[1, 2, 3].map((i) => (
             <div key={i} className="flex flex-col items-center gap-2 min-w-[72px] cursor-pointer group" onClick={() => onChatSelect(i.toString())}>
               <div className={`w-[72px] h-[72px] rounded-[24px] p-[2px] ${i === 1 ? 'bg-gradient-to-tr from-sage to-emerald-400' : 'bg-gradient-to-tr from-coral to-gold'}`}>
                 <div className="w-full h-full rounded-[22px] border-2 border-white overflow-hidden relative">
                    <img src={`https://picsum.photos/100/100?random=${i+50}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                 </div>
               </div>
               <span className="text-xs font-bold text-text-main">Sarah</span>
             </div>
           ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 ml-1">Conversations</h2>
        <div className="space-y-2">
           
           {/* Active Chat */}
           <div 
             onClick={() => onChatSelect('julia')}
             className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-transparent hover:border-warm-gray transition-all cursor-pointer shadow-sm group"
           >
               <div className="w-14 h-14 rounded-full overflow-hidden bg-warm-gray relative">
                 <img src={`https://picsum.photos/100/100?random=61`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                 <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-sage border-2 border-white rounded-full"></div>
               </div>
               <div className="flex-1 min-w-0">
                 <div className="flex justify-between items-center mb-1">
                   <h3 className="font-bold text-text-main text-base">Julia</h3>
                   <span className="text-[10px] font-bold text-coral bg-coral-light/30 px-2 py-0.5 rounded-full">2m</span>
                 </div>
                 <p className="text-sm text-text-main font-medium truncate">
                   That sounds amazing! I'd love to go there...
                 </p>
               </div>
           </div>

           {/* Read Chat */}
           <div 
             onClick={() => onChatSelect('emma')}
             className="flex items-center gap-4 p-4 hover:bg-white rounded-3xl transition-all cursor-pointer border border-transparent hover:border-warm-gray group"
           >
               <div className="w-14 h-14 rounded-full overflow-hidden bg-warm-gray grayscale opacity-80">
                 <img src={`https://picsum.photos/100/100?random=62`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
               </div>
               <div className="flex-1 min-w-0">
                 <div className="flex justify-between items-center mb-1">
                   <h3 className="font-bold text-text-sec">Emma</h3>
                   <span className="text-[10px] text-text-muted font-bold">1d</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                    <Icons.CheckCheck size={14} className="text-sage" />
                    <p className="text-sm text-text-muted truncate">
                       Can't wait for the weekend!
                    </p>
                 </div>
               </div>
           </div>

           {/* Aura Suggestion */}
           <div 
             className="flex items-center gap-4 p-4 bg-gradient-to-r from-warm-white to-white rounded-3xl border border-dashed border-warm-gray cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
           >
               <div className="w-14 h-14 rounded-full bg-coral-light/20 flex items-center justify-center text-coral">
                 <Icons.Sparkles size={24} />
               </div>
               <div className="flex-1">
                 <h3 className="font-bold text-text-main text-sm mb-0.5">Aura Suggestion</h3>
                 <p className="text-xs text-text-sec">
                    I found a profile that matches your vibe perfectly.
                 </p>
               </div>
               <Icons.ChevronRight size={18} className="text-text-muted" />
           </div>

        </div>
      </div>
    </div>
  );
};
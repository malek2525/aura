
import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { Logo } from '../components/Logo';

interface AppIconsProps {
  onBack: () => void;
}

export const AppIcons: React.FC<AppIconsProps> = ({ onBack }) => {
  const [activeIcon, setActiveIcon] = useState('signature');

  const IconOption = ({ id, name, render }: { id: string, name: string, render: React.ReactNode }) => (
    <div 
      onClick={() => setActiveIcon(id)}
      className="flex flex-col items-center gap-3 cursor-pointer group"
    >
      <div className={`relative w-20 h-20 transition-all duration-300 ${activeIcon === id ? 'scale-110' : 'group-hover:scale-105'}`}>
        {/* Shadow */}
        <div className={`absolute inset-0 rounded-[22px] blur-xl opacity-40 transition-opacity ${activeIcon === id ? 'opacity-60' : 'opacity-0'}`}
             style={{ background: 'currentColor' }}></div>
        
        {/* The Icon Render */}
        <div className={`w-full h-full rounded-[22px] overflow-hidden shadow-lg border-2 transition-all ${activeIcon === id ? 'border-coral ring-2 ring-coral/30 ring-offset-2' : 'border-transparent'}`}>
            {render}
        </div>

        {/* Checkmark Overlay */}
        {activeIcon === id && (
          <div className="absolute -bottom-2 -right-2 bg-coral text-white p-1 rounded-full shadow-sm border-2 border-white animate-in zoom-in">
            <Icons.Check size={12} strokeWidth={4} />
          </div>
        )}
      </div>
      <span className={`text-xs font-medium ${activeIcon === id ? 'text-coral font-bold' : 'text-text-sec'}`}>
        {name}
      </span>
    </div>
  );

  return (
    <div className="h-full bg-slate-50 flex flex-col">
      <div className="bg-white px-4 py-4 flex items-center border-b border-warm-gray sticky top-0 z-10">
        <button onClick={onBack} className="p-2 -ml-2 text-text-sec hover:bg-warm-white rounded-full">
          <Icons.ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-text-main mr-8">App Icon</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <div className="text-center mb-8">
           <h2 className="text-xl font-bold text-text-main mb-2">Choose your vibe</h2>
           <p className="text-sm text-text-sec">Select an icon that matches your aesthetic.</p>
        </div>

        <div className="grid grid-cols-3 gap-y-8 gap-x-4">
          
          {/* 1. Signature - The Core Brand */}
          <IconOption 
            id="signature" 
            name="Signature"
            render={
              <div className="w-full h-full bg-white flex items-center justify-center relative">
                 <Logo size={48} />
              </div>
            }
          />

          {/* 2. Linked - Connection / Marriage / Serious */}
          <IconOption 
            id="linked" 
            name="Linked"
            render={
              <div className="w-full h-full bg-warm-white flex items-center justify-center relative">
                 <div className="absolute inset-0 bg-gradient-to-br from-white to-coral/10"></div>
                 <div className="relative -ml-2">
                   <div className="w-8 h-8 rounded-full border-[3px] border-coral" />
                 </div>
                 <div className="relative -ml-3 mt-3">
                   <div className="w-8 h-8 rounded-full border-[3px] border-orange-400 bg-warm-white/50 backdrop-blur-[1px]" />
                 </div>
              </div>
            }
          />

          {/* 3. Crush - Chat/Flirt */}
          <IconOption 
            id="crush" 
            name="Crush"
            render={
              <div className="w-full h-full bg-coral-light flex items-center justify-center">
                 <div className="relative">
                    <Icons.MessageCircle size={44} className="text-coral fill-coral" />
                    <Icons.Heart size={16} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-2/3 text-white fill-white" />
                 </div>
              </div>
            }
          />

          {/* 4. Nearby - Location/Discovery */}
          <IconOption 
            id="nearby" 
            name="Nearby"
            render={
              <div className="w-full h-full bg-white flex items-center justify-center border border-warm-gray">
                 <div className="relative flex items-center justify-center">
                    <Icons.MapPin size={42} className="text-coral fill-coral" />
                    <Icons.Heart size={14} className="absolute top-[8px] text-white fill-white" />
                 </div>
              </div>
            }
          />

          {/* 5. Pulse - Chemistry/Vibe */}
          <IconOption 
            id="pulse" 
            name="Pulse"
            render={
              <div className="w-full h-full bg-gradient-to-tr from-orange-400 to-coral flex items-center justify-center">
                 <div className="absolute w-12 h-12 border border-white/30 rounded-full"></div>
                 <div className="absolute w-16 h-16 border border-white/10 rounded-full"></div>
                 <Icons.Heart size={28} className="text-white fill-white relative z-10" />
              </div>
            }
          />

           {/* 6. Twin - The "Twin" Concept */}
           <IconOption 
            id="twin" 
            name="Twin"
            render={
              <div className="w-full h-full bg-warm-white flex items-center justify-center gap-[2px]">
                 {/* Left Half Heart */}
                 <div className="w-4 h-8 bg-coral rounded-l-full rounded-r-none translate-x-[1px]"></div>
                 {/* Right Half Heart */}
                 <div className="w-4 h-8 bg-orange-300 rounded-r-full rounded-l-none -translate-x-[1px] translate-y-2"></div>
              </div>
            }
          />

          {/* 7. Gold - Premium/Serious */}
          <IconOption 
            id="gold" 
            name="Gold"
            render={
              <div className="w-full h-full bg-gradient-to-br from-yellow-600 to-yellow-400 flex items-center justify-center">
                 <div className="w-10 h-10 border-[1.5px] border-white/50 rounded-full flex items-center justify-center">
                    <Icons.Heart size={20} className="text-white fill-white" />
                 </div>
              </div>
            }
          />

          {/* 8. Porcelain - Minimalist */}
          <IconOption 
            id="porcelain" 
            name="Porcelain"
            render={
              <div className="w-full h-full bg-[#FDFDFD] flex items-center justify-center border border-gray-100">
                 <Icons.Heart className="text-text-main stroke-[1.5]" size={36} />
              </div>
            }
          />

          {/* 9. Night - Late Night Chats */}
          <IconOption 
            id="night" 
            name="Night"
            render={
              <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                 <div className="relative">
                    <div className="absolute inset-0 bg-coral blur-md opacity-50"></div>
                    <Icons.Heart size={32} className="text-coral fill-coral relative z-10" />
                 </div>
              </div>
            }
          />

        </div>
        
        <div className="mt-12 p-4 bg-warm-white rounded-xl border border-warm-gray text-center">
          <h3 className="text-sm font-bold text-text-main mb-1">VIP Feature</h3>
          <p className="text-xs text-text-sec">Aura+ members can change their app icon freely.</p>
        </div>

      </div>
      
      <div className="p-4 bg-white border-t border-warm-gray">
         <button className="w-full py-3 bg-text-main text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-transform">
           Apply Icon
         </button>
      </div>
    </div>
  );
};

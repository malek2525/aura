import React from 'react';
import { Icons } from './Icons';
import { ViewState } from '../types';

interface NavigationProps {
  currentView: ViewState;
  onChange: (view: ViewState) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onChange }) => {
  const navItems: { id: ViewState; icon: any; label: string }[] = [
    { id: 'aura', icon: Icons.Sparkles, label: 'Aura' },
    { id: 'discover', icon: Icons.Compass, label: 'Discover' },
    { id: 'likes', icon: Icons.Heart, label: 'Likes' },
    { id: 'chat', icon: Icons.MessageCircle, label: 'Chats' },
  ];

  return (
    <div className="absolute bottom-6 left-6 right-6 z-50">
      <div className="bg-white/90 backdrop-blur-xl border border-white/50 shadow-float rounded-[32px] px-2 py-3 flex justify-between items-center relative">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`flex-1 flex flex-col items-center gap-1 transition-all duration-300 relative group`}
            >
              {/* Active Indicator Dot (Floating above) */}
              {isActive && (
                <div className="absolute -top-1 w-1.5 h-1.5 bg-coral rounded-full shadow-glow animate-in fade-in zoom-in duration-300"></div>
              )}
              
              <div className={`p-3 rounded-2xl transition-all duration-300 ${isActive ? 'bg-coral-light/40 text-coral translate-y-[-2px]' : 'text-text-muted hover:text-text-main'}`}>
                <Icon size={isActive ? 24 : 22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "fill-coral/20" : ""} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
import React from 'react';
import { Icons } from './Icons';
import { ViewState } from '../types';

interface NavigationProps {
  currentView: ViewState;
  onChange: (view: ViewState) => void;
  unreadChats?: number;
  newLikes?: number;
  newMoments?: number;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  currentView, 
  onChange,
  unreadChats = 0,
  newLikes = 0,
  newMoments = 0
}) => {
  const navItems: { 
    id: ViewState; 
    icon: any; 
    label: string;
    badge?: number;
    specialStyle?: boolean;
  }[] = [
    { id: 'aura', icon: Icons.User, label: 'Me' },
    { id: 'discover', icon: Icons.Compass, label: 'Discover', specialStyle: true },
    { id: 'likes', icon: Icons.Heart, label: 'Likes', badge: newLikes },
    { id: 'chat', icon: Icons.MessageCircle, label: 'Chats', badge: unreadChats },
    { id: 'moments', icon: Icons.Camera, label: 'Moments', badge: newMoments },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-warm-gray z-50 safe-area-bottom">
      <div className="flex justify-between items-center max-w-md mx-auto px-2 py-2 pb-6">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          const hasBadge = item.badge && item.badge > 0;
          
          // Special center button for Discover
          if (item.specialStyle) {
            return (
              <button
                key={item.id}
                onClick={() => onChange(item.id)}
                className="flex flex-col items-center justify-center -mt-4 outline-none group"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-br from-coral to-gold scale-105' 
                    : 'bg-gradient-to-br from-coral/80 to-gold/80 group-hover:from-coral group-hover:to-gold'
                }`}>
                  <Icon 
                    size={26} 
                    className="text-white"
                    strokeWidth={2}
                  />
                </div>
                <span className={`text-[9px] font-bold mt-1 transition-colors ${
                  isActive ? 'text-coral' : 'text-text-muted'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          }
          
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className="flex-1 flex flex-col items-center justify-center gap-1 group outline-none py-1"
            >
              <div className="relative">
                {/* Icon with active state */}
                <div className={`p-2 rounded-xl transition-all duration-200 ${
                  isActive ? 'bg-coral-light/30' : 'group-hover:bg-warm-white'
                }`}>
                  <Icon 
                    size={22} 
                    className={`transition-all duration-200 ${
                      isActive 
                        ? 'text-coral' 
                        : 'text-text-muted group-hover:text-text-sec'
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                    fill={isActive && item.id === 'likes' ? 'currentColor' : 'none'}
                  />
                </div>
                
                {/* Notification Badge */}
                {hasBadge && (
                  <div className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-coral rounded-full flex items-center justify-center px-1 border-2 border-white shadow-sm animate-in zoom-in-50">
                    <span className="text-[10px] font-bold text-white">
                      {item.badge! > 9 ? '9+' : item.badge}
                    </span>
                  </div>
                )}
              </div>
              
              <span className={`text-[9px] font-bold tracking-wide transition-colors duration-200 ${
                isActive ? 'text-coral' : 'text-text-muted'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
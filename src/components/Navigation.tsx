import React from 'react';
import { Icons } from './Icons';
import { ViewState } from '../types';

interface NavigationProps {
  currentView: ViewState;
  onChange: (view: ViewState) => void;
  unreadChats?: number;
  unreadLikes?: number;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  currentView, 
  onChange,
  unreadChats = 0,
  unreadLikes = 0
}) => {
  const navItems: { id: ViewState; icon: any; label: string; badge?: number }[] = [
    { id: 'aura', icon: Icons.Sparkles, label: 'Aura' },
    { id: 'discover', icon: Icons.Compass, label: 'Discover' },
    { id: 'likes', icon: Icons.Heart, label: 'Likes', badge: unreadLikes },
    { id: 'chat', icon: Icons.MessageCircle, label: 'Chats', badge: unreadChats },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-warm-gray px-6 py-3 pb-6 flex justify-between items-center z-50 max-w-md mx-auto">
      {navItems.map((item) => {
        const isActive = currentView === item.id;
        const Icon = item.icon;
        
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 relative
              ${isActive ? 'text-coral scale-110' : 'text-text-muted hover:text-text-sec'}`}
          >
            {/* Badge */}
            {item.badge && item.badge > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-coral text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {item.badge > 9 ? '9+' : item.badge}
              </span>
            )}
            
            <Icon 
              size={isActive ? 26 : 24} 
              strokeWidth={isActive ? 2.5 : 2}
              className={isActive ? 'fill-coral/20' : ''}
            />
            
            <span className={`text-[10px] font-medium transition-all duration-300
              ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;

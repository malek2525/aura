import React from 'react';
import { Icons } from '../components/Icons';

interface SettingsProps {
  onBack: () => void;
  onLogout?: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onBack, onLogout }) => {
  return (
    <div className="h-full bg-white flex flex-col">
      <div className="bg-white px-4 py-4 flex items-center border-b border-warm-gray sticky top-0 z-10">
        <button onClick={onBack} className="p-2 -ml-2 text-text-sec">
          <Icons.ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-text-main mr-8">Settings</h1>
      </div>

      <div className="overflow-y-auto p-4 pb-24 space-y-8">
        
        {/* Dating Preferences */}
        <section>
          <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Dating Preferences</h2>
          <div className="bg-warm-white rounded-2xl border border-warm-gray overflow-hidden">
            <div className="p-4 border-b border-warm-gray flex justify-between items-center cursor-pointer hover:bg-white transition-colors">
              <span className="text-sm font-medium text-text-main">Show me</span>
              <div className="flex items-center text-text-sec text-sm gap-1">
                Women <Icons.ChevronRight size={16} />
              </div>
            </div>
            <div className="p-4 border-b border-warm-gray flex justify-between items-center cursor-pointer hover:bg-white transition-colors">
              <span className="text-sm font-medium text-text-main">Age Range</span>
              <span className="text-text-sec text-sm">18 - 28</span>
            </div>
            <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-white transition-colors">
              <span className="text-sm font-medium text-text-main">Distance</span>
              <span className="text-text-sec text-sm">25km</span>
            </div>
          </div>
        </section>

        {/* Aura Settings */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Icons.Sparkles size={14} className="text-coral" />
            <h2 className="text-xs font-bold text-coral uppercase tracking-wider">Aura Settings</h2>
          </div>
          <div className="bg-warm-white rounded-2xl border border-warm-gray overflow-hidden">
            <div className="p-4 border-b border-warm-gray flex justify-between items-center">
              <span className="text-sm font-medium text-text-main">Let Aura find matches</span>
              <div className="w-10 h-6 bg-coral rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-sm" />
              </div>
            </div>
            <div className="p-4 border-b border-warm-gray flex justify-between items-center">
              <span className="text-sm font-medium text-text-main">Aura-to-Aura conversations</span>
              <div className="w-10 h-6 bg-coral rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-sm" />
              </div>
            </div>
            <div className="p-4 flex justify-between items-center">
              <span className="text-sm font-medium text-text-main">Show Trust Score on profile</span>
              <div className="w-10 h-6 bg-coral rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-sm" />
              </div>
            </div>
          </div>
        </section>

        {/* Account */}
        <section>
          <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Account</h2>
          <div className="bg-warm-white rounded-2xl border border-warm-gray overflow-hidden">
            {[
              { label: 'Notifications', icon: Icons.Bell },
              { label: 'Privacy & Security', icon: Icons.ShieldCheck },
              { label: 'Help & Support', icon: Icons.MessageCircle },
            ].map((item, i) => (
              <div 
                key={i} 
                className="flex items-center p-4 border-b border-warm-gray last:border-0 hover:bg-white cursor-pointer transition-colors"
              >
                <item.icon size={18} className="text-text-muted mr-3" />
                <span className="text-sm font-medium text-text-main flex-1">{item.label}</span>
                <Icons.ChevronRight size={16} className="text-text-muted" />
              </div>
            ))}
          </div>
        </section>
        
        <button 
          onClick={onLogout}
          className="w-full py-3 rounded-xl border border-warm-gray bg-white text-text-main font-medium text-sm hover:bg-warm-white transition-colors"
        >
          Log Out
        </button>
        
        <button className="w-full py-3 rounded-xl text-text-muted font-medium text-xs hover:text-red-500 transition-colors">
          Delete account
        </button>
      </div>
    </div>
  );
};

export default Settings;

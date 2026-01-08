
import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { Logo } from '../components/Logo';
import { ChatWindow } from '../components/ChatWindow';
import { LiveVoiceMode } from '../components/LiveVoiceMode';
import { MePanel } from '../components/MePanel';
import { AuraChatMessage, UserProfile } from '../types';
import { chatWithAura } from '../services/auraLLM';

interface AuraProps {
  onEditProfile: () => void;
  onSettings: () => void;
  onPreviewProfile: () => void;
}

// Mock initial profile if not loaded
const MOCK_PROFILE: UserProfile = {
  id: 'me', name: 'Abdulmalek', age: 28, bio: "Big fan of football.", job: 'Founder', location: 'Budapest', distance: 0, verified: true,
  photos: ['https://picsum.photos/400/600?random=100'],
  auraRead: "Thoughtful introvert.", vibeTags: ['Calm'], verificationScore: 82, verificationTier: 'Gold', stories: [], interests: ['Gym'],
  prompts: [], details: { height: '185cm', exercise: 'Active', education: 'Masters', drinking: 'Socially', smoking: 'No', lookingFor: 'Relationship', starSign: 'Leo', languages: ['English'] },
  // Deep fields needed for LLM
  introversionLevel: 7,
  socialSpeed: 'slow',
  goals: ['find serious partner'],
  vibeWords: ['thoughtful', 'calm']
};

export const Aura: React.FC<AuraProps> = ({ onEditProfile, onSettings, onPreviewProfile }) => {
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [showMePanel, setShowMePanel] = useState(false);
  const [messages, setMessages] = useState<AuraChatMessage[]>([
    { id: '1', from: 'aura', text: "Hey! I'm syncing with your vibe today. How are you feeling about meeting new people?", timestamp: Date.now() }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (text: string) => {
    // Optimistic Update
    const userMsg: AuraChatMessage = { id: Date.now().toString(), from: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Call LLM
    const response = await chatWithAura(MOCK_PROFILE, messages, text);
    
    const auraMsg: AuraChatMessage = { id: (Date.now()+1).toString(), from: 'aura', text: response.replyText, timestamp: Date.now() };
    setMessages(prev => [...prev, auraMsg]);
    setIsLoading(false);
  };

  if (isLiveMode) {
    return <LiveVoiceMode profile={MOCK_PROFILE} onExit={() => setIsLiveMode(false)} />;
  }

  return (
    <div className="h-full bg-warm-white flex flex-col relative overflow-hidden">
      {/* Top Header */}
      <div className="flex justify-between items-center px-5 pt-6 pb-2 shrink-0 bg-warm-white z-10">
        <div className="flex items-center gap-2">
          <Logo size={28} />
          <div>
            <h1 className="text-xl font-extrabold text-text-main tracking-tight leading-none">
              Aura <span className="text-coral">Twin</span>
            </h1>
            <p className="text-[10px] text-text-muted font-bold tracking-widest uppercase">Your AI Wingman</p>
          </div>
        </div>
        <div className="flex gap-2">
            <button onClick={() => setShowMePanel(true)} className="p-2.5 bg-white border border-warm-gray text-text-sec hover:text-coral rounded-2xl shadow-sm transition-colors">
              <Icons.User size={20} />
            </button>
            <button onClick={onSettings} className="p-2.5 bg-white border border-warm-gray text-text-sec hover:text-coral rounded-2xl shadow-sm transition-colors">
              <Icons.Settings size={20} />
            </button>
        </div>
      </div>

      {/* Main Chat Area - Occupies remaining space */}
      <div className="flex-1 overflow-hidden relative rounded-t-[32px] shadow-inner border-t border-warm-gray mt-2">
         <ChatWindow 
           messages={messages} 
           onSendMessage={handleSendMessage} 
           isLoading={isLoading}
           title="Aura"
           subtitle="Neural Link"
         />
         
         {/* Live Voice Button (Floating) */}
         <div className="absolute bottom-24 right-4 z-20">
            <button 
              onClick={() => setIsLiveMode(true)}
              className="w-14 h-14 bg-gradient-to-tr from-coral to-gold rounded-full shadow-lg shadow-coral/30 text-white flex items-center justify-center hover:scale-105 transition-transform animate-in zoom-in duration-300"
            >
               <Icons.Sparkles size={24} className="animate-pulse-slow" />
            </button>
         </div>
      </div>

      {/* Me Panel Overlay */}
      <MePanel profile={MOCK_PROFILE} isOpen={showMePanel} onClose={() => setShowMePanel(false)} />
    </div>
  );
};

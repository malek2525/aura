import React, { useState } from 'react';
import AuraAvatarCard from '../components/AuraAvatarCard';
import AvatarCircle from '../components/AvatarCircle';
import ChatWindow from '../components/ChatWindow';
import { AuraProfile, AuraState, AuraChatMessage } from '../types';
import { chatWithAura } from '../services/auraLLM';

interface NeuralLinkScreenProps {
  profile: AuraProfile;
  history: AuraChatMessage[];
  setHistory: React.Dispatch<React.SetStateAction<AuraChatMessage[]>>;
  auraState: AuraState;
  setAuraState: React.Dispatch<React.SetStateAction<AuraState>>;
}

const NeuralLinkScreen: React.FC<NeuralLinkScreenProps> = ({ 
  profile, 
  history, 
  setHistory, 
  auraState, 
  setAuraState 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (text: string) => {
    // 1. Add user message
    const userMsg: AuraChatMessage = {
      id: Date.now().toString(),
      from: 'user',
      text: text,
      timestamp: Date.now()
    };
    
    // Optimistic update
    const newHistory = [...history, userMsg];
    setHistory(newHistory);
    setIsLoading(true);

    // 2. Call LLM
    const { replyText, auraState: newAuraState } = await chatWithAura(profile, newHistory, text);

    // 3. Update state
    setAuraState(newAuraState);

    // 4. Add Aura message
    const auraMsg: AuraChatMessage = {
      id: (Date.now() + 1).toString(),
      from: 'aura',
      text: replyText,
      timestamp: Date.now()
    };

    setHistory(prev => [...prev, auraMsg]);
    setIsLoading(false);
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header with avatar */}
      <div className="rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-xl px-6 py-5 flex items-center gap-4 shadow-[0_0_60px_rgba(0,0,0,0.7)]">
        <AvatarCircle imageUrl={profile.avatarUrl} size="md" />
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-slate-50">{profile.displayName}'s Aura</h2>
          <p className="text-xs text-slate-300 line-clamp-1">{profile.summary}</p>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-hidden">
        <ChatWindow 
          messages={history} 
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default NeuralLinkScreen;

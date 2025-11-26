import React, { useState } from 'react';
import AuraAvatarCard from '../components/AuraAvatarCard';
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
    <div className="h-full flex flex-col md:flex-row gap-6 p-4 md:p-8">
      {/* Left: Avatar */}
      <div className="w-full md:w-1/3 h-[40vh] md:h-full">
        <AuraAvatarCard profile={profile} auraState={auraState} />
      </div>

      {/* Right: Chat */}
      <div className="w-full md:w-2/3 h-[50vh] md:h-full">
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

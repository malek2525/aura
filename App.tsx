import React, { useState } from 'react';
import { AuraProfile, AuraChatMessage, AuraState, ScreenName } from './types';
import OnboardingScreen from './screens/OnboardingScreen';
import NeuralLinkScreen from './screens/NeuralLinkScreen';
import MatchTestScreen from './screens/MatchTestScreen';
import AuraAvatarCard from './components/AuraAvatarCard';
import NeuralProfilePanel from './components/NeuralProfilePanel';
import ChatWindow from './components/ChatWindow';
import { chatWithAura } from './services/auraLLM';

type TabName = 'neural' | 'match' | 'profile';

const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenName>('ONBOARDING');
  const [activeTab, setActiveTab] = useState<TabName>('neural');
  
  const [profile, setProfile] = useState<AuraProfile | null>(null);
  
  const [chatHistory, setChatHistory] = useState<AuraChatMessage[]>([]);
  const [auraState, setAuraState] = useState<AuraState>({
    mood: 'neutral',
    moodIntensity: 0.2
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleProfileCreated = (newProfile: AuraProfile) => {
    setProfile(newProfile);
    setScreen('NEURAL_LINK');
    setChatHistory([{
      id: 'init',
      from: 'aura',
      text: `Hello ${newProfile.displayName}. I am your Aura. I've analyzed your profile, and I feel... ${newProfile.vibeWords[0] || 'connected'}. I'm here for you.`,
      timestamp: Date.now()
    }]);
    setAuraState({ mood: 'calm', moodIntensity: 0.5 });
  };

  const handleSendMessage = async (text: string) => {
    if (!profile) return;
    
    const userMsg: AuraChatMessage = {
      id: Date.now().toString(),
      from: 'user',
      text: text,
      timestamp: Date.now()
    };
    
    const newHistory = [...chatHistory, userMsg];
    setChatHistory(newHistory);
    setIsLoading(true);

    const { replyText, auraState: newAuraState } = await chatWithAura(profile, newHistory, text);

    setAuraState(newAuraState);

    const auraMsg: AuraChatMessage = {
      id: (Date.now() + 1).toString(),
      from: 'aura',
      text: replyText,
      timestamp: Date.now()
    };

    setChatHistory(prev => [...prev, auraMsg]);
    setIsLoading(false);
  };

  const handleProfileChange = (updatedProfile: AuraProfile) => {
    setProfile(updatedProfile);
  };

  if (screen === 'ONBOARDING') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black">
        <OnboardingScreen onProfileCreated={handleProfileCreated} />
      </div>
    );
  }

  const tabs: { id: TabName; label: string }[] = [
    { id: 'neural', label: 'Neural Link' },
    { id: 'match', label: 'Match Test' },
    { id: 'profile', label: 'Neural Profile' }
  ];

  return (
    <div className="min-h-screen bg-gradient-radial from-slate-900 via-slate-950 to-black text-slate-100 font-sans">
      <div className="h-screen flex flex-col lg:flex-row max-w-7xl mx-auto p-4 lg:p-8 gap-6">
        
        <div className="w-full lg:w-[40%] h-[35vh] lg:h-full">
          <div className="h-full glass-panel rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-900/10 via-transparent to-blue-900/10" />
            
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
              {profile && (
                <AuraAvatarCard 
                  profile={profile} 
                  auraState={auraState}
                />
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[60%] h-[60vh] lg:h-full flex flex-col gap-4">
          <div className="glass-panel rounded-2xl p-1.5 flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-violet-600/30 text-violet-200 shadow-lg shadow-violet-900/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 glass-panel rounded-3xl overflow-hidden">
            {activeTab === 'neural' && profile && (
              <div className="h-full p-4 lg:p-6">
                <ChatWindow
                  messages={chatHistory}
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                />
              </div>
            )}

            {activeTab === 'match' && profile && (
              <div className="h-full overflow-y-auto p-4 lg:p-6 scrollbar-hide">
                <MatchTestScreen userProfile={profile} />
              </div>
            )}

            {activeTab === 'profile' && profile && (
              <div className="h-full overflow-y-auto p-4 lg:p-6 scrollbar-hide">
                <NeuralProfilePanel 
                  profile={profile} 
                  onChange={handleProfileChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

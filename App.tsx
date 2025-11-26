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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100 font-sans">
      {/* Top bar */}
      <div className="h-16 border-b border-white/5 backdrop-blur-md bg-slate-950/40 flex items-center justify-between px-6 lg:px-8">
        <h1 className="text-xl font-semibold bg-gradient-to-r from-violet-300 to-blue-300 bg-clip-text text-transparent">
          Aura Twin
        </h1>
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-emerald-500/70 shadow-lg shadow-emerald-500/30" />
          <button className="text-sm text-slate-400 hover:text-slate-200 pill-button px-4 py-2">
            Profile
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 h-[calc(100vh-4rem)] flex flex-col lg:flex-row max-w-7xl mx-auto p-6 lg:p-8 gap-6">
        
        {/* Left column: Avatar (60% on desktop) */}
        <div className="w-full lg:w-[60%] h-[40vh] lg:h-full flex flex-col gap-6">
          <div className="flex-1 glass-panel rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-900/5 via-transparent to-blue-900/5" />
            
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
              {profile && (
                <>
                  <AuraAvatarCard 
                    profile={profile} 
                    auraState={auraState}
                  />
                  <div className="mt-6 text-center">
                    <p className="text-sm text-slate-300 font-medium">{profile.displayName}</p>
                    <p className="text-xs text-slate-500 mt-1">{profile.summary}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Tabs & Content (40% on desktop) */}
        <div className="w-full lg:w-[40%] h-[55vh] lg:h-full flex flex-col gap-3">
          {/* Tab bar */}
          <div className="glass-panel rounded-2xl p-1 flex gap-1 flex-shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white/10 text-slate-100 shadow-md'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content panel */}
          <div className="flex-1 glass-panel rounded-3xl overflow-hidden flex flex-col">
            {activeTab === 'neural' && profile && (
              <div className="h-full flex flex-col p-4 lg:p-6">
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

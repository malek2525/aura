import React, { useState } from 'react';
import { AuraProfile, AuraChatMessage, AuraState, ScreenName } from './types';
import OnboardingScreen from './screens/OnboardingScreen';
import NeuralLinkScreen from './screens/NeuralLinkScreen';
import MatchTestScreen from './screens/MatchTestScreen';

const App: React.FC = () => {
  // --- APP STATE ---
  const [screen, setScreen] = useState<ScreenName>('ONBOARDING');
  
  // User Data
  const [profile, setProfile] = useState<AuraProfile | null>(null);
  
  // Chat Data
  const [chatHistory, setChatHistory] = useState<AuraChatMessage[]>([]);
  const [auraState, setAuraState] = useState<AuraState>({
    mood: 'neutral',
    moodIntensity: 0.2
  });

  // --- HANDLERS ---
  const handleProfileCreated = (newProfile: AuraProfile) => {
    setProfile(newProfile);
    setScreen('NEURAL_LINK');
    // Add initial greeting from Aura
    setChatHistory([{
      id: 'init',
      from: 'aura',
      text: `Hello ${newProfile.displayName}. I am your Aura. I've analyzed your profile, and I feel... ${newProfile.vibeWords[0]}. I'm here for you.`,
      timestamp: Date.now()
    }]);
    setAuraState({ mood: 'calm', moodIntensity: 0.5 });
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-aura-dark text-aura-text font-sans selection:bg-aura-accent selection:text-white flex flex-col">
      
      {/* HEADER */}
      {screen !== 'ONBOARDING' && (
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-aura-dark/95 backdrop-blur sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-aura-accent to-blue-500 animate-pulse-slow" />
            <span className="font-bold text-xl tracking-tight">Aura Twin</span>
          </div>
          
          <nav className="flex gap-2 bg-white/5 p-1 rounded-lg">
            <button
              onClick={() => setScreen('NEURAL_LINK')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                screen === 'NEURAL_LINK' 
                  ? 'bg-aura-accent text-white shadow-lg' 
                  : 'text-aura-muted hover:text-white'
              }`}
            >
              Neural Link
            </button>
            <button
              onClick={() => setScreen('MATCH_TEST')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                screen === 'MATCH_TEST' 
                  ? 'bg-aura-accent text-white shadow-lg' 
                  : 'text-aura-muted hover:text-white'
              }`}
            >
              Match Test
            </button>
          </nav>
        </header>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-hidden relative">
        {screen === 'ONBOARDING' && (
          <OnboardingScreen onProfileCreated={handleProfileCreated} />
        )}

        {screen === 'NEURAL_LINK' && profile && (
          <NeuralLinkScreen 
            profile={profile}
            history={chatHistory}
            setHistory={setChatHistory}
            auraState={auraState}
            setAuraState={setAuraState}
          />
        )}

        {screen === 'MATCH_TEST' && profile && (
          <MatchTestScreen userProfile={profile} />
        )}
      </main>
    </div>
  );
};

export default App;
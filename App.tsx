import React, { useState } from 'react';
import { AuraProfile, AuraChatMessage, AuraState, ScreenName } from './types';
import OnboardingScreen from './screens/OnboardingScreen';
import NeuralLinkScreen from './screens/NeuralLinkScreen';
import MatchTestScreen from './screens/MatchTestScreen';
import TwinIntroScreen from './screens/TwinIntroScreen';

type ViewScreen = 'onboarding' | 'neural' | 'match' | 'intro';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ViewScreen>('onboarding');
  
  const [profile, setProfile] = useState<AuraProfile | null>(null);
  const [chatHistory, setChatHistory] = useState<AuraChatMessage[]>([]);
  const [auraState, setAuraState] = useState<AuraState>({
    mood: 'neutral',
    moodIntensity: 0.2
  });

  const handleProfileCreated = (newProfile: AuraProfile) => {
    setProfile(newProfile);
    setCurrentScreen('neural');
    setChatHistory([{
      id: 'init',
      from: 'aura',
      text: `Hello ${newProfile.displayName}. I am your Aura. I've analyzed your profile, and I feel... ${newProfile.vibeWords[0] || 'connected'}. I'm here for you.`,
      timestamp: Date.now()
    }]);
    setAuraState({ mood: 'calm', moodIntensity: 0.5 });
  };

  const navItems: { id: ViewScreen; label: string }[] = [
    { id: 'onboarding', label: 'Calibrate Aura' },
    { id: 'neural', label: 'Talk to Aura' },
    { id: 'match', label: 'Match Score' },
    { id: 'intro', label: 'Twin Intro' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100 font-sans">
      
      {/* Top Navigation */}
      <header className="border-b border-white/5 backdrop-blur-md bg-slate-950/40 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 py-4 lg:px-6">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
              <div className="text-[11px] font-mono tracking-[0.3em] uppercase text-slate-400">
                Aura Twin · Private Neural Link
              </div>
            </div>

            {/* Navigation Pills */}
            <nav className="flex gap-1.5 rounded-full bg-slate-900/70 border border-white/10 backdrop-blur-xl px-1.5 py-1.5">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    currentScreen === item.id
                      ? 'bg-slate-100 text-slate-900 shadow-lg'
                      : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Status indicator */}
            <div className="text-[11px] text-slate-500">
              {profile ? `● Connected · For your eyes only` : 'Channel encrypted'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 lg:py-10 lg:px-6">
        {/* Onboarding Screen */}
        {currentScreen === 'onboarding' && (
          <div className="rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-2xl shadow-2xl p-4 lg:p-8 max-w-2xl mx-auto">
            <OnboardingScreen onProfileCreated={handleProfileCreated} />
          </div>
        )}

        {/* Neural Link Screen */}
        {currentScreen === 'neural' && profile && (
          <div className="h-[min(85vh,800px)]">
            <NeuralLinkScreen
              profile={profile}
              history={chatHistory}
              setHistory={setChatHistory}
              auraState={auraState}
              setAuraState={setAuraState}
            />
          </div>
        )}

        {/* Match Test Screen */}
        {currentScreen === 'match' && profile && (
          <div className="rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-2xl shadow-2xl p-4 lg:p-8">
            <MatchTestScreen userProfile={profile} />
          </div>
        )}

        {/* Twin Intro Screen */}
        {currentScreen === 'intro' && (
          <TwinIntroScreen />
        )}

        {/* Placeholder if no profile for neural/match */}
        {(currentScreen === 'neural' || currentScreen === 'match') && !profile && (
          <div className="rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-2xl shadow-2xl p-8 text-center">
            <p className="text-slate-400">Please complete onboarding first.</p>
            <button
              onClick={() => setCurrentScreen('onboarding')}
              className="mt-4 rounded-full px-6 py-2 bg-slate-100 text-slate-900 text-sm font-medium hover:bg-white transition-colors"
            >
              Go to Onboarding
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

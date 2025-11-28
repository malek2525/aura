import React, { useState } from 'react';
import { AuraProfile, AuraChatMessage, AuraState, ScreenName } from './types';
import OnboardingScreen from './screens/OnboardingScreen';
import NeuralLinkScreen from './screens/NeuralLinkScreen';
import MatchTestScreen from './screens/MatchTestScreen';
import TwinIntroScreen from './screens/TwinIntroScreen';
import ReplyLabScreen from './screens/ReplyLabScreen';
import { AuraStage } from './components/AuraStage';

type ViewScreen = 'onboarding' | 'neural' | 'match' | 'intro' | 'replylab';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ViewScreen>('onboarding');
  
  const [profile, setProfile] = useState<AuraProfile | null>(null);
  const [chatHistory, setChatHistory] = useState<AuraChatMessage[]>([]);
  const [auraState, setAuraState] = useState<AuraState>({
    mood: 'neutral',
    moodIntensity: 0.2
  });
  const [replyLabPrefill, setReplyLabPrefill] = useState<string | undefined>(undefined);

  const handleOpenReplyLab = (prefillText?: string) => {
    setReplyLabPrefill(prefillText);
    setCurrentScreen('replylab');
  };

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

  // Onboarding has its own full-page layout
  if (currentScreen === 'onboarding') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100 font-sans flex flex-col p-4 lg:p-6 overflow-hidden">
        <div className="flex-1 overflow-hidden relative animate-fade-in">
          <div className="max-w-2xl mx-auto">
            <div className="rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-2xl shadow-2xl p-4 lg:p-8">
              <OnboardingScreen onProfileCreated={handleProfileCreated} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main app layout with Aura Stage on left, panels on right
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100 font-sans flex flex-col p-4 lg:p-6 overflow-hidden">
      
      <main className="w-full max-w-[1400px] h-[90vh] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
        
        {/* Left Column: Aura Stage (60% on desktop) */}
        <div className="lg:col-span-7 h-full hidden lg:block">
          <AuraStage profile={profile} auraState={auraState} />
        </div>

        {/* Right Column: Panels */}
        <div className="lg:col-span-5 h-full flex flex-col gap-4 relative">
          
          {/* Navigation Pills */}
          <nav className="flex justify-center p-2">
            <div className="flex gap-2 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-full border border-white/10 shadow-lg">
              <button
                onClick={() => setCurrentScreen('neural')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  currentScreen === 'neural' 
                    ? 'bg-slate-100 text-slate-900 shadow-lg' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Talk to Aura
              </button>
              <button
                onClick={() => setCurrentScreen('match')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  currentScreen === 'match' 
                    ? 'bg-slate-100 text-slate-900 shadow-lg' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Match Score
              </button>
              <button
                onClick={() => setCurrentScreen('intro')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  currentScreen === 'intro' 
                    ? 'bg-slate-100 text-slate-900 shadow-lg' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Twin Intro
              </button>
              <button
                onClick={() => setCurrentScreen('replylab')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  currentScreen === 'replylab' 
                    ? 'bg-slate-100 text-slate-900 shadow-lg' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Reply Lab
              </button>
            </div>
          </nav>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden rounded-[32px] bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-xl">
            
            {currentScreen === 'neural' && profile && (
              <div className="h-full">
                <NeuralLinkScreen 
                  profile={profile}
                  history={chatHistory}
                  setHistory={setChatHistory}
                  auraState={auraState}
                  setAuraState={setAuraState}
                  onOpenReplyLab={handleOpenReplyLab}
                />
              </div>
            )}

            {currentScreen === 'match' && profile && (
              <div className="h-full overflow-y-auto custom-scrollbar p-4 lg:p-6">
                <MatchTestScreen userProfile={profile} auraState={auraState} />
              </div>
            )}

            {currentScreen === 'intro' && (
              <div className="h-full overflow-y-auto custom-scrollbar">
                <TwinIntroScreen />
              </div>
            )}

            {currentScreen === 'replylab' && profile && (
              <div className="h-full">
                <ReplyLabScreen profile={profile} prefillText={replyLabPrefill} />
              </div>
            )}

            {/* Placeholder if no profile */}
            {(currentScreen === 'neural' || currentScreen === 'match' || currentScreen === 'replylab') && !profile && (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                <p className="text-slate-400">Please complete onboarding first.</p>
                <button
                  onClick={() => setCurrentScreen('onboarding')}
                  className="mt-4 rounded-full px-6 py-2 bg-slate-100 text-slate-900 text-sm font-medium hover:bg-white transition-colors"
                >
                  Calibrate Aura
                </button>
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500">
            <div className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span className="font-mono tracking-widest uppercase">
              {profile ? `● Connected · ${profile.displayName}` : 'Aura Twin · Private Link'}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

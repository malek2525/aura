import React, { useState, useEffect } from 'react';
import { AuraProfile, AuraChatMessage, AuraState, ScreenName } from './types';
import OnboardingScreen from './screens/OnboardingScreen';
import NeuralLinkScreen from './screens/NeuralLinkScreen';
import MatchTestScreen from './screens/MatchTestScreen';
import TwinIntroScreen from './screens/TwinIntroScreen';
import ReplyLabScreen from './screens/ReplyLabScreen';
import { AuraStage } from './components/AuraStage';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { AuthScreen } from './src/screens/AuthScreen';
import { loadAuraProfile, persistAuraProfile } from './src/storage/profileStorage';

type ViewScreen = 'onboarding' | 'neural' | 'match' | 'intro' | 'replylab';

const AppContent: React.FC = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  
  const [currentScreen, setCurrentScreen] = useState<ViewScreen>('onboarding');
  const [profile, setProfile] = useState<AuraProfile | null>(null);
  const [chatHistory, setChatHistory] = useState<AuraChatMessage[]>([]);
  const [auraState, setAuraState] = useState<AuraState>({
    mood: 'neutral',
    moodIntensity: 0.2
  });
  const [replyLabPrefill, setReplyLabPrefill] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (user) {
      const saved = loadAuraProfile(user.uid);
      if (saved) {
        setProfile(saved);
        setCurrentScreen('neural');
        if (chatHistory.length === 0) {
          setChatHistory([{
            id: 'init',
            from: 'aura',
            text: `Hello ${saved.displayName}. I am your Aura. Welcome back.`,
            timestamp: Date.now()
          }]);
        }
        setAuraState({ mood: 'calm', moodIntensity: 0.5 });
      }
    }
  }, [user]);

  const handleOpenReplyLab = (prefillText?: string) => {
    setReplyLabPrefill(prefillText);
    setCurrentScreen('replylab');
  };

  const handleProfileCreated = (newProfile: AuraProfile) => {
    if (user) {
      persistAuraProfile(newProfile, user.uid);
    }
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

  const handleSignOut = async () => {
    await signOut();
    setProfile(null);
    setChatHistory([]);
    setCurrentScreen('onboarding');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm">Loading Aura...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  if (currentScreen === 'onboarding' && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100 font-sans flex flex-col p-4 lg:p-6 overflow-hidden">
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 rounded-full transition-all"
          >
            Sign Out
          </button>
        </div>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100 font-sans flex flex-col p-4 lg:p-6 overflow-hidden">
      
      <main className="w-full max-w-[1400px] h-[90vh] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
        
        <div className="lg:col-span-7 h-full hidden lg:block">
          <AuraStage profile={profile} auraState={auraState} />
        </div>

        <div className="lg:col-span-5 h-full flex flex-col gap-4 relative">
          
          <nav className="flex justify-between items-center p-2">
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

            <button
              onClick={handleSignOut}
              className="px-4 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800/50 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 rounded-full transition-all"
            >
              Sign Out
            </button>
          </nav>

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

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;

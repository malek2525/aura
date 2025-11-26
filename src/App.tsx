import React, { useState, useEffect } from 'react';
import { AuraProfile, AuraChatMessage, AuraState } from './types';
import OnboardingScreen from './screens/OnboardingScreen';
import NeuralLinkScreen from './screens/NeuralLinkScreen';
import MatchTestScreen from './screens/MatchTestScreen';
import TwinConversationScreen from './screens/TwinConversationScreen';
import { TwinVideoMomentsScreen } from './screens/TwinVideoMomentsScreen';
import { NightDebriefScreen } from './screens/NightDebriefScreen';
import { loadAuraProfile, persistAuraProfile, clearAuraProfile } from './storage/profileStorage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthScreen } from './screens/AuthScreen';

type Screen = 'onboarding' | 'neural' | 'match' | 'twinTalk' | 'videoMoments' | 'nightDebrief';

// Sample Profile used for B-side interactions
const SAMPLE_LINA_PROFILE: AuraProfile = {
  id: "sample_lina",
  displayName: "Lina",
  ageRange: "22-27",
  country: "Germany",
  introversionLevel: 6,
  goals: ["friends", "practice_talking"],
  vibeWords: ["thoughtful", "kind", "curious"],
  topicsLike: ["art", "music", "late-night walks"],
  topicsAvoid: ["politics"],
  socialSpeed: "slow",
  hardBoundaries: ["no explicit content", "no heavy drama"],
  greenFlags: ["honesty", "emotional maturity"],
  redFlags: ["ghosting", "mocking others"],
  summary: "Lina is a quiet, thoughtful person who loves deep conversations and gentle people."
};

const AppContent: React.FC = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<AuraProfile | null>(null);
  const [screen, setScreen] = useState<Screen>('onboarding');

  // Chat & Aura State
  const [chatHistory, setChatHistory] = useState<AuraChatMessage[]>([]);
  const [auraState, setAuraState] = useState<AuraState>({
    mood: 'neutral',
    moodIntensity: 0.2
  });

  // Load profile on mount or user change
  useEffect(() => {
    if (user) {
      const savedProfile = loadAuraProfile(user.uid);
      if (savedProfile) {
        setProfile(savedProfile);
        setScreen('neural');
        
        // Reset chat history for new session if empty (assuming chat isn't persisted for now)
        // If switching users, we should probably clear chatHistory, but let's assume component unmount handles that partially.
        // Better to explicitly set based on user switch.
      } else {
        setProfile(null);
        setScreen('onboarding');
      }
    }
  }, [user]);
  
  // Clear state when user changes (e.g. logout)
  useEffect(() => {
    if (!user) {
      setProfile(null);
      setChatHistory([]);
      setAuraState({ mood: 'neutral', moodIntensity: 0.2 });
    }
  }, [user]);

  // Initial greeting logic when profile loads is handled above, but let's ensure chat greeting works
  useEffect(() => {
    if (profile && chatHistory.length === 0) {
       setChatHistory([{
          id: 'init-reload',
          from: 'aura',
          text: `Welcome back, ${profile.displayName}. I am here and listening.`,
          timestamp: Date.now()
        }]);
        setAuraState({ mood: 'calm', moodIntensity: 0.3 });
    }
  }, [profile]);


  const handleOnboardingComplete = (newProfile: AuraProfile) => {
    if (user) {
      persistAuraProfile(newProfile, user.uid);
      setProfile(newProfile);
      setScreen('neural');
      
      // Initial Greeting
      setChatHistory([{
        id: 'init',
        from: 'aura',
        text: `Hello ${newProfile.displayName}. I am your Aura. I've analyzed your profile, and I feel... ${newProfile.vibeWords[0] || 'connected'}. I'm here for you.`,
        timestamp: Date.now()
      }]);
      setAuraState({ mood: 'calm', moodIntensity: 0.5 });
    }
  };

  const handleResetAura = () => {
    if (user) {
      clearAuraProfile(user.uid);
      setProfile(null);
      setChatHistory([]);
      setAuraState({ mood: 'neutral', moodIntensity: 0.2 });
      setScreen('onboarding');
    }
  };

  const navButtonClass = (targetScreen: Screen) => {
    const isActive = screen === targetScreen;
    return `px-3 py-1.5 rounded-full border text-[11px] md:text-xs font-medium transition-all duration-300 whitespace-nowrap ${
      isActive
        ? 'bg-slate-800/80 text-slate-50 border-white/20 shadow-sm'
        : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200 hover:bg-white/5'
    }`;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100 font-sans selection:bg-blue-500/30 flex flex-col">
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 lg:py-8 flex flex-col gap-6 h-screen">
        
        {/* Header - Only visible if profile exists */}
        {profile && screen !== 'nightDebrief' && (
          <header className="flex flex-col md:flex-row items-center justify-between gap-4 py-2 shrink-0">
            {/* Logo Area */}
            <div className="flex items-center gap-2 md:w-1/4">
              <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)] animate-pulse" />
              <span className="text-sm font-medium tracking-wide text-slate-200">Aura Twin</span>
            </div>

            {/* Navigation */}
            <nav className="flex items-center justify-center bg-slate-900/50 backdrop-blur-md rounded-full p-1 border border-white/5 overflow-x-auto max-w-full">
              <button
                onClick={() => setScreen('onboarding')}
                className={navButtonClass('onboarding')}
              >
                Profile
              </button>
              <button
                onClick={() => setScreen('neural')}
                className={navButtonClass('neural')}
              >
                Neural Link
              </button>
              <button
                onClick={() => setScreen('match')}
                className={navButtonClass('match')}
              >
                Match Test
              </button>
              <button
                onClick={() => setScreen('twinTalk')}
                className={navButtonClass('twinTalk')}
              >
                Twin Talk
              </button>
              <button
                onClick={() => setScreen('videoMoments')}
                className={navButtonClass('videoMoments')}
              >
                Video Moments
              </button>
            </nav>

            {/* Actions Area */}
            <div className="flex items-center justify-end md:w-1/4 gap-2">
               <button
                onClick={() => setScreen('nightDebrief')}
                className="text-xs font-medium text-blue-200 bg-blue-500/10 border border-blue-400/20 px-4 py-1.5 rounded-full hover:bg-blue-500/20 transition-all shadow-sm"
              >
                Night Mode 🌙
              </button>
              <button
                onClick={handleResetAura}
                className="text-xs font-medium text-slate-500 hover:text-red-400 px-3 py-1.5 rounded-full border border-transparent hover:bg-red-500/5 hover:border-red-500/10 transition-all"
              >
                Reset
              </button>
              <button
                onClick={() => signOut()}
                className="text-xs font-medium text-slate-500 hover:text-white px-3 py-1.5 rounded-full border border-transparent hover:bg-white/5 transition-all"
              >
                Sign Out
              </button>
            </div>
          </header>
        )}

        {/* Header fallback for when no profile exists but logged in */}
        {!profile && (
          <header className="flex items-center justify-end py-2 shrink-0">
             <button
                onClick={() => signOut()}
                className="text-xs font-medium text-slate-500 hover:text-white px-3 py-1.5 rounded-full border border-transparent hover:bg-white/5 transition-all"
              >
                Sign Out
              </button>
          </header>
        )}

        {/* Main Content Area */}
        <main className="flex-1 relative overflow-hidden flex flex-col">
          {!profile || screen === 'onboarding' ? (
            <div className="flex-1 h-full overflow-hidden">
              <OnboardingScreen onComplete={handleOnboardingComplete} />
            </div>
          ) : screen === 'neural' ? (
            <div className="flex-1 h-full overflow-hidden">
               <NeuralLinkScreen 
                 profile={profile} 
                 history={chatHistory}
                 setHistory={setChatHistory}
                 auraState={auraState}
                 setAuraState={setAuraState}
               />
            </div>
          ) : screen === 'match' ? (
            <div className="flex-1 h-full overflow-y-auto custom-scrollbar">
              <MatchTestScreen profile={profile} />
            </div>
          ) : screen === 'twinTalk' ? (
            <div className="flex-1 h-full overflow-hidden">
              <TwinConversationScreen 
                profileA={profile} 
                profileB={SAMPLE_LINA_PROFILE} 
              />
            </div>
          ) : screen === 'videoMoments' ? (
             <div className="flex-1 h-full overflow-y-auto custom-scrollbar">
               <TwinVideoMomentsScreen profile={profile} />
             </div>
          ) : (
            /* Night Debrief Mode - Full Screen Immersive */
            <div className="absolute inset-0 z-50 bg-slate-950">
               <NightDebriefScreen 
                 profile={profile} 
                 onExit={() => setScreen('neural')} 
               />
            </div>
          )}
        </main>
      </div>
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

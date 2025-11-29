import React, { useState, useEffect } from 'react';
import { AuraProfile, AuraChatMessage, AuraState } from './types';
import OnboardingScreen from './screens/OnboardingScreen';
import NeuralLinkScreen from './screens/NeuralLinkScreen';
import MatchTestScreen from './screens/MatchTestScreen';
import TwinIntroScreen from './screens/TwinIntroScreen';
import ReplyLabScreen from './screens/ReplyLabScreen';
import { AuraStage } from './components/AuraStage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthScreen } from './screens/AuthScreen';
import { loadAuraProfile, persistAuraProfile } from './src/storage/profileStorage';

type ActiveTab = 'talk' | 'match' | 'intro' | 'reply';

const AppContent: React.FC = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('talk');
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
    setActiveTab('reply');
  };

  const handleProfileCreated = (newProfile: AuraProfile) => {
    if (user) {
      persistAuraProfile(newProfile, user.uid);
    }
    setProfile(newProfile);
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 animate-pulse" />
              <span className="text-lg font-light tracking-wide text-white">Aura Twin</span>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white bg-slate-800/50 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 rounded-full transition-all"
            >
              Sign Out
            </button>
          </div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-4" style={{ height: '100vh', maxHeight: '100vh' }}>
        
        <header className="flex items-center justify-between py-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 animate-pulse shadow-lg shadow-blue-500/30" />
            <span className="text-lg font-light tracking-wide text-white hidden sm:inline">Aura Twin</span>
          </div>

          <nav className="flex gap-1 bg-slate-900/80 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-lg">
            <button
              onClick={() => setActiveTab('talk')}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === 'talk' 
                  ? 'bg-white text-slate-900 shadow-lg' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Talk to Aura
            </button>
            <button
              onClick={() => setActiveTab('match')}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === 'match' 
                  ? 'bg-white text-slate-900 shadow-lg' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Match Score
            </button>
            <button
              onClick={() => setActiveTab('intro')}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === 'intro' 
                  ? 'bg-white text-slate-900 shadow-lg' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Twin Intro
            </button>
            <button
              onClick={() => setActiveTab('reply')}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === 'reply' 
                  ? 'bg-white text-slate-900 shadow-lg' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Reply Lab
            </button>
          </nav>

          <button
            onClick={handleSignOut}
            className="px-4 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800/50 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 rounded-full transition-all flex items-center gap-2"
          >
            <span className="hidden sm:inline">Sign Out</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </header>

        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">
          
          <div className="lg:col-span-5 hidden lg:block overflow-hidden">
            <div className="h-full rounded-3xl overflow-hidden">
              <AuraStage profile={profile} auraState={auraState} />
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden">
              
              {activeTab === 'talk' && (
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

              {activeTab === 'match' && (
                <div className="h-full overflow-y-auto p-4 lg:p-6">
                  <MatchTestScreen userProfile={profile} auraState={auraState} />
                </div>
              )}

              {activeTab === 'intro' && (
                <div className="h-full overflow-y-auto">
                  <TwinIntroScreen />
                </div>
              )}

              {activeTab === 'reply' && (
                <div className="h-full overflow-y-auto">
                  <ReplyLabScreen profile={profile} prefillText={replyLabPrefill} />
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 py-2 flex-shrink-0">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              <span className="font-mono tracking-widest uppercase">
                ● Connected · {profile.displayName}
              </span>
            </div>
          </div>
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

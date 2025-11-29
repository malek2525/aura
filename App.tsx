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
import { useAuraVoice } from './hooks/useAuraVoice';

type ActiveTab = 'link' | 'skills' | 'twins' | 'mirror';

const TAB_CONFIG: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
  {
    id: 'link',
    label: 'LINK',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  },
  {
    id: 'skills',
    label: 'SKILLS',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    id: 'twins',
    label: 'TWINS',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: 'mirror',
    label: 'MIRROR',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
];

const AppContent: React.FC = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('link');
  const [profile, setProfile] = useState<AuraProfile | null>(null);
  const [chatHistory, setChatHistory] = useState<AuraChatMessage[]>([]);
  const [auraState, setAuraState] = useState<AuraState>({
    mood: 'neutral',
    moodIntensity: 0.2
  });
  const [replyLabPrefill, setReplyLabPrefill] = useState<string | undefined>(undefined);

  const voice = useAuraVoice();

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
    setActiveTab('mirror');
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
          <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm tracking-wide">Initializing Aura...</p>
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
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-xs text-slate-400 hover:text-white bg-slate-900/60 hover:bg-red-500/20 backdrop-blur-xl border border-white/10 hover:border-red-500/30 rounded-full transition-all flex items-center gap-2"
          >
            <span>Sign Out</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-2xl p-6 lg:p-8">
            <OnboardingScreen onProfileCreated={handleProfileCreated} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100">
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-xs text-slate-400 hover:text-white bg-slate-900/60 hover:bg-red-500/20 backdrop-blur-xl border border-white/10 hover:border-red-500/30 rounded-full transition-all flex items-center gap-2 shadow-lg"
        >
          <span className="hidden sm:inline">Sign Out</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>

      <div className="h-full w-full flex flex-col lg:flex-row p-3 lg:p-4 gap-3 lg:gap-4">
        
        <div className="w-full lg:w-[58%] h-[35vh] lg:h-full flex-shrink-0 rounded-3xl overflow-hidden relative">
          <AuraStage 
            profile={profile} 
            auraState={auraState} 
            isSpeaking={voice.isSpeaking}
            isListening={voice.isListening}
          />
          
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950/60 backdrop-blur-md rounded-full border border-white/10">
              <div className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px] ${
                voice.isListening 
                  ? 'bg-red-400 shadow-red-400/60' 
                  : voice.isSpeaking 
                  ? 'bg-amber-400 shadow-amber-400/60' 
                  : 'bg-emerald-400 shadow-emerald-400/60'
              }`} />
              <span className="text-[10px] font-mono tracking-widest uppercase text-slate-300">
                {voice.isListening ? 'Listening' : voice.isSpeaking ? 'Speaking' : `${profile.displayName} · Online`}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 flex flex-col rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
          
          <div className="flex-shrink-0 p-3 border-b border-white/5">
            <div className="flex items-center gap-1 bg-slate-950/40 p-1 rounded-2xl">
              {TAB_CONFIG.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-br from-violet-600/80 to-blue-600/80 text-white shadow-lg shadow-violet-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-hidden">
            {activeTab === 'link' && (
              <div className="h-full">
                <NeuralLinkScreen 
                  profile={profile}
                  history={chatHistory}
                  setHistory={setChatHistory}
                  auraState={auraState}
                  setAuraState={setAuraState}
                  onOpenReplyLab={handleOpenReplyLab}
                  voice={voice}
                />
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="h-full overflow-y-auto p-4 lg:p-5">
                <MatchTestScreen userProfile={profile} auraState={auraState} />
              </div>
            )}

            {activeTab === 'twins' && (
              <div className="h-full overflow-y-auto">
                <TwinIntroScreen />
              </div>
            )}

            {activeTab === 'mirror' && (
              <div className="h-full overflow-y-auto">
                <ReplyLabScreen profile={profile} prefillText={replyLabPrefill} />
              </div>
            )}
          </div>

          <div className="flex-shrink-0 px-4 py-2 border-t border-white/5 bg-slate-950/30">
            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500">
              <div className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse shadow-[0_0_6px_rgba(139,92,246,0.8)]" />
              <span className="font-mono tracking-widest uppercase">
                Neural Link Active · {profile.displayName}
              </span>
            </div>
          </div>
        </div>
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

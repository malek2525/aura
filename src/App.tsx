import React, { useState, useEffect } from "react";

// ===== EXISTING IMPORTS (BACKEND LOGIC) =====
import { AuraProfile, AuraChatMessage, AuraState, ViewState, SubViewState, UserProfile, MatchGenderPreference } from "./types";
import OnboardingScreen from "./screens/OnboardingScreen";
import NeuralLinkScreen from "./screens/NeuralLinkScreen";
import EditProfileScreen from "./screens/EditProfileScreen";  // Working edit screen
import { AuthScreen } from "./screens/AuthScreen";
import { loadAuraProfile, persistAuraProfile } from "./storage/profileStorage";
import { useAuraVoice } from "./hooks/useAuraVoice";
import { AuthProvider, useAuth } from "./context/AuthContext";

// ===== NEW UI IMPORTS =====
import { Navigation } from "./components/Navigation";
import { Icons } from "./components/Icons";

// New Pages (fixed versions)
import { Aura as AuraPage } from "./pages/Aura";
import { Discover as DiscoverPage } from "./pages/Discover";
import { Profile as ProfilePage } from "./pages/Profile";
import { Likes } from "./pages/Likes";
import { Chat } from "./pages/Chat";
import { ChatDetail } from "./pages/ChatDetail";
import { Settings } from "./pages/Settings";
import { Filters } from "./pages/Filters";

// New Components
import { StoryViewer } from "./components/StoryViewer";
import { AuraSimulation } from "./components/AuraSimulation";
import { MatchOverlay } from "./components/MatchOverlay";

// Test profiles with fixed images
import { TEST_PROFILES, getProfileById } from "./data/testProfiles";

// Legacy Panels
import SkillsPanel from "./panels/SkillsPanel";
import TwinsPanel from "./panels/TwinsPanel";

// ===== HELPER FUNCTIONS =====
const getAgeFromDob = (dob?: string | null): number | null => {
  if (!dob) return null;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) {
    age--;
  }
  return age;
};

const getAgeFromProfile = (profile: AuraProfile): number | null => {
  const dob = profile.dating?.dateOfBirth || (profile as any).dateOfBirth || (profile as any).dob;
  return getAgeFromDob(dob);
};

// ===== CONVERT AuraProfile TO UserProfile FOR NEW UI =====
const auraProfileToUserProfile = (profile: AuraProfile): UserProfile => {
  const age = getAgeFromProfile(profile) || 25;
  const photos = profile.dating?.photos?.map((p) => p.url).filter(Boolean) ||
    profile.photoUrls || [];

  return {
    id: profile.id || profile.userId || "user",
    name: profile.dating?.displayName || profile.displayName || "User",
    age,
    bio: profile.dating?.bio || profile.aura?.summary || profile.summary || "",
    photos: photos.length > 0 ? photos : [],
    job: profile.dating?.lifestyle?.jobOrStudy || "",
    location: profile.dating?.city || profile.dating?.country || profile.country || "Earth",
    distance: 0,
    verified: photos.length > 0,
    auraRead: profile.aura?.summary || profile.summary || "Complete your profile to let Aura learn about you.",
    vibeTags: profile.aura?.vibeWords || profile.vibeWords || [],
    verificationScore: calculateVerificationScore(profile),
    verificationTier: getVerificationTier(calculateVerificationScore(profile)),
    stories: [],
    interests: profile.dating?.interests || profile.topicsLike || [],
    prompts: [],
    details: {
      height: "",
      exercise: "",
      education: "",
      drinking: profile.dating?.lifestyle?.drinking || "",
      smoking: profile.dating?.lifestyle?.smoking || "",
      lookingFor: profile.dating?.relationshipIntent || "",
      starSign: "",
      languages: [],
    },
  };
};

// Calculate verification score
const calculateVerificationScore = (profile: AuraProfile | null): number => {
  if (!profile) return 0;
  let score = 0;
  if (profile.displayName || profile.dating?.displayName) score += 10;
  if (profile.dating?.dateOfBirth) score += 10;
  if (profile.dating?.city || profile.dating?.country) score += 10;
  const photoCount = profile.dating?.photos?.length || profile.photoUrls?.length || 0;
  score += Math.min(photoCount * 5, 25);
  if (profile.dating?.bio || profile.aura?.summary) score += 10;
  if ((profile.dating?.interests?.length || 0) >= 3) score += 10;
  if (profile.aura?.vibeWords?.length) score += 10;
  if (profile.aura?.greenFlags?.length) score += 8;
  if (profile.aura?.whatFeelsSafe) score += 7;
  return Math.min(score, 100);
};

const getVerificationTier = (score: number): 'Bronze' | 'Silver' | 'Gold' | 'Platinum' => {
  if (score >= 81) return 'Platinum';
  if (score >= 61) return 'Gold';
  if (score >= 41) return 'Silver';
  return 'Bronze';
};

// ===== SAMPLE PROFILE FOR TWINS =====
const SAMPLE_LINA_PROFILE: AuraProfile = {
  id: "sample_lina",
  userId: "sample_lina_user",
  displayName: "Lina",
  aura: {
    introversionLevel: 6,
    goals: ["friends", "practice_talking"],
    vibeWords: ["thoughtful", "kind", "curious"],
    topicsLike: ["art", "music", "late-night walks"],
    topicsAvoid: ["politics"],
    socialSpeed: "slow",
    hardBoundaries: ["no explicit content"],
    greenFlags: ["honesty", "emotional maturity"],
    redFlags: ["ghosting"],
    whatFeelsSafe: "Slow pace, clear communication.",
    whatShouldPeopleKnow: "She warms up slowly but cares deeply.",
    summary: "Lina is a quiet, thoughtful person who loves deep conversations.",
  },
  dating: {
    displayName: "Lina",
    dateOfBirth: "2000-01-01",
    gender: "woman",
    orientation: "straight",
    country: "Germany",
    city: "Berlin",
    photos: [],
    bio: "Soft-spoken, art & music lover.",
    interests: ["art", "music"],
    lifestyle: { smoking: "no", drinking: "sometimes", kids: "prefer_not_say", sleepSchedule: "night_owl" },
    relationshipIntent: "open_to_see",
  },
  preferences: { preferredGenders: "any", minAge: 20, maxAge: 32 },
};

// ===== MAIN APP CONTENT =====
const AppContent: React.FC = () => {
  const { user, loading: authLoading, signOut } = useAuth();

  // ===== EXISTING STATE =====
  const [profile, setProfile] = useState<AuraProfile | null>(null);
  const [chatHistory, setChatHistory] = useState<AuraChatMessage[]>([]);
  const [auraState, setAuraState] = useState<AuraState>({ mood: "neutral", moodIntensity: 0.2 });
  const [replyLabPrefill, setReplyLabPrefill] = useState<string | undefined>(undefined);

  // Voice hook
  const voice = useAuraVoice();

  // ===== NEW UI STATE =====
  const [currentView, setCurrentView] = useState<ViewState>("aura");
  const [subView, setSubView] = useState<SubViewState>("main");
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | undefined>(undefined);
  const [matchedProfile, setMatchedProfile] = useState<UserProfile | null>(null);
  const [showLegacyScreen, setShowLegacyScreen] = useState<"neural" | "skills" | "twins" | null>(null);
  
  // Likes/matches state
  const [likedProfiles, setLikedProfiles] = useState<UserProfile[]>([]);
  const [matches, setMatches] = useState<UserProfile[]>([]);

  // ===== LOAD PROFILE ON AUTH =====
  useEffect(() => {
    if (user) {
      const saved = loadAuraProfile(user.uid);
      if (saved) {
        setProfile(saved);
        if (chatHistory.length === 0) {
          setChatHistory([{
            id: "init",
            from: "aura",
            text: `Hello ${saved.displayName}. I am your Aura. Welcome back.`,
            timestamp: Date.now(),
          }]);
        }
        setAuraState({ mood: "calm", moodIntensity: 0.5 });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // ===== HANDLERS =====
  const handleOpenReplyLab = (prefillText?: string) => {
    setReplyLabPrefill(prefillText);
    setShowLegacyScreen("neural");
  };

  const handleProfileCreated = (newProfile: AuraProfile) => {
    if (user) {
      persistAuraProfile(newProfile, user.uid);
    }
    const primaryVibe = newProfile.aura?.vibeWords?.[0] || newProfile.vibeWords?.[0] || "connected";
    setProfile(newProfile);
    setChatHistory([{
      id: "init",
      from: "aura",
      text: `Hello ${newProfile.displayName}. I am your Aura. I feel... ${primaryVibe}. I'm here for you.`,
      timestamp: Date.now(),
    }]);
    setAuraState({ mood: "calm", moodIntensity: 0.5 });
  };

  const handleProfileUpdated = (updated: AuraProfile) => {
    setProfile(updated);
    if (user) {
      persistAuraProfile(updated, user.uid);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setProfile(null);
    setChatHistory([]);
  };

  // ===== NEW UI HANDLERS =====
  const handleNavChange = (view: ViewState) => {
    setCurrentView(view);
    setSubView("main");
    setShowLegacyScreen(null);
    window.scrollTo(0, 0);
  };

  const handleViewProfile = (userProfile: UserProfile) => {
    setSelectedProfile(userProfile);
    setSubView("view-profile");
  };

  const handlePreviewProfile = () => {
    if (profile) {
      setSelectedProfile(auraProfileToUserProfile(profile));
    }
    setSubView("view-profile");
  };

  const handleViewStory = (userProfile: UserProfile) => {
    setSelectedProfile(userProfile);
    setSubView("story-viewer");
  };

  const handleStartAuraChat = (userProfile: UserProfile) => {
    setSelectedProfile(userProfile);
    setSubView("aura-simulation");
  };

  const handleCloseSubView = () => {
    setSubView("main");
    setShowLegacyScreen(null);
  };

  const handleLike = (userProfile: UserProfile) => {
    // Add to likes
    setLikedProfiles(prev => [...prev.filter(p => p.id !== userProfile.id), userProfile]);
    
    // 50% chance of match for demo
    if (Math.random() > 0.5) {
      setMatchedProfile(userProfile);
      setMatches(prev => [...prev.filter(p => p.id !== userProfile.id), userProfile]);
    }
  };

  const handlePass = () => {
    if (subView === "view-profile") handleCloseSubView();
  };

  const handleChatSelect = (matchId: string) => {
    // Find profile from test profiles or matches
    const foundProfile = getProfileById(matchId) || matches.find(m => m.id === matchId);
    if (foundProfile) {
      setSelectedProfile(foundProfile);
      setSubView("chat-detail");
    }
  };

  const handleSavePreferences = (prefs: {
    preferredGenders: MatchGenderPreference;
    minAge: number;
    maxAge: number;
  }) => {
    if (profile) {
      const updated: AuraProfile = {
        ...profile,
        preferences: {
          ...profile.preferences,
          preferredGenders: prefs.preferredGenders,
          minAge: prefs.minAge,
          maxAge: prefs.maxAge,
        },
      };
      handleProfileUpdated(updated);
    }
  };

  // ===== AUTH LOADING STATE =====
  if (authLoading) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-coral border-t-transparent rounded-full animate-spin" />
          <p className="text-text-sec text-sm tracking-wide">Initializing Aura...</p>
        </div>
      </div>
    );
  }

  // ===== NOT LOGGED IN =====
  if (!user) {
    return <AuthScreen />;
  }

  // ===== ONBOARDING (NO PROFILE YET) =====
  if (!profile) {
    return (
      <div className="min-h-screen bg-warm-white text-text-main">
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-xs text-text-sec hover:text-coral bg-white border border-warm-gray rounded-full transition-all"
          >
            Sign Out
          </button>
        </div>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="rounded-3xl bg-white border border-warm-gray shadow-soft p-6">
            <OnboardingScreen userId={user.uid} onProfileCreated={handleProfileCreated} />
          </div>
        </div>
      </div>
    );
  }

  // ===== LEGACY SCREENS (Skills, Twins, Neural Link) =====
  if (showLegacyScreen) {
    return (
      <div className="min-h-screen bg-warm-white text-text-main">
        <div className="max-w-3xl mx-auto px-4 py-4 flex flex-col gap-4">
          <header className="flex items-center justify-between rounded-2xl bg-white border border-warm-gray px-4 py-3 shadow-soft">
            <button
              onClick={() => setShowLegacyScreen(null)}
              className="flex items-center gap-2 text-sm text-text-sec hover:text-coral"
            >
              <Icons.ChevronLeft size={20} />
              Back to Aura
            </button>
            <span className="text-xs uppercase tracking-wider text-text-muted">
              {showLegacyScreen === "neural" ? "Neural Link" : showLegacyScreen === "skills" ? "Skills" : "Twins"}
            </span>
            <div className="w-20" />
          </header>

          <div className="rounded-3xl bg-white border border-warm-gray shadow-soft overflow-hidden min-h-[70vh]">
            {showLegacyScreen === "neural" && (
              <NeuralLinkScreen
                profile={profile}
                history={chatHistory}
                setHistory={setChatHistory}
                auraState={auraState}
                setAuraState={setAuraState}
                voice={voice}
              />
            )}
            {showLegacyScreen === "skills" && <SkillsPanel profile={profile} />}
            {showLegacyScreen === "twins" && (
              <TwinsPanel profile={profile} sampleProfile={SAMPLE_LINA_PROFILE} />
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===== EDIT PROFILE (uses working EditProfileScreen) =====
  if (subView === "edit-profile") {
    return (
      <div className="min-h-screen w-full bg-warm-white text-text-main">
        <div className="max-w-3xl mx-auto px-4 py-4 flex flex-col gap-4">
          <header className="flex items-center justify-between rounded-2xl bg-white border border-warm-gray px-4 py-3 shadow-soft">
            <button
              onClick={handleCloseSubView}
              className="flex items-center gap-2 text-sm text-text-sec hover:text-coral"
            >
              <Icons.ChevronLeft size={20} />
              Back
            </button>
            <span className="text-xs uppercase tracking-wider text-text-muted">Edit Profile</span>
            <div className="w-20" />
          </header>

          <EditProfileScreen
            profile={profile}
            onCancel={handleCloseSubView}
            onProfileUpdated={(updated) => {
              handleProfileUpdated(updated);
              handleCloseSubView();
            }}
          />
        </div>
      </div>
    );
  }

  // ===== GET USER DATA FOR NEW UI =====
  const currentUserProfile = auraProfileToUserProfile(profile);
  const displayName = profile.dating?.displayName || profile.displayName || "User";
  const primaryPhotoUrl =
    profile.dating?.photos?.find((p) => p.isPrimary)?.url ||
    profile.dating?.photos?.[0]?.url ||
    profile.avatarUrl ||
    (profile.photoUrls && profile.photoUrls[0]) ||
    "";

  // ===== MAIN APP RENDER =====
  const renderMainContent = () => {
    switch (currentView) {
      case "aura":
        return (
          <AuraPage
            profile={profile}
            onEditProfile={() => setSubView("edit-profile")}
            onSettings={() => setSubView("settings")}
            onPreviewProfile={handlePreviewProfile}
            onTalkToAura={() => setShowLegacyScreen("neural")}
          />
        );
      case "discover":
        return (
          <DiscoverPage
            onOpenFilters={() => setSubView("filters")}
            onViewProfile={handleViewProfile}
            onViewStory={handleViewStory}
            onStartAuraChat={handleStartAuraChat}
            onLike={handleLike}
            onPass={handlePass}
            userPhoto={primaryPhotoUrl}
          />
        );
      case "likes":
        return <Likes onViewMatch={handleChatSelect} />;
      case "chat":
        return <Chat onChatSelect={handleChatSelect} />;
      default:
        return (
          <AuraPage
            profile={profile}
            onEditProfile={() => setSubView("edit-profile")}
            onSettings={() => setSubView("settings")}
            onPreviewProfile={handlePreviewProfile}
            onTalkToAura={() => setShowLegacyScreen("neural")}
          />
        );
    }
  };

  // Overlay wrapper
  const Overlay = ({ children }: { children: React.ReactNode }) => (
    <div className="absolute inset-0 z-40 bg-white flex flex-col animate-slide-up">
      {children}
    </div>
  );

  return (
    <div className="w-full h-screen bg-white text-text-main font-sans flex flex-col mx-auto max-w-md relative shadow-2xl overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 overflow-hidden h-full relative z-0">
        {renderMainContent()}
      </main>

      {/* Settings Overlay */}
      {subView === "settings" && (
        <Overlay>
          <Settings
            profile={profile}
            onBack={handleCloseSubView}
            onLogout={handleSignOut}
            onSavePreferences={handleSavePreferences}
          />
        </Overlay>
      )}

      {/* Filters Overlay */}
      {subView === "filters" && (
        <Overlay>
          <Filters onClose={handleCloseSubView} />
        </Overlay>
      )}

      {/* View Profile Overlay */}
      {subView === "view-profile" && (
        <Overlay>
          <ProfilePage
            user={selectedProfile || currentUserProfile}
            onBack={handleCloseSubView}
            onLike={() => {
              if (selectedProfile) {
                handleLike(selectedProfile);
              }
            }}
            onPass={handleCloseSubView}
            onSuperLike={() => {
              if (selectedProfile) {
                setMatchedProfile(selectedProfile);
              }
            }}
            isOwnProfile={!selectedProfile || selectedProfile.id === currentUserProfile.id}
          />
        </Overlay>
      )}

      {/* Chat Detail Overlay */}
      {subView === "chat-detail" && selectedProfile && (
        <Overlay>
          <ChatDetail
            match={selectedProfile}
            onBack={handleCloseSubView}
            onViewProfile={() => setSubView("view-profile")}
          />
        </Overlay>
      )}

      {/* Story Viewer */}
      {subView === "story-viewer" && selectedProfile && (
        <StoryViewer user={selectedProfile} onClose={handleCloseSubView} />
      )}

      {/* Aura Simulation */}
      {subView === "aura-simulation" && selectedProfile && (
        <AuraSimulation
          myProfileName={displayName}
          theirProfile={selectedProfile}
          onClose={handleCloseSubView}
          onMatch={() => {
            setMatchedProfile(selectedProfile);
            handleCloseSubView();
          }}
        />
      )}

      {/* Match Overlay */}
      {matchedProfile && (
        <MatchOverlay
          matchedProfile={matchedProfile}
          myPhoto={primaryPhotoUrl}
          onClose={() => setMatchedProfile(null)}
          onChat={() => {
            setMatchedProfile(null);
            if (subView === "view-profile") handleCloseSubView();
            handleChatSelect(matchedProfile.id);
          }}
        />
      )}

      {/* Bottom Navigation */}
      {subView === "main" && !showLegacyScreen && (
        <Navigation 
          currentView={currentView} 
          onChange={handleNavChange}
          unreadLikes={likedProfiles.length}
          unreadChats={matches.length}
        />
      )}
    </div>
  );
};

// ===== APP WRAPPER =====
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;

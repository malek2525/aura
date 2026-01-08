import React, { useState, useEffect } from "react";

// ===== EXISTING IMPORTS (KEEP ALL YOUR BACKEND LOGIC) =====
import { AuraProfile, AuraChatMessage, AuraState } from "./types";
import OnboardingScreen from "./screens/OnboardingScreen";
import NeuralLinkScreen from "./screens/NeuralLinkScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import DiscoverScreen from "./screens/DiscoverScreen";
import MatchesScreen from "./screens/MatchesScreen";
import { AuthScreen } from "./screens/AuthScreen";
import { loadAuraProfile, persistAuraProfile } from "./storage/profileStorage";
import { useAuraVoice } from "./hooks/useAuraVoice";

import { AuthProvider, useAuth } from "./context/AuthContext";

// ===== NEW UI IMPORTS =====
import { Navigation } from "./components/Navigation";
import { ViewState, SubViewState, UserProfile } from "./types";
import { Icons } from "./components/Icons";

// New Pages
import { Aura as AuraPage } from "./pages/Aura";
import { Discover as DiscoverPage } from "./pages/Discover";
import { Profile as ProfilePage } from "./pages/Profile";
import { Likes } from "./pages/Likes";
import { Chat } from "./pages/Chat";
import { ChatDetail } from "./pages/ChatDetail";
import { EditProfile as EditProfilePage } from "./pages/EditProfile";
import { Settings } from "./pages/Settings";
import { Filters } from "./pages/Filters";

// New Components
import { StoryViewer } from "./components/StoryViewer";
import { AuraSimulation } from "./components/AuraSimulation";
import { MatchOverlay } from "./components/MatchOverlay";

// Legacy Panels
import SkillsPanel from "./panels/SkillsPanel";
import TwinsPanel from "./panels/TwinsPanel";

// ===== EXISTING HELPER FUNCTIONS (UNCHANGED) =====
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
  const dob =
    profile.dating?.dateOfBirth ||
    (profile as any).dateOfBirth ||
    (profile as any).dob;
  return getAgeFromDob(dob);
};

// ===== SAMPLE PROFILE FOR TWINS (UNCHANGED) =====
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
    hardBoundaries: ["no explicit content", "no heavy drama"],
    greenFlags: ["honesty", "emotional maturity"],
    redFlags: ["ghosting", "mocking others"],
    whatFeelsSafe: "Slow pace, clear communication, no pressure.",
    whatShouldPeopleKnow:
      "She warms up slowly but cares deeply once she feels safe.",
    summary:
      "Lina is a quiet, thoughtful person who loves deep conversations and gentle people.",
  },
  dating: {
    displayName: "Lina",
    dateOfBirth: "2000-01-01",
    gender: "woman",
    orientation: "straight",
    country: "Germany",
    city: "Berlin",
    photos: [],
    bio: "Soft-spoken, art & music lover who prefers slow, genuine connections.",
    favoriteQuote: undefined,
    musicTaste: "Indie, lo-fi, movie scores",
    interests: ["art", "music", "late-night walks"],
    idealFirstMessage:
      "Ask about her current favourite song or artwork, not just 'hey'.",
    idealFirstMeeting: "Quiet cafe, museum or late walk by the river.",
    lifestyle: {
      smoking: "no",
      drinking: "sometimes",
      kids: "prefer_not_say",
      pets: ["cat"],
      sleepSchedule: "night_owl",
      jobOrStudy: "Design student",
    },
    relationshipIntent: "open_to_see",
  },
  preferences: {
    preferredGenders: "any",
    minAge: 20,
    maxAge: 32,
    relationshipIntent: "open_to_see",
  },
  avatarUrl: undefined,
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
  whatFeelsSafe: "Slow pace, clear communication, no pressure.",
  whatShouldPeopleKnow:
    "She warms up slowly but cares deeply once she feels safe.",
  summary:
    "Lina is a quiet, thoughtful person who loves deep conversations and gentle people.",
  photoUrls: [],
  photos: [],
  relationshipIntent: "open_to_see",
  preferredMatchGender: "any",
};

// ===== CONVERT AuraProfile TO UserProfile FOR NEW UI =====
const auraProfileToUserProfile = (profile: AuraProfile): UserProfile => {
  const age = getAgeFromProfile(profile) || 25;
  const photos = profile.dating?.photos?.map((p) => p.url).filter(Boolean) ||
    profile.photoUrls || ["https://picsum.photos/400/600?random=100"];

  return {
    id: profile.id || profile.userId || "user",
    name: profile.dating?.displayName || profile.displayName || "User",
    age,
    bio: profile.dating?.bio || profile.aura?.summary || profile.summary || "",
    photos:
      photos.length > 0 ? photos : ["https://picsum.photos/400/600?random=100"],
    job: profile.dating?.lifestyle?.jobOrStudy || "",
    location:
      profile.dating?.city ||
      profile.dating?.country ||
      profile.country ||
      "Earth",
    distance: 0,
    verified: true,
    auraRead:
      profile.aura?.summary ||
      profile.summary ||
      "You're a thoughtful person who values authentic connections.",
    vibeTags: profile.aura?.vibeWords ||
      profile.vibeWords || ["Thoughtful", "Calm"],
    verificationScore: 67,
    verificationTier: "Gold",
    stories: [],
    interests: profile.dating?.interests || profile.topicsLike || [],
    prompts: [],
    details: {
      height: "",
      exercise: "",
      education: "",
      drinking: profile.dating?.lifestyle?.drinking || "Socially",
      smoking: profile.dating?.lifestyle?.smoking || "No",
      lookingFor: profile.dating?.relationshipIntent || "Relationship",
      starSign: "",
      languages: [],
    },
  };
};

// ===== MAIN APP CONTENT =====
const AppContent: React.FC = () => {
  const { user, loading: authLoading, signOut } = useAuth();

  // ===== EXISTING STATE (UNCHANGED) =====
  const [profile, setProfile] = useState<AuraProfile | null>(null);
  const [chatHistory, setChatHistory] = useState<AuraChatMessage[]>([]);
  const [auraState, setAuraState] = useState<AuraState>({
    mood: "neutral",
    moodIntensity: 0.2,
  });
  const [replyLabPrefill, setReplyLabPrefill] = useState<string | undefined>(
    undefined,
  );

  // Voice hook
  const voice = useAuraVoice();

  // ===== NEW UI STATE =====
  const [currentView, setCurrentView] = useState<ViewState>("aura");
  const [subView, setSubView] = useState<SubViewState>("main");
  const [selectedProfile, setSelectedProfile] = useState<
    UserProfile | undefined
  >(undefined);
  const [matchedProfile, setMatchedProfile] = useState<UserProfile | null>(
    null,
  );

  // Legacy screens access
  const [showLegacyScreen, setShowLegacyScreen] = useState<
    "neural" | "skills" | "twins" | null
  >(null);

  // ===== EXISTING EFFECTS (UNCHANGED) =====
  useEffect(() => {
    if (user) {
      const saved = loadAuraProfile(user.uid);
      if (saved) {
        setProfile(saved);
        if (chatHistory.length === 0) {
          setChatHistory([
            {
              id: "init",
              from: "aura",
              text: `Hello ${saved.displayName}. I am your Aura. Welcome back.`,
              timestamp: Date.now(),
            },
          ]);
        }
        setAuraState({ mood: "calm", moodIntensity: 0.5 });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // ===== EXISTING HANDLERS (UNCHANGED) =====
  const handleOpenReplyLab = (prefillText?: string) => {
    setReplyLabPrefill(prefillText);
    setShowLegacyScreen("neural");
  };

  const handleProfileCreated = (newProfile: AuraProfile) => {
    if (user) {
      persistAuraProfile(newProfile, user.uid);
    }

    const primaryVibe =
      newProfile.aura?.vibeWords?.[0] ||
      newProfile.vibeWords?.[0] ||
      "connected";

    setProfile(newProfile);
    setChatHistory([
      {
        id: "init",
        from: "aura",
        text: `Hello ${newProfile.displayName}. I am your Aura. I've analyzed your profile, and I feel... ${primaryVibe}. I'm here for you.`,
        timestamp: Date.now(),
      },
    ]);
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
    setMatchedProfile(userProfile);
  };

  const handlePass = () => {
    if (subView === "view-profile") handleCloseSubView();
  };

  const handleChatSelect = (matchId: string) => {
    // Create dummy match for now - integrate with your matchService later
    const dummyMatch: UserProfile = {
      id: matchId,
      name: "Julia",
      age: 26,
      photos: ["https://picsum.photos/400/600?random=61"],
      interests: ["Gaming", "Coffee"],
      verified: true,
      bio: "",
      job: "",
      location: "Budapest",
      distance: 3,
      auraRead: "Julia is a warm and creative soul.",
      vibeTags: ["Creative", "Warm"],
      verificationScore: 80,
      verificationTier: "Gold",
      stories: [],
      prompts: [],
      details: {
        height: "168cm",
        exercise: "Active",
        education: "BA",
        drinking: "Socially",
        smoking: "No",
        lookingFor: "Relationship",
        starSign: "Pisces",
        languages: ["English"],
      },
    };
    setSelectedProfile(dummyMatch);
    setSubView("chat-detail");
  };

  // ===== AUTH LOADING STATE =====
  if (authLoading) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-coral border-t-transparent rounded-full animate-spin" />
          <p className="text-text-sec text-sm tracking-wide">
            Initializing Aura...
          </p>
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
            className="px-4 py-2 text-xs text-text-sec hover:text-coral bg-white border border-warm-gray rounded-full transition-all flex items-center gap-2"
          >
            <span>Sign Out</span>
          </button>
        </div>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="rounded-3xl bg-white border border-warm-gray shadow-soft p-6 lg:p-8">
            <OnboardingScreen
              userId={user.uid}
              onProfileCreated={handleProfileCreated}
            />
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
              {showLegacyScreen === "neural"
                ? "Neural Link"
                : showLegacyScreen === "skills"
                  ? "Skills"
                  : "Twins"}
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
              <TwinsPanel
                profile={profile}
                sampleProfile={SAMPLE_LINA_PROFILE}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===== FULL-SCREEN EDIT PROFILE (LEGACY) =====
  if (subView === "edit-profile-legacy") {
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
            <span className="text-xs uppercase tracking-wider text-text-muted">
              Edit Profile
            </span>
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
  const displayName =
    profile.dating?.displayName || profile.displayName || "User";
  const primaryPhotoUrl =
    profile.dating?.photos?.find((p) => p.isPrimary)?.url ||
    profile.dating?.photos?.[0]?.url ||
    profile.avatarUrl ||
    (profile.photoUrls && profile.photoUrls[0]) ||
    "";

  // ===== MAIN APP RENDER (NEW BUMBLE-STYLE UI) =====
  const renderMainContent = () => {
    switch (currentView) {
      case "aura":
        return (
          <AuraPage
            userName={displayName}
            userPhoto={
              primaryPhotoUrl || "https://picsum.photos/200/200?random=100"
            }
            verificationScore={67}
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
          />
        );
      case "likes":
        return <Likes onViewMatch={handleChatSelect} />;
      case "chat":
        return <Chat onChatSelect={handleChatSelect} />;
      default:
        return (
          <AuraPage
            userName={displayName}
            userPhoto={
              primaryPhotoUrl || "https://picsum.photos/200/200?random=100"
            }
            verificationScore={67}
            onEditProfile={() => setSubView("edit-profile")}
            onSettings={() => setSubView("settings")}
            onPreviewProfile={handlePreviewProfile}
            onTalkToAura={() => setShowLegacyScreen("neural")}
          />
        );
    }
  };

  // Overlay wrapper for sub-views
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

      {/* Sub-view Overlays */}
      {subView === "edit-profile" && (
        <Overlay>
          <EditProfilePage onBack={handleCloseSubView} />
        </Overlay>
      )}

      {subView === "settings" && (
        <Overlay>
          <Settings onBack={handleCloseSubView} onLogout={handleSignOut} />
        </Overlay>
      )}

      {subView === "filters" && (
        <Overlay>
          <Filters onClose={handleCloseSubView} />
        </Overlay>
      )}

      {subView === "view-profile" && (
        <Overlay>
          <ProfilePage
            user={selectedProfile || currentUserProfile}
            onBack={handleCloseSubView}
            onLike={() => {
              if (selectedProfile) setMatchedProfile(selectedProfile);
            }}
            onPass={handleCloseSubView}
            onSuperLike={() => {
              if (selectedProfile) setMatchedProfile(selectedProfile);
            }}
            isOwnProfile={
              !selectedProfile || selectedProfile.id === currentUserProfile.id
            }
          />
        </Overlay>
      )}

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
          myPhoto={
            primaryPhotoUrl || "https://picsum.photos/200/200?random=100"
          }
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
        <Navigation currentView={currentView} onChange={handleNavChange} />
      )}
    </div>
  );
};

// ===== APP WRAPPER WITH AUTH PROVIDER (UNCHANGED) =====
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;

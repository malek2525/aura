import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { Navigation } from "./src/components/Navigation";
import { ViewState, SubViewState, UserProfile } from "./src/types";
import { loadAuraProfile, persistAuraProfile } from "./src/storage/profileStorage";
import { Icons } from "./src/components/Icons";

// Pages
import { Auth } from "./src/pages/Auth";
import { Onboarding } from "./src/pages/Onboarding";
import { Aura } from "./src/pages/Aura";
import { Discover } from "./src/pages/Discover";
import { Profile } from "./src/pages/Profile";
import { Likes } from "./src/pages/Likes";
import { Chat } from "./src/pages/Chat";
import { ChatDetail } from "./src/pages/ChatDetail";

// Sub-Pages / Modals
import { EditProfile } from "./src/pages/EditProfile";
import { Settings } from "./src/pages/Settings";
import { Filters } from "./src/pages/Filters";
import { AppIcons } from "./src/pages/AppIcons";
import { CodeMerger } from "./src/pages/CodeMerger";

// Components
import { StoryViewer } from "./src/components/StoryViewer";
import { AuraSimulation } from "./src/components/AuraSimulation";
import { MatchOverlay } from "./src/components/MatchOverlay";

const AppContent: React.FC = () => {
  const { user, loading: authLoading, signOut, mockLogin } = useAuth();

  // Navigation State
  const [currentView, setCurrentView] = useState<ViewState>("aura");
  const [subView, setSubView] = useState<SubViewState>("main");

  // Data State
  const [myProfile, setMyProfile] = useState<UserProfile | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<
    UserProfile | undefined
  >(undefined);
  const [matchedProfile, setMatchedProfile] = useState<UserProfile | null>(
    null,
  );

  // Load profile on auth state change
  useEffect(() => {
    if (user) {
      const loaded = loadAuraProfile(user.uid);
      if (loaded) {
        setMyProfile(loaded);
        // Default to Aura view on load if profile exists
        if (currentView === "auth" || currentView === "onboarding") {
          setCurrentView("aura");
        }
      }
    } else {
      setMyProfile(null);
    }
  }, [user]);

  // --- Handlers ---

  const handleLogin = () => {
    // AuthContext handles the actual login logic
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    if (user) {
      const finalProfile = { ...profile, id: user.uid, userId: user.uid };
      setMyProfile(finalProfile);
      persistAuraProfile(finalProfile, user.uid);
      setCurrentView("aura");
    }
  };

  const handleNavChange = (view: ViewState) => {
    setCurrentView(view);
    setSubView("main");
    window.scrollTo(0, 0);
  };

  const handleViewProfile = (profile: UserProfile) => {
    setSelectedProfile(profile);
    setSubView("view-profile");
  };

  const handlePreviewProfile = () => {
    setSelectedProfile(myProfile || undefined);
    setSubView("view-profile");
  };

  const handleViewStory = (profile: UserProfile) => {
    setSelectedProfile(profile);
    setSubView("story-viewer");
  };

  const handleStartAuraChat = (profile: UserProfile) => {
    setSelectedProfile(profile);
    setSubView("aura-simulation");
  };

  const handleCloseSubView = () => {
    setSubView("main");
  };

  const handleChatSelect = (matchId: string) => {
    // Mock match data for chat detail view if not found in state
    const dummyMatch: UserProfile = {
      id: matchId,
      name: "Julia",
      age: 26,
      photos: ["https://picsum.photos/400/600?random=61"],
      interests: ["Gaming", "Coffee"],
      verified: true,
      bio: "Love cozy cafes.",
      job: "Designer",
      location: "Budapest",
      distance: 3,
      auraRead: "Creative soul",
      vibeTags: ["Creative"],
      verificationScore: 80,
      verificationTier: "Gold",
      stories: [],
      prompts: [],
      details: {
        height: "165cm",
        exercise: "Yoga",
        education: "BA",
        drinking: "No",
        smoking: "No",
        lookingFor: "Relationship",
        starSign: "Pisces",
        languages: ["English"],
      },
    };
    setSelectedProfile(dummyMatch);
    setSubView("chat-detail");
  };

  // --- Render Logic ---

  if (authLoading) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center flex-col gap-4">
        <Icons.Loader2 className="animate-spin text-coral" size={32} />
        <p className="text-sm text-text-muted font-bold tracking-wide">
          INITIALIZING AURA...
        </p>
      </div>
    );
  }

  // 1. Auth Flow
  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  // 2. Onboarding Flow (if no profile found)
  if (!myProfile) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // 3. Main App Flow
  const renderMainContent = () => {
    switch (currentView) {
      case "aura":
        return (
          <Aura
            onEditProfile={() => setSubView("edit-profile")}
            onSettings={() => setSubView("settings")}
            onPreviewProfile={handlePreviewProfile}
          />
        );
      case "discover":
        return (
          <Discover
            onOpenFilters={() => setSubView("filters")}
            onViewProfile={handleViewProfile}
            onViewStory={handleViewStory}
            onStartAuraChat={handleStartAuraChat}
            onLike={() => {
              // Demo match logic
              const demoMatch = {
                id: "demo_petra",
                name: "Petra",
                age: 28,
                photos: ["https://picsum.photos/400/600?random=1"],
                interests: ["Gaming"],
                verified: true,
                bio: "Gamer girl.",
                job: "Dev",
                location: "Berlin",
                distance: 12,
                auraRead: "Intense but fun",
                vibeTags: ["Energetic"],
                verificationScore: 90,
                verificationTier: "Platinum" as const,
                stories: [],
                prompts: [],
                details: {
                  height: "170cm",
                  exercise: "Gym",
                  education: "MSc",
                  drinking: "Socially",
                  smoking: "No",
                  lookingFor: "Relationship",
                  starSign: "Aries",
                  languages: ["German"],
                },
              };
              setMatchedProfile(demoMatch);
            }}
            onPass={() => {}}
          />
        );
      case "likes":
        return <Likes />;
      case "chat":
        return <Chat onChatSelect={handleChatSelect} />;
      default:
        return (
          <Aura
            onEditProfile={() => setSubView("edit-profile")}
            onSettings={() => setSubView("settings")}
            onPreviewProfile={handlePreviewProfile}
          />
        );
    }
  };

  const Overlay = ({ children }: { children: React.ReactNode }) => (
    <div className="absolute inset-0 z-40 bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
      {children}
    </div>
  );

  return (
    <div className="w-full h-screen bg-warm-white text-text-main font-sans flex flex-col mx-auto max-w-md relative shadow-2xl overflow-hidden border-x border-warm-gray/50">
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden h-full relative z-0">
        {renderMainContent()}
      </main>

      {/* Subviews & Modals */}
      {subView === "edit-profile" && (
        <Overlay>
          <EditProfile onBack={handleCloseSubView} currentUser={myProfile} />
        </Overlay>
      )}
      {subView === "settings" && (
        <Overlay>
          <Settings
            onBack={handleCloseSubView}
            onOpenIcons={() => setSubView("app-icons")}
            onOpenCodeMerger={() => setSubView("code-merger")}
          />
        </Overlay>
      )}
      {subView === "app-icons" && (
        <Overlay>
          <AppIcons onBack={() => setSubView("settings")} />
        </Overlay>
      )}
      {subView === "code-merger" && (
        <Overlay>
          <CodeMerger onBack={() => setSubView("settings")} />
        </Overlay>
      )}
      {subView === "filters" && (
        <Overlay>
          <Filters onClose={handleCloseSubView} />
        </Overlay>
      )}
      {subView === "view-profile" && (
        <Overlay>
          <Profile
            user={selectedProfile}
            onBack={handleCloseSubView}
            onLike={() => {
              if (selectedProfile) setMatchedProfile(selectedProfile);
            }}
            onPass={handleCloseSubView}
            onSuperLike={() => {
              if (selectedProfile) setMatchedProfile(selectedProfile);
            }}
          />
        </Overlay>
      )}
      {subView === "chat-detail" && selectedProfile && (
        <Overlay>
          <ChatDetail match={selectedProfile} onBack={handleCloseSubView} />
        </Overlay>
      )}

      {/* Floating Story Viewer */}
      {subView === "story-viewer" && selectedProfile && (
        <StoryViewer user={selectedProfile} onClose={handleCloseSubView} />
      )}

      {/* Aura Simulation Overlay */}
      {subView === "aura-simulation" && selectedProfile && (
        <AuraSimulation
          myProfileName={myProfile?.name || "Me"}
          theirProfile={selectedProfile}
          onClose={handleCloseSubView}
          onMatch={() => {
            setMatchedProfile(selectedProfile);
            handleCloseSubView();
          }}
        />
      )}

      {/* Match Success Overlay */}
      {matchedProfile && (
        <MatchOverlay
          matchedProfile={matchedProfile}
          onClose={() => setMatchedProfile(null)}
          onChat={() => {
            setMatchedProfile(null);
            if (subView === "view-profile") handleCloseSubView();
            handleChatSelect(matchedProfile.id);
          }}
        />
      )}

      {/* Main Bottom Navigation */}
      {subView === "main" && (
        <Navigation currentView={currentView} onChange={handleNavChange} />
      )}
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

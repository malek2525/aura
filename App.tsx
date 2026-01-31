import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Navigation } from "@/components/Navigation";
import { ViewState, SubViewState, UserProfile, Story } from "@/types";
import { loadAuraProfile, persistAuraProfile } from "@/storage/profileStorage";
import { Icons } from "@/components/Icons";
import {
  getProfileById,
  triggerBackgroundAuraMatch,
} from "@/services/matchService";

// Pages
import { Auth } from "@/pages/Auth";
import { Onboarding } from "@/pages/Onboarding";
import { Aura } from "@/pages/Aura";
import { Discover } from "@/pages/Discover";
import { Profile } from "@/pages/Profile";
import { Likes } from "@/pages/Likes";
import { Chat } from "@/pages/Chat";
import { ChatDetail } from "@/pages/ChatDetail";
import { Moments } from "@/pages/Moments";

// Sub-Pages / Modals
import { EditProfile } from "@/pages/EditProfile";
import { Settings } from "@/pages/Settings";
import { Filters } from "@/pages/Filters";
import { AppIcons } from "@/pages/AppIcons";
import { CodeMerger } from "@/pages/CodeMerger";

// Components
import { StoryViewer } from "@/components/StoryViewer";
import { AuraSimulation } from "@/components/AuraSimulation";
import { MatchOverlay } from "@/components/MatchOverlay";

const Overlay: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="absolute inset-0 z-[60] bg-white flex flex-col animate-in slide-in-from-bottom duration-300 overflow-hidden">
    {children}
  </div>
);

const AppContent: React.FC = () => {
  const { user, loading: authLoading } = useAuth();

  // Navigation State
  const [currentView, setCurrentView] = useState<ViewState>("aura");
  const [subView, setSubView] = useState<SubViewState>("main");
  const [notification, setNotification] = useState<string | null>(null);

  // Data State
  const [myProfile, setMyProfile] = useState<UserProfile | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<
    UserProfile | undefined
  >(undefined);
  const [matchedProfile, setMatchedProfile] = useState<UserProfile | null>(
    null,
  );
  const [profileLoading, setProfileLoading] = useState(true);

  // Track if we've attempted to load profile (prevents infinite loop)
  const [profileLoadAttempted, setProfileLoadAttempted] = useState(false);

  // Load profile on auth state change
  useEffect(() => {
    const initProfile = async () => {
      if (!user) {
        setMyProfile(null);
        setProfileLoading(false);
        setProfileLoadAttempted(true);
        return;
      }

      setProfileLoading(true);

      try {
        // Try to load profile from storage
        const loaded = await loadAuraProfile(user.uid);

        console.log("[App] Profile load attempt for uid:", user.uid);
        console.log("[App] Loaded profile:", loaded);

        if (loaded && loaded.name) {
          // Valid profile found
          if (!loaded.photos || loaded.photos.length === 0) {
            loaded.photos = [
              user.photoURL || "https://ui-avatars.com/api/?name=User",
            ];
          }
          setMyProfile(loaded);
          console.log("[App] Profile set successfully");
        } else {
          // No valid profile - user needs onboarding
          console.log("[App] No valid profile found, needs onboarding");
          setMyProfile(null);
        }
      } catch (error) {
        console.error("[App] Error loading profile:", error);
        setMyProfile(null);
      }

      setProfileLoading(false);
      setProfileLoadAttempted(true);
    };

    initProfile();
  }, [user]);

  // Persist profile changes
  useEffect(() => {
    if (myProfile && user) {
      console.log("[App] Persisting profile for uid:", user.uid);
      persistAuraProfile(myProfile, user.uid);
    }
  }, [myProfile, user]);

  // Notification clearing
  useEffect(() => {
    if (notification) {
      const t = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(t);
    }
  }, [notification]);

  const handleLogin = () => {};

  const handleOnboardingComplete = (profile: UserProfile) => {
    if (user) {
      const finalProfile = {
        ...profile,
        id: user.uid,
        userId: user.uid,
      };
      console.log("[App] Onboarding complete, saving profile:", finalProfile);
      setMyProfile(finalProfile);
      // Immediately persist
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
    if (myProfile) {
      setSelectedProfile(myProfile);
      setSubView("view-profile");
    }
  };

  const handleViewStory = (profile: UserProfile) => {
    setSelectedProfile(profile);
    setSubView("story-viewer");
  };

  const handleAddStory = (imgUrl: string) => {
    if (!myProfile) return;
    const newStory: Story = {
      id: `st_${Date.now()}`,
      imageUrl: imgUrl,
      timestamp: "Just now",
      isViewed: false,
    };
    setMyProfile({
      ...myProfile,
      stories: [newStory, ...myProfile.stories],
    });
  };

  const handleStartAuraChat = async (profile: UserProfile) => {
    if (!myProfile) return;
    setNotification("Auras are connecting...");
    await triggerBackgroundAuraMatch(myProfile, profile);
    setNotification("Aura Match created! Opening chat...");
    
    // Close any open profile view
    handleCloseSubView();
    
    // Navigate to chat view and open the chat detail
    setCurrentView("chat");
    setTimeout(() => {
      setSelectedProfile(profile);
      setSubView("chat-detail");
    }, 500);
  };

  const handleCloseSubView = () => {
    setSubView("main");
    setSelectedProfile(undefined);
  };

  const handleChatSelect = (matchId: string) => {
    let matchProfile = getProfileById(matchId);

    if (!matchProfile) {
      if (matchId === "demo_julia") {
        matchProfile = {
          id: "demo_julia",
          name: "Julia",
          age: 25,
          photos: [
            "https://images.unsplash.com/photo-1517841905240-472988babdf9",
          ],
          job: "Dev",
          location: "Hamburg",
          distance: 5,
          verified: true,
          auraRead: "",
          vibeTags: [],
          verificationScore: 95,
          verificationTier: "Platinum",
          interests: [],
          stories: [],
          prompts: [],
          details: {
            height: "",
            exercise: "",
            education: "",
            drinking: "",
            smoking: "",
            lookingFor: "",
            starSign: "",
            languages: [],
          },
          bio: "I speak Python better than French. Looking for a player 2.",
        };
      } else if (matchId === "demo_sarah") {
        matchProfile = {
          id: "demo_sarah",
          name: "Sarah",
          age: 26,
          photos: [
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
          ],
          job: "Arch",
          location: "Munich",
          distance: 10,
          verified: true,
          auraRead: "",
          vibeTags: [],
          verificationScore: 88,
          verificationTier: "Gold",
          interests: [],
          stories: [],
          prompts: [],
          details: {
            height: "",
            exercise: "",
            education: "",
            drinking: "",
            smoking: "",
            lookingFor: "",
            starSign: "",
            languages: [],
          },
          bio: "Designing spaces and finding places.",
        };
      }
    }

    if (matchProfile) {
      setSelectedProfile(matchProfile);
      setSubView("chat-detail");
    } else {
      console.error("Profile not found for ID:", matchId);
    }
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    if (myProfile) {
      const newProfile = { ...myProfile, ...updated };
      setMyProfile(newProfile);
    }
    handleCloseSubView();
  };

  // Show loading while auth or profile is loading
  if (authLoading || (user && profileLoading)) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center flex-col gap-4">
        <Icons.Loader2 className="animate-spin text-coral" size={32} />
        <p className="text-sm text-text-muted font-bold tracking-wide">
          INITIALIZING AURA...
        </p>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  // Logged in but no profile (needs onboarding)
  if (!myProfile && profileLoadAttempted) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Still waiting for profile to be determined
  if (!myProfile) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center flex-col gap-4">
        <Icons.Loader2 className="animate-spin text-coral" size={32} />
        <p className="text-sm text-text-muted font-bold tracking-wide">
          LOADING PROFILE...
        </p>
      </div>
    );
  }

  const renderMainContent = () => {
    switch (currentView) {
      case "aura":
        return (
          <Aura
            onEditProfile={() => setSubView("edit-profile")}
            onSettings={() => setSubView("settings")}
            onPreviewProfile={handlePreviewProfile}
            onAddStory={handleAddStory}
          />
        );
      case "discover":
        return (
          <Discover
            onViewProfile={handleViewProfile}
            onViewStory={handleViewStory}
            onStartAuraChat={handleStartAuraChat}
            onLike={() => {}}
            onPass={() => {}}
          />
        );
      case "likes":
        return <Likes onProfileClick={handleViewProfile} />;
      case "chat":
        return <Chat onChatSelect={handleChatSelect} />;
      case "moments":
        return <Moments />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-warm-white text-text-main font-sans flex flex-col mx-auto max-w-md relative shadow-2xl overflow-hidden sm:border-x border-warm-gray/50">
      <main className="flex-1 min-h-0 w-full overflow-hidden relative z-0">
        {renderMainContent()}
      </main>

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in">
          <div className="bg-black/90 text-white px-5 py-3 rounded-full shadow-xl flex items-center gap-3">
            <Icons.Sparkles size={16} className="text-coral" />
            <span className="text-xs font-bold">{notification}</span>
          </div>
        </div>
      )}

      {subView === "edit-profile" && myProfile && (
        <Overlay>
          <EditProfile
            onBack={handleCloseSubView}
            currentUser={myProfile}
            onSave={handleUpdateProfile}
          />
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
          <Filters 
            onClose={handleCloseSubView} 
            onShowMatches={() => {
              handleCloseSubView();
              setCurrentView("likes");
            }}
          />
        </Overlay>
      )}
      {subView === "view-profile" && (
        <Overlay>
          <Profile
            user={selectedProfile}
            isMe={selectedProfile?.id === myProfile.id}
            onBack={handleCloseSubView}
            onEdit={() => setSubView("edit-profile")}
            onLike={() => {
              if (selectedProfile && selectedProfile.id !== myProfile.id)
                setMatchedProfile(selectedProfile);
            }}
            onPass={handleCloseSubView}
            onAuraMatch={() => {
              if (selectedProfile && selectedProfile.id !== myProfile.id)
                handleStartAuraChat(selectedProfile);
            }}
          />
        </Overlay>
      )}
      {subView === "chat-detail" && selectedProfile && (
        <Overlay>
          <ChatDetail
            match={selectedProfile}
            onBack={handleCloseSubView}
            onViewProfile={() => handleViewProfile(selectedProfile)}
          />
        </Overlay>
      )}
      {subView === "story-viewer" && selectedProfile && (
        <StoryViewer user={selectedProfile} onClose={handleCloseSubView} />
      )}
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
      {matchedProfile && (
        <MatchOverlay
          matchedProfile={matchedProfile}
          onClose={() => setMatchedProfile(null)}
          onChat={() => {
            const pid = matchedProfile.id;
            setMatchedProfile(null);
            if (subView === "view-profile") handleCloseSubView();
            handleChatSelect(pid);
          }}
        />
      )}
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

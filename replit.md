# Aura Twin MVP

## Overview
Aura Twin is an AI-powered digital companion app for introverts, featuring a personal AI "Aura" that helps with social interactions and matchmaking. Built with React, TypeScript, Vite, and Google's Gemini AI with complete VisionOS-style glass aesthetic.

## Project Setup
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6.2
- **AI Integration**: Google Gemini AI via @google/genai
- **Port**: 5000 (frontend)
- **Styling**: Tailwind CSS (CDN) + custom glassmorphism CSS

## Recent Changes (November 28, 2025)

### Aura v3 - Full-Body Hologram with Veo Videos
- **Video-Based Avatar**: Uses uploaded Veo videos and PNG images
  - Assets located in `src/assets/`
  - Videos: aura-neutral.mp4, aura-happy.mp4
  - Images: aura-neutral.png, aura-happy.png, aura-playful.png
- **Mood → Asset Mapping**:
  - happy/joy/excited → aura-happy.mp4 (fallback: aura-happy.png)
  - playful/flirty/romantic → aura-playful.png
  - default/neutral → aura-neutral.mp4 (fallback: aura-neutral.png)
- **Hologram Effects (VisionOS Style)**:
  - Floating animation (animate-aura-float)
  - Breathing animation (animate-aura-breathe)
  - Large radial glow behind avatar (mood-reactive)
  - Soft light overlays (top/bottom glass reflections)
  - Subtle scanlines overlay for hologram effect
  - Glassy border with inner shadow
  - Holographic shimmer/light sweep
- **Video Priority**:
  - If video exists for mood → uses `<video>` tag (autoPlay, muted, loop, playsInline)
  - If no video → uses `<img>` fallback
- **isSpeaking Prop**:
  - When true: Adds glowing outer ring with pulse effect
  - Increases halo brightness
- **Props Preserved**: All existing props work unchanged (profile, auraState, size, showName, showVibes, showMood)
- **Path Aliases Added**:
  - `@assets/*` → `src/assets/*` (in vite.config.ts and tsconfig.json)
  - Type declarations for media files in `vite-env.d.ts`

### Reply Lab Feature (New)
- **New Screen**: `screens/ReplyLabScreen.tsx` - Draft replies in three styles
  - Safe / Polite: Cautious, no risk of offense
  - Direct / Honest: Clear and to the point
  - Playful / Warm: Fun side showing
- **New LLM Function**: `generateReplyOptions()` in `services/auraLLM.ts`
  - Uses Gemini to generate three reply options based on user profile
  - Respects user's boundaries, vibe, and personality
- **Navigation**: Fourth tab "Reply Lab" added to top navigation
- **UI Features**:
  - Textarea for pasting messages to reply to
  - Loading state with spinner
  - Three glass cards displaying reply options
  - Copy button for each reply
  - Error handling with gentle error messages

### Phase 1.5: Avatar Wired into All Screens
- **NeuralLinkScreen.tsx**: Added prominent hero section at top with living AuraAvatar
  - Desktop: Glass card with avatar on left, mood/vibe description on right
  - Mobile: Avatar centered above the chat
  - Shows current mood state and vibe pills
- **MatchTestScreen.tsx**: Replaced static AvatarCircle with living AuraAvatar for both profiles
  - "Your Aura" uses current user profile and auraState
  - "Potential Match" uses demo profile with happy mood
  - Both avatars float and breathe with mood-based gradients
- **TwinIntroScreen.tsx**: Both Auras now use living AuraAvatar components
  - Side-by-side layout with animated avatars
  - Your Aura (calm mood) vs Their Aura (happy mood)
  - Summaries displayed below each avatar

## Previous Changes (November 26, 2025)

### Phase 1: Visual Soul - Living Avatar
- **AuraAvatar Component**: New unified avatar component at `components/AuraAvatar.tsx`
  - Breathing animation (4s scale 1→1.05 with opacity shift)
  - Floating animation (6s translateY -10px bob)
  - Mood-based gradient colors with soft VisionOS styling
  - Size variants: sm, md, lg, xl
  - Optional name, vibe words, and mood badge display
- **Mood → Gradient Mapping**:
  - neutral: slate/blue gradients
  - calm: blue/purple gradients  
  - happy: pink/rose/amber gradients
  - anxious: amber/orange/rose gradients (soft, no neon)
  - sad: blue/indigo/slate gradients
- **AuraStage Updated**: Now uses AuraAvatar component for the living character
- **Animations**: `animate-aura-float`, `animate-aura-breathe`, `animate-aura-living` (combined)

### New Two-Column Layout
- **Layout**: 60/40 split - AuraStage on left (7 cols), content panels on right (5 cols)
- **Navigation**: Moved to right panel as pill tabs (Talk to Aura, Match Score, Twin Intro)
- **NeuralLinkScreen**: Simplified to chat-focused single column for narrower panel
- **Status Bar**: Bottom indicator with connection status and user name

### Product Styling & Copy Refinement
- **Onboarding**: Full-page centered layout with glass card, renamed steps to "Core Identity", "Social Energy", "Boundaries & Goals"
- **Neural Link**: Changed stage label to "Neural link online", simplified description about mirroring vibe and emotional safety
- **Match Score**: Clarified purpose as "sandbox" demo with compatibility score caveat, softened result labels
- **Twin Intro**: Updated result headings to "What your twins noticed", maintained supportive tone throughout

## Recent Changes (November 26, 2025) - FINAL BUILD

### Complete VisionOS Frontend Architecture
- **Global Layout**: Deep slate gradient background (from-slate-950 via-slate-900 to-black) with centered max-w-7xl container
- **Top Navigation**: Glass pill-style nav bar with 3 screens (Onboarding, Neural Link, Match Test), sticky positioning, live status indicator
- **Unified Screen Switching**: Single App.tsx state management for all 3 screens, clean navigation without page reloads
- **Avatar System**: 
  - Avatar URL input in Onboarding (Identity step)
  - Circular glassy AvatarCircle component with fallback gradient orbs
  - Displays in Neural Link Stage orb and Match Test profile cards

### Neural Link - Character-First Two-Column Layout
- **Left Column (Aura Stage)**: 
  - Big glassy card with avatar orb (256px, gradient background, blur effects)
  - Profile title, summary, and stats pills (introversion, pace, vibeWords)
  - Character-focused immersive experience
- **Right Column (Chat + Voice)**:
  - Message history (user right-aligned light, Aura left-aligned dark glass)
  - Text input with glass styling
  - Voice controls: mic button, live status, auto-send on speech
  - Auto-speaks Aura replies in feminine voice
- **Mobile**: Stacked layout with flexible heights

### Voice Integration (useVoice Hook)
- Browser Speech Recognition API (STT) with proper error handling
- Text-to-speech (TTS) with feminine voice selection
- Auto-send transcripts as messages
- Auto-speak Aura replies
- Status indicators: "Mic live" / "Aura speaking" / "Voice ready"

### Match Test Simulation Screen
- Demo profiles with avatars (5 sample profiles: Malek, Lina, Alex, Maya, Jordan)
- Profile selector dropdown
- Large circular avatars with glass frames
- "Run Twin Match" button triggers Gemini compatibility analysis
- Results display: compatibility %, match label, "Why it works" / "Things to watch", suggested opener
- All cards use unified glass styling

### Design System (VisionOS Aesthetic)
- **Colors**: Deep slate (slate-950, slate-900) + soft white/slate text
- **Glass Cards**: rounded-3xl, bg-slate-900/70, border-white/10, backdrop-blur-2xl, shadow-2xl
- **No Neon**: All accents use soft sky/blue/indigo/purple with low opacity
- **Buttons**: Rounded-full or rounded-2xl, smooth hover transitions, no harsh animations
- **Typography**: Uppercase tracking, small text sizes, monospace for labels
- **Motion**: Soft animations (animate-pulse for indicators, smooth transitions)

### File Structure
```
├── App.tsx                          # Main app shell with global nav + screen routing
├── types.ts                         # Shared types (AuraProfile, AuraMatchResult, etc)
├── components/
│   ├── AuraAvatarCard.tsx          # Legacy animated orb display
│   ├── AvatarCircle.tsx            # Glassy circular avatar with fallback orbs
│   └── ChatWindow.tsx              # Chat UI component
├── screens/
│   ├── OnboardingScreen.tsx        # Multi-step profile creation with avatar URL
│   ├── NeuralLinkScreen.tsx        # Character-first 2-col layout with voice
│   └── MatchTestScreen.tsx         # Twin matching with demo profiles
├── services/
│   ├── auraLLM.ts                  # Gemini AI integration (chat, profiling, matching)
│   └── demoProfiles.ts             # Sample profiles for Match Test
├── hooks/
│   └── useVoice.ts                 # STT + TTS with browser APIs
└── index.css                        # Glass animations & utilities
```

### Environment Variables
- `GEMINI_API_KEY`: Google Gemini API key (stored in Replit Secrets)

## AI Features (via Gemini)
1. **Profile Building**: Constructs AuraProfile from onboarding answers with avatarUrl preservation
2. **Chat**: Personalized Aura responses based on user's personality + conversation history
3. **Match Analysis**: Twin-to-twin chemistry compatibility scoring with detailed insights

## Deployment
- **Type**: Autoscale (stateless web application)
- **Build Command**: `npm run build`
- **Run Command**: `npm run preview`
- **Port**: 5000 (configured in vite.config.ts)

### VisionOS/iOS 18 Glass Aesthetic Complete
- Modernized App.tsx layout:
  - Added top navigation bar with gradient "Aura Twin" title, status indicator, and Profile button
  - Reorganized to 60% left (avatar) + 40% right (tabs/chat) on desktop
  - Responsive stacking on mobile
- Created comprehensive CSS glass design system in index.css:
  - `.glass-panel`: 24px blur, rgba(15,23,42,0.78) background, 1px subtle border
  - `.glass-panel-light`: Lighter variant for contrast
  - `.glass-panel-dark`: Darker variant for depth
  - Animation classes: fade-in, float, glow, pulse-soft
  - Utility classes: pill-button, label-tiny, scrollbar-hide
- Polished ChatWindow.tsx:
  - User messages: Right-aligned with violet glass gradient
  - Aura messages: Left-aligned with neutral glass styling
  - Soft animations instead of neon bounces
  - Clean input form with glass styling

### Gemini Quota Fix with Fallback System
- Swapped heavy models to lightweight alternatives:
  - Profile building: `gemini-3-pro-preview` → `gemini-2.5-flash`
  - Chat: Already using `gemini-2.5-flash-lite`
  - Matching: `gemini-3-pro-preview` → `gemini-2.5-flash`
- Added quota error detection and fallback profiles
- Service now returns `{ profile, isUsingFallback, message }` structure
- User-friendly messages when API quota exhausted

### Replit Environment Setup
- Configured Vite to run on port 5000 (required for Replit)
- Set allowedHosts: true for cross-origin Replit proxy
- Proper env injection: GEMINI_API_KEY → window.__GEMINI_API_KEY
- Configured preview server for deployment on port 5000

## Project Structure
```
├── App.tsx                     # Main app with left/right layout and tabs
├── index.tsx                   # Application entry point
├── index.html                  # HTML with Tailwind config and glass styles
├── index.css                   # Additional animations
├── types.ts                    # Shared TypeScript types (single source of truth)
├── components/
│   ├── AuraAvatarCard.tsx      # Animated Aura orb/avatar display
│   ├── ChatWindow.tsx          # Glass-styled chat interface
│   └── NeuralProfilePanel.tsx  # Profile editing form
├── screens/
│   ├── OnboardingScreen.tsx    # Multi-step profile creation
│   ├── NeuralLinkScreen.tsx    # Legacy chat screen (logic reused in App)
│   └── MatchTestScreen.tsx     # Twin matching simulation
├── services/
│   └── auraLLM.ts              # Gemini AI integration (untouched)
└── src/                        # Additional source files (legacy)
```

## Environment Variables
- `GEMINI_API_KEY`: Google Gemini API key (stored in Replit Secrets)

## Key Types (types.ts)
- `AuraProfile`: User's personality profile
- `AuraChatMessage`: Chat messages between user and Aura
- `AuraState`: Current mood/state of the Aura
- `MatchResult`: Compatibility results from twin matching
- `SocialSpeed`: "slow" | "normal" | "fast"

## Development
- Run locally: `npm run dev` (starts on port 5000)
- Build: `npm run build`
- Preview build: `npm run preview`

## Design System
- **Background**: Radial gradient (slate-900 → slate-950 → black)
- **Glass panels**: rgba(15, 23, 42, 0.85) with blur(24px)
- **Accent colors**: Violet (primary), Blue/Teal (secondary)
- **Animations**: Float (6s), Glow (4s), Pulse (4s)

## AI Features (via Gemini)
1. **Profile Building**: Constructs AuraProfile from onboarding answers
2. **Chat**: Personalized responses based on user's personality
3. **Match Analysis**: Deep compatibility analysis between two profiles

## Deployment
- **Type**: Autoscale (stateless web application)
- **Build Command**: `npm run build`
- **Run Command**: `npm run preview`
- **Port**: 5000 (configured in vite.config.ts preview settings)

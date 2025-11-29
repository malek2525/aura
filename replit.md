# Aura Twin MVP

## Overview
Aura Twin is an AI-powered digital companion app designed for introverts. Its core purpose is to assist users with social interactions and matchmaking through a personal AI named "Aura." The project aims to provide a unique, immersive experience with a distinct VisionOS-style glass aesthetic, leveraging advanced AI for personalized interactions and compatibility analysis.

## User Preferences
The user wants an iterative development process. They prefer detailed explanations for changes and new features. The user does not want any changes made to the `src/assets/` folder, specifically regarding the `aura-neutral.mp4` and `aura-happy.mp4` files, and also does not want changes to `aura-neutral.png`, `aura-happy.png`, and `aura-playful.png`. They also explicitly stated that the `vite-env.d.ts` file should not be modified.

## System Architecture

### UI/UX Decisions
The application features a complete VisionOS-style glass aesthetic.
- **Global Layout**: Deep slate gradient background with a centered `max-w-7xl` container.
- **Glass Cards**: `rounded-3xl`, `bg-slate-900/70`, `border-white/10`, `backdrop-blur-2xl`, `shadow-2xl`.
- **Colors**: Deep slate (`slate-950`, `slate-900`) with soft white/slate text. Accent colors are violet (primary) and blue/teal (secondary), avoiding neon.
- **Typography**: Uppercase tracking, small text sizes, monospace for labels.
- **Motion**: Soft animations for indicators (pulse) and smooth transitions.
- **Avatar System**: Features a "Living Avatar" (`AuraAvatar`) that uses video or image assets based on mood. This avatar includes breathing and floating animations, mood-based gradient colors, and glowing effects when speaking.
- **Layout**: A two-column layout (60/40 split) is used for desktop, with the AuraStage on the left and content panels on the right. This stacks responsively for mobile.
- **Navigation**: Pill-style navigation bar for main screens (Onboarding, Neural Link, Match Test, Twin Intro, Reply Lab).
- **Reply Lab UI**: Three glass cards with colored tone chips (Safe, Direct, Playful) for generated replies, with context dropdown and copy functionality.

### Technical Implementations
- **Framework**: React 19 with TypeScript.
- **Build Tool**: Vite 6.2.
- **Styling**: Tailwind CSS (CDN) augmented with custom glassmorphism CSS for VisionOS aesthetic.
- **Avatar Implementation**: The `AuraAvatar` component dynamically switches between video (`<video>`) and image (`<img>`) assets (`aura-neutral.mp4`, `aura-happy.mp4`, `aura-playful.png`, etc.) based on the Aura's mood and `isSpeaking` prop.
- **Reply Lab**: `generateReplyOptions()` in `services/auraLLM.ts` uses Gemini to create three distinct reply options, prioritizing safety and user boundaries.
- **Voice Integration**: `useAuraVoice` hook (`hooks/useAuraVoice.ts`) provides hands-free interaction:
    - **Cloud TTS**: Google Cloud Text-to-Speech API via Express backend (`server/index.ts` on port 3001)
    - **Browser Fallback**: Falls back to Web Speech API TTS if cloud fails
    - **STT**: Browser Speech Recognition API for voice input
    - **Voice Service**: `services/voiceService.ts` handles API calls to `/api/tts`
    - **Vite Proxy**: Routes `/api/*` to Express server in development
- **Telemetry**: `utils/telemetry.ts` is used for structured event logging for analytics (e.g., `reply_lab_opened`, `reply_lab_generated`).
- **Quota Management**: Implemented a Gemini quota fix with fallback profiles and user-friendly messages for API exhaustion.

### Feature Specifications
- **AuraAvatar**: Unified component (`components/AuraAvatar.tsx`) supporting video (Veo videos) and image assets, with mood-reactive animations and effects (floating, breathing, glowing).
- **Reply Lab**: Allows users to draft replies in three distinct styles (Safe/Polite, Direct/Honest, Playful/Warm) based on conversational context and user profile.
- **Match Test Simulation**: Demonstrates compatibility analysis between user profiles and demo profiles, providing compatibility scores, insights, and suggested openers.
- **NeuralLinkScreen**: Integrates the living AuraAvatar and a "Reply Lab" button that can prefill the textarea with current chat input.
- **Onboarding**: Multi-step profile creation ("Core Identity", "Social Energy", "Boundaries & Goals") capturing user data.

### System Design Choices
- **Centralized State Management**: `App.tsx` manages global state for screen switching, ensuring a single-page application feel without reloads.
- **Modular File Structure**: Components, screens, services, and hooks are organized into distinct directories for maintainability.
- **Environment Variables**: `GEMINI_API_KEY` and `GOOGLE_TTS_API_KEY` are managed via Replit Secrets and injected securely.
- **Backend**: Express server (`server/index.ts`) runs on port 3001 for TTS API.
- **Deployment**: Configured for Autoscale with `npm run build` and combined Express + Vite preview, running on port 5000.

## External Dependencies
- **AI Integration**: Google Gemini AI (via `@google/genai` library) for:
    - Profile building (`gemini-2.5-flash` model)
    - Personalized chat responses (`gemini-2.5-flash-lite` model)
    - Match analysis (`gemini-2.5-flash` model)
    - Reply generation for Reply Lab
- **Firebase** (project: `aura-99330`):
    - **Authentication**: Firebase Auth for user sign-in/sign-up (`src/firebase.ts` exports `auth`)
    - **Database**: Firestore for data persistence (`src/firebase.ts` exports `db`)
    - **Config**: Uses Vite environment variables (`VITE_FIREBASE_*`) for configuration
    - **Context**: `AuthContext.tsx` provides `useAuth()` hook with `user`, `loading`, and `signOut`
- **Google Cloud Text-to-Speech**: Neural voice synthesis via `GOOGLE_TTS_API_KEY` for high-quality Aura voice (en-US-Neural2-F).
- **Browser APIs**: Speech Recognition API (STT) for voice input, with browser TTS as fallback.
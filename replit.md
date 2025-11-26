# Aura Twin MVP

## Overview
Aura Twin is an AI-powered digital companion app for introverts, featuring a personal AI "Aura" that helps with social interactions and matchmaking. Built with React, TypeScript, Vite, and Google's Gemini AI.

## Project Setup
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6.2
- **AI Integration**: Google Gemini AI via @google/genai
- **Backend Services**: Firebase (optional)
- **Port**: 5000 (frontend)
- **Styling**: Tailwind CSS (CDN) with custom glassmorphism effects

## Recent Changes (November 26, 2025)

### VisionOS-Style Refactoring
- Refactored App.tsx with left/right split layout:
  - Left (40%): Large Aura avatar with floating animation
  - Right (60%): Tabbed glass panel with 3 tabs
- Implemented three main tabs:
  - **Neural Link**: Chat with your Aura AI
  - **Match Test**: Twin-to-twin compatibility matching
  - **Neural Profile**: Edit your profile settings
- Created NeuralProfilePanel component for inline profile editing
- Updated all components with dark/calm VisionOS-style aesthetic:
  - Glass panels with backdrop blur
  - Soft violet/blue accents (no neon)
  - Rounded corners (2xl/3xl)
  - Floating animations for the Aura orb

### Replit Environment Setup
- Configured Vite to run on port 5000 (required for Replit)
- Set HMR clientPort to 443 for Replit's HTTPS proxy compatibility
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

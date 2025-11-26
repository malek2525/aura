# Aura Twin MVP

## Overview
This is an AI-powered application built with React, TypeScript, Vite, and Google's Gemini AI. The app appears to be a digital twin/companion application with neural link and matching features.

## Project Setup
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6.2
- **AI Integration**: Google Gemini AI via @google/genai
- **Backend Services**: Firebase
- **Port**: 5000 (frontend)

## Recent Changes (November 26, 2025)
- Initial setup for Replit environment
- Configured Vite to run on port 5000 (required for Replit)
- Set HMR clientPort to 443 for Replit's HTTPS proxy compatibility
- Configured preview server to use port 5000 and host 0.0.0.0 for deployment
- Set up workflow for frontend development server
- Configured deployment settings for autoscale deployment
- Added GEMINI_API_KEY secret for Gemini AI integration

## Project Structure
```
├── App.tsx                 # Main application component
├── index.tsx              # Application entry point
├── components/            # Reusable UI components
│   ├── AuraAvatarCard.tsx
│   └── ChatWindow.tsx
├── screens/               # Main application screens
│   ├── MatchTestScreen.tsx
│   ├── NeuralLinkScreen.tsx
│   └── OnboardingScreen.tsx
├── services/              # External service integrations
├── src/                   # Additional source files
├── types.ts               # TypeScript type definitions
└── vite.config.ts         # Vite configuration
```

## Environment Variables
- `GEMINI_API_KEY`: Google Gemini API key (stored in Replit Secrets)

## Development
- Run locally: `npm run dev` (starts on port 5000)
- Build: `npm run build`
- Preview build: `npm run preview`

### Replit-Specific Configuration
The Vite configuration has been customized for Replit:
- **Dev server**: Port 5000, host 0.0.0.0 (required for Replit)
- **HMR client port**: 443 (required for Replit's HTTPS proxy)
- **Preview server**: Port 5000, host 0.0.0.0 (for deployment compatibility)

## Deployment
- **Type**: Autoscale (stateless web application)
- **Build Command**: `npm run build`
- **Run Command**: `npm run preview`
- **Port**: 5000 (configured in vite.config.ts preview settings)

The preview command will serve the built static files on port 5000, making them accessible through Replit's deployment infrastructure.

## Key Technologies
- React 19 (latest)
- TypeScript 5.8
- Vite (build tool with HMR)
- Google Gemini AI (AI/LLM integration)
- Firebase (backend services)

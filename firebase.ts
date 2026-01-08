// Mock implementation to bypass build errors in environments without Firebase setup
// Real Firebase imports are removed to prevent "Module not found" or type errors in the demo environment

// Fix for: Property 'env' does not exist on type 'ImportMeta'
const env = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "mock_key",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "mock_domain",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "mock_project",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "mock_bucket",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "mock_sender",
  appId: env.VITE_FIREBASE_APP_ID || "mock_app"
};

// Mock exports to satisfy imports in AuthContext
export const auth = {
    currentUser: null
};
export const db = {};
export const googleProvider = {};

import React, { createContext, useContext, useEffect, useState } from "react";
// Removed real firebase imports to avoid build errors in demo environment
// import { auth, googleProvider } from "../firebase";

// Define minimal User type compatible with app usage
export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  mockLogin: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signUp: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
  clearError: () => {},
  mockLogin: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage for persisted mock session
    const stored = localStorage.getItem('aura_mock_user');
    if (stored) {
        try {
            setUser(JSON.parse(stored));
        } catch {}
    }
    setLoading(false);
  }, []);

  const saveUser = (u: User | null) => {
      setUser(u);
      if (u) localStorage.setItem('aura_mock_user', JSON.stringify(u));
      else localStorage.removeItem('aura_mock_user');
  };

  const mockLogin = () => {
    saveUser({ 
        uid: "mock_user_123", 
        email: "demo@aura.app", 
        displayName: "Demo User",
        photoURL: null
    });
  }

  const clearError = () => setError(null);

  const signIn = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 1000));
    // Accept any login for demo
    saveUser({
        uid: "user_" + Date.now(),
        email,
        displayName: email.split('@')[0],
        photoURL: null
    });
    setLoading(false);
  };

  const signUp = async (email: string, password: string) => {
    await signIn(email, password);
  };

  const signInWithGoogle = async () => {
    setError(null);
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    saveUser({
        uid: "google_user_" + Date.now(),
        email: "google@demo.com",
        displayName: "Google User",
        photoURL: null
    });
    setLoading(false);
  };

  const signOut = async () => {
    setError(null);
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    saveUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        clearError,
        mockLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import {
  auth,
  googleProvider,
  isFirebaseInitialized,
} from "../services/firebase";

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
    if (isFirebaseInitialized && auth) {
      const unsubscribe = onAuthStateChanged(auth, (u) => {
        if (u) {
          setUser({
            uid: u.uid,
            email: u.email,
            displayName: u.displayName,
            photoURL: u.photoURL,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Fallback for demo/no-firebase mode
      const stored = localStorage.getItem("aura_mock_user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {}
      }
      setLoading(false);
    }
  }, []);

  const mockLogin = () => {
    const mockUser = {
      uid: "mock_user_123",
      email: "demo@aura.app",
      displayName: "Demo User",
      photoURL:
        "https://ui-avatars.com/api/?name=Demo+User&background=FF6B6B&color=fff",
    };
    setUser(mockUser);
    localStorage.setItem("aura_mock_user", JSON.stringify(mockUser));
  };

  const clearError = () => setError(null);

  const signIn = async (email: string, password: string) => {
    setError(null);
    if (!auth) {
      // Demo mode
      await new Promise((r) => setTimeout(r, 1000));
      mockLogin();
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const signUp = async (email: string, password: string) => {
    setError(null);
    if (!auth) {
      await new Promise((r) => setTimeout(r, 1000));
      mockLogin();
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    if (!auth) {
      console.warn("Firebase not initialized. Using mock login.");
      await new Promise((r) => setTimeout(r, 1000));
      mockLogin();
      return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error("Google Sign In Error:", err);
      setError("Google Sign In failed. Check console for details.");
    }
  };

  const signOut = async () => {
    if (auth) {
      await firebaseSignOut(auth);
    } else {
      setUser(null);
      localStorage.removeItem("aura_mock_user");
    }
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
        mockLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

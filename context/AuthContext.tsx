
import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { auth, googleProvider, isFirebaseInitialized } from "@/services/firebase";

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
  // Initialize user state from localStorage if available to prevent flash of login screen
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('aura_mock_user');
    return stored ? JSON.parse(stored) : null;
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      if (isFirebaseInitialized && auth) {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
          if (isMounted) {
            if (u) {
              setUser({
                uid: u.uid,
                email: u.email,
                displayName: u.displayName,
                photoURL: u.photoURL
              });
            } else {
               // Fallback to local storage for demo purposes if firebase auth is null
               const stored = localStorage.getItem('aura_mock_user');
               if (stored) {
                  setUser(JSON.parse(stored));
               } else {
                  setUser(null);
               }
            }
            setLoading(false);
          }
        });
        return () => unsubscribe();
      } else {
        // Fallback for demo/no-firebase mode
        // We already checked initial state, so just stop loading
        if (isMounted) setLoading(false);
      }
    };

    initAuth();

    return () => { isMounted = false; };
  }, []);

  const mockLogin = () => {
    const mockUser = { 
        uid: "mock_user_123", 
        email: "demo@aura.app", 
        displayName: "Demo User",
        photoURL: "https://ui-avatars.com/api/?name=Demo+User&background=FF6B6B&color=fff"
    };
    localStorage.setItem('aura_mock_user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const clearError = () => setError(null);

  const signIn = async (email: string, password: string) => {
    setError(null);
    if (!auth) {
      // Demo mode
      await new Promise(r => setTimeout(r, 500));
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
      await new Promise(r => setTimeout(r, 500));
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
      await new Promise(r => setTimeout(r, 500));
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
      localStorage.removeItem('aura_mock_user');
      setUser(null);
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
        mockLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// src/services/authService.ts
// Firebase Authentication service

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  deleteUser,
  User,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase';
import { createUserProfile, getUserProfile, updateUserProfile } from './firestoreService';
import { deleteAllUserPhotos } from './storageService';

// ============================================
// EMAIL/PASSWORD AUTH
// ============================================

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<User> {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  
  // Update display name
  await updateProfile(user, { displayName });
  
  return user;
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<User> {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  
  // Update last active
  await updateUserProfile(user.uid, { lastActiveAt: new Date() });
  
  return user;
}

// ============================================
// SOCIAL AUTH
// ============================================

export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  provider.addScope('email');
  provider.addScope('profile');
  
  const { user } = await signInWithPopup(auth, provider);
  
  // Check if user profile exists
  const existingProfile = await getUserProfile(user.uid);
  
  if (!existingProfile) {
    // Create basic profile from Google data
    await createUserProfile(user.uid, {
      name: user.displayName || 'New User',
      displayName: user.displayName || 'New User',
      age: 25, // Default, user will update in onboarding
      photos: user.photoURL ? [user.photoURL] : [],
      bio: '',
      interests: [],
      vibeTags: [],
      job: '',
      location: ''
    });
  }
  
  return user;
}

export async function signInWithApple(): Promise<User> {
  const provider = new OAuthProvider('apple.com');
  provider.addScope('email');
  provider.addScope('name');
  
  const { user } = await signInWithPopup(auth, provider);
  
  // Check if user profile exists
  const existingProfile = await getUserProfile(user.uid);
  
  if (!existingProfile) {
    await createUserProfile(user.uid, {
      name: user.displayName || 'New User',
      displayName: user.displayName || 'New User',
      age: 25,
      photos: [],
      bio: '',
      interests: [],
      vibeTags: [],
      job: '',
      location: ''
    });
  }
  
  return user;
}

// ============================================
// AUTH UTILITIES
// ============================================

export async function logOut(): Promise<void> {
  await signOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}

export function subscribeToAuthChanges(
  callback: (user: User | null) => void
): () => void {
  return onAuthStateChanged(auth, callback);
}

// ============================================
// ACCOUNT MANAGEMENT
// ============================================

export async function deleteAccount(): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');
  
  // Delete user data
  try {
    await deleteAllUserPhotos(user.uid);
    // Note: Firestore data deletion should be handled by Cloud Functions
    // for proper cleanup of matches, messages, etc.
  } catch (error) {
    console.error('Failed to delete user data:', error);
  }
  
  // Delete auth account
  await deleteUser(user);
}

// ============================================
// VALIDATION
// ============================================

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain an uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain a lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain a number');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export function validateAge(age: number): boolean {
  return age >= 18 && age <= 120;
}

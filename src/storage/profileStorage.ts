import { AuraProfile } from '../types';

const STORAGE_KEY_BASE = 'aura_profile_v1';

function getKey(uid?: string) {
  return uid ? `${STORAGE_KEY_BASE}_${uid}` : STORAGE_KEY_BASE;
}

/**
 * Persist the current AuraProfile to localStorage
 */
export function persistAuraProfile(profile: AuraProfile, uid?: string): void {
  try {
    const serialized = JSON.stringify(profile);
    localStorage.setItem(getKey(uid), serialized);
  } catch (error) {
    console.warn('Aura: Failed to save profile to storage.', error);
  }
}

/**
 * Load the AuraProfile from localStorage
 */
export function loadAuraProfile(uid?: string): AuraProfile | null {
  try {
    const serialized = localStorage.getItem(getKey(uid));
    if (!serialized) return null;
    
    // Basic validation could go here, but for now we trust the schema
    return JSON.parse(serialized) as AuraProfile;
  } catch (error) {
    console.warn('Aura: Failed to load profile from storage.', error);
    return null;
  }
}

/**
 * Clear the AuraProfile from localStorage (Reset)
 */
export function clearAuraProfile(uid?: string): void {
  try {
    localStorage.removeItem(getKey(uid));
  } catch (error) {
    console.warn('Aura: Failed to clear profile from storage.', error);
  }
}
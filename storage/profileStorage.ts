
import { UserProfile } from "../types";

const STORAGE_KEY_PREFIX = "aura_profile_";

export async function loadAuraProfile(uid: string): Promise<UserProfile | null> {
  // Simulate a small delay to match the async interface expectation, 
  // but use localStorage which is synchronous and reliable.
  await new Promise(resolve => setTimeout(resolve, 100)); 
  
  try {
    const key = `${STORAGE_KEY_PREFIX}${uid}`;
    const data = localStorage.getItem(key);
    if (data) {
        return JSON.parse(data) as UserProfile;
    }
    return null;
  } catch (e) {
    console.error("Failed to load profile from storage", e);
    return null;
  }
}

export async function persistAuraProfile(profile: UserProfile, uid: string): Promise<void> {
  try {
    const key = `${STORAGE_KEY_PREFIX}${uid}`;
    // Ensure the object has the correct id
    const record = { ...profile, id: uid };
    localStorage.setItem(key, JSON.stringify(record));
  } catch (e: any) {
    // Handle Quota Exceeded
    if (e.name === 'QuotaExceededError' || e.code === 22 || e.code === 1014) {
      console.warn("Storage quota exceeded. Attempting to trim data...");
      
      try {
        const key = `${STORAGE_KEY_PREFIX}${uid}`;
        // Attempt 1: Remove stories (often large base64)
        if (profile.stories && profile.stories.length > 0) {
            const trimmedProfile = { ...profile, stories: [] };
            localStorage.setItem(key, JSON.stringify(trimmedProfile));
            console.log("Profile persisted with stories removed to save space.");
            return;
        }

        // Attempt 2: Keep only the first photo
        if (profile.photos && profile.photos.length > 1) {
            const trimmedProfile = { ...profile, photos: [profile.photos[0]] };
            localStorage.setItem(key, JSON.stringify(trimmedProfile));
            console.log("Profile persisted with extra photos removed to save space.");
            return;
        }
        
        // Attempt 3: Aggressive cleanup - clear everything except this key AND the auth key
        // We must preserve 'aura_mock_user' so the user doesn't get logged out
        const authUser = localStorage.getItem('aura_mock_user');
        
        localStorage.clear();
        
        if (authUser) {
            localStorage.setItem('aura_mock_user', authUser);
        }
        
        const record = { ...profile, id: uid };
        localStorage.setItem(key, JSON.stringify(record));
        console.log("Storage cleared to make space for profile (Auth preserved).");
        
      } catch (retryError) {
         console.error("Failed to persist even after trimming", retryError);
         alert("Your device storage for this app is full. Please delete some items or clear app data.");
      }
    } else {
       console.error("Failed to persist profile", e);
    }
  }
}


import { UserProfile } from "../types";

const KEY = "aura_user_profile";

export function loadAuraProfile(uid: string): UserProfile | null {
  try {
    const raw = localStorage.getItem(`${KEY}_${uid}`);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch (e) {
    console.error("Failed to load profile", e);
    return null;
  }
}

export function persistAuraProfile(profile: UserProfile, uid: string) {
  try {
    localStorage.setItem(`${KEY}_${uid}`, JSON.stringify(profile));
  } catch (e) {
    console.error("Failed to save profile", e);
  }
}

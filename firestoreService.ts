// src/services/firestoreService.ts
// Real Firestore database service for Aura Twin

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  writeBatch,
  increment
} from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile, MatchPair, TwinChatMessage } from '../types';
import { generateTwinConversation } from './geminiService';

// ============================================
// USER PROFILES
// ============================================

export async function createUserProfile(userId: string, profile: Partial<UserProfile>): Promise<void> {
  const userRef = doc(db, 'users', userId);
  
  await setDoc(userRef, {
    ...profile,
    id: userId,
    userId: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    verified: false,
    verificationScore: 50,
    verificationTier: 'Bronze',
    isActive: true,
    lastActiveAt: serverTimestamp()
  });
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const userRef = doc(db, 'users', userId);
  const snapshot = await getDoc(userRef);
  
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as UserProfile;
  }
  return null;
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
}

export async function updateLastActive(userId: string): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    lastActiveAt: serverTimestamp()
  });
}

// ============================================
// DISCOVER / MATCHING
// ============================================

export async function getDiscoverProfiles(
  currentUserId: string,
  preferences: {
    minAge?: number;
    maxAge?: number;
    preferredGenders?: string;
    maxDistance?: number;
  },
  limitCount: number = 20
): Promise<UserProfile[]> {
  // Get users who haven't been liked/passed by current user
  const likedQuery = query(
    collection(db, 'likes'),
    where('fromUid', '==', currentUserId)
  );
  const likedSnapshot = await getDocs(likedQuery);
  const likedUserIds = new Set(likedSnapshot.docs.map(d => d.data().toUid));
  likedUserIds.add(currentUserId); // Don't show self

  // Get active users
  const usersQuery = query(
    collection(db, 'users'),
    where('isActive', '==', true),
    orderBy('lastActiveAt', 'desc'),
    limit(100) // Get more than needed, filter in memory
  );
  
  const usersSnapshot = await getDocs(usersQuery);
  
  const profiles: UserProfile[] = [];
  
  for (const doc of usersSnapshot.docs) {
    const profile = { id: doc.id, ...doc.data() } as UserProfile;
    
    // Skip if already liked/passed
    if (likedUserIds.has(profile.id)) continue;
    
    // Age filter
    if (preferences.minAge && profile.age < preferences.minAge) continue;
    if (preferences.maxAge && profile.age > preferences.maxAge) continue;
    
    // Gender filter (if specified)
    if (preferences.preferredGenders && preferences.preferredGenders !== 'any') {
      const profileGender = profile.dating?.gender;
      if (preferences.preferredGenders === 'women' && profileGender !== 'woman') continue;
      if (preferences.preferredGenders === 'men' && profileGender !== 'man') continue;
    }
    
    profiles.push(profile);
    
    if (profiles.length >= limitCount) break;
  }
  
  return profiles;
}

// ============================================
// LIKES & MATCHING
// ============================================

export async function sendLike(
  fromUid: string,
  toUid: string,
  superLike: boolean = false
): Promise<{ matched: boolean; matchId?: string }> {
  const batch = writeBatch(db);
  
  // Create like document
  const likeRef = doc(collection(db, 'likes'));
  batch.set(likeRef, {
    fromUid,
    toUid,
    superLike,
    createdAt: serverTimestamp()
  });
  
  // Check if other person already liked us (mutual match!)
  const mutualLikeQuery = query(
    collection(db, 'likes'),
    where('fromUid', '==', toUid),
    where('toUid', '==', fromUid)
  );
  const mutualSnapshot = await getDocs(mutualLikeQuery);
  
  if (!mutualSnapshot.empty) {
    // It's a match! Create match document
    const matchRef = doc(collection(db, 'matches'));
    const matchId = matchRef.id;
    
    // Get both profiles for AI conversation
    const [profileA, profileB] = await Promise.all([
      getUserProfile(fromUid),
      getUserProfile(toUid)
    ]);
    
    let twinConversation = null;
    let compatibilityScore = 75;
    let icebreaker = '';
    
    if (profileA && profileB) {
      // Generate AI twin conversation
      try {
        const aiResult = await generateTwinConversation(profileA, profileB);
        twinConversation = aiResult.transcript;
        compatibilityScore = aiResult.compatibilityScore;
        icebreaker = aiResult.suggestedOpener;
      } catch (error) {
        console.error('Failed to generate twin conversation:', error);
      }
    }
    
    batch.set(matchRef, {
      userA: fromUid,
      userB: toUid,
      isAuraMatch: true,
      compatibilityScore,
      twinTranscript: twinConversation,
      icebreaker,
      status: 'active',
      createdAt: serverTimestamp()
    });
    
    await batch.commit();
    
    return { matched: true, matchId };
  }
  
  await batch.commit();
  return { matched: false };
}

export async function sendPass(fromUid: string, toUid: string): Promise<void> {
  // Record the pass so we don't show this profile again
  const passRef = doc(collection(db, 'passes'));
  await setDoc(passRef, {
    fromUid,
    toUid,
    createdAt: serverTimestamp()
  });
}

// ============================================
// MATCHES
// ============================================

export async function getUserMatches(userId: string): Promise<Array<{
  match: MatchPair;
  otherProfile: UserProfile;
  lastMessage?: any;
}>> {
  // Get matches where user is userA or userB
  const matchesAQuery = query(
    collection(db, 'matches'),
    where('userA', '==', userId),
    where('status', '==', 'active')
  );
  const matchesBQuery = query(
    collection(db, 'matches'),
    where('userB', '==', userId),
    where('status', '==', 'active')
  );
  
  const [snapshotA, snapshotB] = await Promise.all([
    getDocs(matchesAQuery),
    getDocs(matchesBQuery)
  ]);
  
  const results: Array<{ match: MatchPair; otherProfile: UserProfile; lastMessage?: any }> = [];
  
  for (const doc of [...snapshotA.docs, ...snapshotB.docs]) {
    const matchData = { id: doc.id, ...doc.data() } as MatchPair;
    const otherUserId = matchData.userA === userId ? matchData.userB : matchData.userA;
    
    const otherProfile = await getUserProfile(otherUserId);
    if (!otherProfile) continue;
    
    // Get last message
    const messagesQuery = query(
      collection(db, 'matches', doc.id, 'messages'),
      orderBy('createdAt', 'desc'),
      limit(1)
    );
    const messagesSnapshot = await getDocs(messagesQuery);
    const lastMessage = messagesSnapshot.docs[0]?.data();
    
    results.push({
      match: matchData,
      otherProfile,
      lastMessage
    });
  }
  
  // Sort by most recent activity
  results.sort((a, b) => {
    const timeA = a.lastMessage?.createdAt?.toMillis?.() || a.match.createdAt?.toMillis?.() || 0;
    const timeB = b.lastMessage?.createdAt?.toMillis?.() || b.match.createdAt?.toMillis?.() || 0;
    return timeB - timeA;
  });
  
  return results;
}

export async function unmatch(matchId: string): Promise<void> {
  const matchRef = doc(db, 'matches', matchId);
  await updateDoc(matchRef, {
    status: 'unmatched',
    unmatchedAt: serverTimestamp()
  });
}

// ============================================
// REAL-TIME MESSAGING
// ============================================

export function subscribeToMessages(
  matchId: string,
  callback: (messages: any[]) => void
): () => void {
  const messagesRef = collection(db, 'matches', matchId, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toMillis?.() || Date.now()
    }));
    callback(messages);
  });
}

export async function sendMessage(
  matchId: string,
  fromUid: string,
  text: string,
  type: 'text' | 'image' | 'gif' = 'text',
  mediaUrl?: string
): Promise<string> {
  const messagesRef = collection(db, 'matches', matchId, 'messages');
  const messageRef = doc(messagesRef);
  
  await setDoc(messageRef, {
    fromUid,
    text,
    type,
    mediaUrl: mediaUrl || null,
    createdAt: serverTimestamp(),
    isRead: false
  });
  
  // Update match's last activity
  const matchRef = doc(db, 'matches', matchId);
  await updateDoc(matchRef, {
    lastMessageAt: serverTimestamp()
  });
  
  return messageRef.id;
}

export async function markMessagesAsRead(matchId: string, userId: string): Promise<void> {
  const messagesQuery = query(
    collection(db, 'matches', matchId, 'messages'),
    where('isRead', '==', false)
  );
  
  const snapshot = await getDocs(messagesQuery);
  const batch = writeBatch(db);
  
  snapshot.docs.forEach(doc => {
    if (doc.data().fromUid !== userId) {
      batch.update(doc.ref, { isRead: true });
    }
  });
  
  await batch.commit();
}

// ============================================
// LIKES RECEIVED (Who Liked You)
// ============================================

export async function getLikesReceived(userId: string): Promise<Array<{
  likeId: string;
  fromProfile: UserProfile;
  createdAt: any;
  superLike: boolean;
}>> {
  const likesQuery = query(
    collection(db, 'likes'),
    where('toUid', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(50)
  );
  
  const snapshot = await getDocs(likesQuery);
  const results: Array<{ likeId: string; fromProfile: UserProfile; createdAt: any; superLike: boolean }> = [];
  
  for (const doc of snapshot.docs) {
    const likeData = doc.data();
    const fromProfile = await getUserProfile(likeData.fromUid);
    
    if (fromProfile) {
      results.push({
        likeId: doc.id,
        fromProfile,
        createdAt: likeData.createdAt,
        superLike: likeData.superLike || false
      });
    }
  }
  
  return results;
}

// ============================================
// MOMENTS (Social Feed)
// ============================================

export async function createMoment(
  userId: string,
  matchId: string,
  imageUrl: string,
  caption: string,
  vibeTag: string
): Promise<string> {
  const momentRef = doc(collection(db, 'moments'));
  
  // Get both users in the match
  const matchRef = doc(db, 'matches', matchId);
  const matchSnapshot = await getDoc(matchRef);
  
  if (!matchSnapshot.exists()) {
    throw new Error('Match not found');
  }
  
  const matchData = matchSnapshot.data();
  const [profileA, profileB] = await Promise.all([
    getUserProfile(matchData.userA),
    getUserProfile(matchData.userB)
  ]);
  
  await setDoc(momentRef, {
    matchId,
    userIds: [matchData.userA, matchData.userB],
    userNames: [profileA?.name || 'User', profileB?.name || 'User'],
    userAvatars: [profileA?.photos?.[0] || '', profileB?.photos?.[0] || ''],
    imageUrl,
    caption,
    vibeTag,
    likes: 0,
    isPublic: true,
    createdAt: serverTimestamp()
  });
  
  return momentRef.id;
}

export async function getMoments(limitCount: number = 20): Promise<any[]> {
  const momentsQuery = query(
    collection(db, 'moments'),
    where('isPublic', '==', true),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  
  const snapshot = await getDocs(momentsQuery);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    timestamp: formatTimestamp(doc.data().createdAt)
  }));
}

export async function likeMoment(momentId: string): Promise<void> {
  const momentRef = doc(db, 'moments', momentId);
  await updateDoc(momentRef, {
    likes: increment(1)
  });
}

// ============================================
// REPORTING & SAFETY
// ============================================

export async function reportUser(
  reporterUid: string,
  reportedUid: string,
  reason: string,
  details?: string
): Promise<void> {
  const reportRef = doc(collection(db, 'reports'));
  
  await setDoc(reportRef, {
    reporterUid,
    reportedUid,
    reason,
    details: details || '',
    status: 'pending',
    createdAt: serverTimestamp()
  });
}

export async function blockUser(userId: string, blockedUserId: string): Promise<void> {
  const blockRef = doc(db, 'users', userId, 'blocked', blockedUserId);
  
  await setDoc(blockRef, {
    blockedAt: serverTimestamp()
  });
}

// ============================================
// UTILITIES
// ============================================

function formatTimestamp(timestamp: Timestamp | null): string {
  if (!timestamp) return 'just now';
  
  const now = Date.now();
  const time = timestamp.toMillis();
  const diff = now - time;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

// Subscribe to match updates (real-time)
export function subscribeToMatches(
  userId: string,
  callback: (matches: any[]) => void
): () => void {
  // This is a simplified version - in production you'd want compound queries
  const matchesAQuery = query(
    collection(db, 'matches'),
    where('userA', '==', userId),
    where('status', '==', 'active')
  );
  
  return onSnapshot(matchesAQuery, async (snapshot) => {
    const matchesData = await getUserMatches(userId);
    callback(matchesData);
  });
}

// src/hooks/useRealtime.ts
// Real-time React hooks for chat, matches, and notifications

import { useState, useEffect, useCallback } from 'react';
import { subscribeToMessages, sendMessage, markMessagesAsRead, subscribeToMatches } from '../services/firestoreService';
import { MatchMessage } from '../types';

// ============================================
// REAL-TIME MESSAGES HOOK
// ============================================

interface UseMessagesReturn {
  messages: MatchMessage[];
  loading: boolean;
  error: string | null;
  sendMessage: (text: string, type?: 'text' | 'image' | 'gif', mediaUrl?: string) => Promise<void>;
  markAsRead: () => Promise<void>;
}

export function useMessages(matchId: string, currentUserId: string): UseMessagesReturn {
  const [messages, setMessages] = useState<MatchMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!matchId) return;

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToMessages(matchId, (newMessages) => {
      setMessages(newMessages as MatchMessage[]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [matchId]);

  const handleSendMessage = useCallback(async (
    text: string,
    type: 'text' | 'image' | 'gif' = 'text',
    mediaUrl?: string
  ) => {
    if (!matchId || !currentUserId) return;

    try {
      await sendMessage(matchId, currentUserId, text, type, mediaUrl);
    } catch (err) {
      setError('Failed to send message');
      console.error('Send message error:', err);
    }
  }, [matchId, currentUserId]);

  const handleMarkAsRead = useCallback(async () => {
    if (!matchId || !currentUserId) return;

    try {
      await markMessagesAsRead(matchId, currentUserId);
    } catch (err) {
      console.error('Mark as read error:', err);
    }
  }, [matchId, currentUserId]);

  return {
    messages,
    loading,
    error,
    sendMessage: handleSendMessage,
    markAsRead: handleMarkAsRead
  };
}

// ============================================
// REAL-TIME MATCHES HOOK
// ============================================

interface UseMatchesReturn {
  matches: any[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useMatches(userId: string): UseMatchesReturn {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToMatches(userId, (newMatches) => {
      setMatches(newMatches);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, refreshKey]);

  const refresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return {
    matches,
    loading,
    error,
    refresh
  };
}

// ============================================
// TYPING INDICATOR HOOK
// ============================================

interface UseTypingReturn {
  isTyping: boolean;
  startTyping: () => void;
  stopTyping: () => void;
  otherUserTyping: boolean;
}

export function useTyping(matchId: string, currentUserId: string): UseTypingReturn {
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);

  // In a real implementation, this would use Firestore real-time updates
  // For simplicity, we're just managing local state

  const startTyping = useCallback(() => {
    setIsTyping(true);
    // In production: Update Firestore with typing status
  }, []);

  const stopTyping = useCallback(() => {
    setIsTyping(false);
    // In production: Update Firestore
  }, []);

  // Auto-stop typing after 3 seconds of inactivity
  useEffect(() => {
    if (isTyping) {
      const timeout = setTimeout(() => {
        setIsTyping(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [isTyping]);

  return {
    isTyping,
    startTyping,
    stopTyping,
    otherUserTyping
  };
}

// ============================================
// ONLINE STATUS HOOK
// ============================================

interface UseOnlineStatusReturn {
  isOnline: boolean;
  lastSeen: Date | null;
}

export function useOnlineStatus(userId: string): UseOnlineStatusReturn {
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState<Date | null>(null);

  useEffect(() => {
    if (!userId) return;

    // In production, this would subscribe to user's online status in Firestore
    // For demo, we'll simulate it
    setIsOnline(true);
    setLastSeen(new Date());

    // Update own online status
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User went away - update status
      } else {
        // User came back
        setIsOnline(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [userId]);

  return { isOnline, lastSeen };
}

// ============================================
// UNREAD COUNT HOOK
// ============================================

interface UseUnreadCountsReturn {
  unreadMessages: number;
  newLikes: number;
  newMatches: number;
}

export function useUnreadCounts(userId: string): UseUnreadCountsReturn {
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [newLikes, setNewLikes] = useState(0);
  const [newMatches, setNewMatches] = useState(0);

  useEffect(() => {
    if (!userId) return;

    // In production, this would subscribe to:
    // 1. Unread messages across all matches
    // 2. New likes received
    // 3. New matches

    // For demo, simulate some counts
    const interval = setInterval(() => {
      // Randomly update counts to simulate activity
      if (Math.random() > 0.9) {
        setUnreadMessages(prev => prev + 1);
      }
      if (Math.random() > 0.95) {
        setNewLikes(prev => prev + 1);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [userId]);

  return { unreadMessages, newLikes, newMatches };
}

// ============================================
// DEBOUNCE HOOK (for typing, search, etc.)
// ============================================

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// ============================================
// INTERSECTION OBSERVER HOOK (for infinite scroll)
// ============================================

export function useIntersectionObserver(
  callback: () => void,
  options?: IntersectionObserverInit
): (node: HTMLElement | null) => void {
  const [node, setNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!node) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        callback();
      }
    }, options);

    observer.observe(node);

    return () => observer.disconnect();
  }, [node, callback, options]);

  return setNode;
}

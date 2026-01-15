
import { MatchMessage, MessageType } from "../types";

const STORAGE_KEY = 'aura_chat_messages';
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const loadMessages = (): Record<string, MatchMessage[]> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const saveMessages = (msgs: Record<string, MatchMessage[]>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
  } catch (e) {
    console.warn("Failed to save messages", e);
  }
};

let MESSAGES: Record<string, MatchMessage[]> = loadMessages();

export async function fetchMessages(matchId: string): Promise<MatchMessage[]> {
  await delay(50); // Reduced delay for smoother feel
  // Refresh from storage in case another tab updated it (basic sync)
  MESSAGES = loadMessages();
  return MESSAGES[matchId] ? [...MESSAGES[matchId]] : [];
}

export async function sendMessage(
  matchId: string,
  fromUid: string,
  text: string,
  type: MessageType = 'text',
  mediaUrl?: string
): Promise<MatchMessage> {
  await delay(50);

  const msg: MatchMessage = {
    id: `msg_${matchId}_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    matchId,
    fromUid,
    text,
    type,
    mediaUrl,
    createdAt: Date.now(),
  };

  if (!MESSAGES[matchId]) {
    MESSAGES[matchId] = [];
  }
  MESSAGES[matchId].push(msg);
  
  saveMessages(MESSAGES);

  return msg;
}

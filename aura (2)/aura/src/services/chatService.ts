export interface MatchMessage {
  id: string;
  matchId: string;
  fromUid: string;
  text: string;
  createdAt: number;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MESSAGES: Record<string, MatchMessage[]> = {};

export async function fetchMessages(matchId: string): Promise<MatchMessage[]> {
  await delay(150);
  return MESSAGES[matchId] ? [...MESSAGES[matchId]] : [];
}

export async function sendMessage(
  matchId: string,
  fromUid: string,
  text: string,
): Promise<MatchMessage> {
  await delay(120);

  const msg: MatchMessage = {
    id: `msg_${matchId}_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    matchId,
    fromUid,
    text,
    createdAt: Date.now(),
  };

  if (!MESSAGES[matchId]) {
    MESSAGES[matchId] = [];
  }
  MESSAGES[matchId].push(msg);

  return msg;
}

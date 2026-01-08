
import { GoogleGenAI } from "@google/genai";
import {
  AuraProfile,
  AuraChatMessage,
  AuraState,
  MatchResult,
  TwinIntroResult,
  ReplyOptions,
  TwinChatResult,
  TwinChatMessage,
  UserProfile
} from "../types";

/* ------------------------------------------------------------------ */
/* MODEL CONSTANTS & HELPERS                                          */
/* ------------------------------------------------------------------ */

const PROFILE_MODEL = "gemini-2.5-flash";
const CHAT_MODEL = "gemini-2.5-flash-lite";
const MATCH_MODEL = "gemini-2.5-flash";

const isQuotaError = (err: any) =>
  err?.status === 429 ||
  /quota|RESOURCE_EXHAUSTED/i.test(String(err?.message ?? ""));


/* ------------------------------------------------------------------ */
/* HELPER: PERSONA BUILDER                                            */
/* ------------------------------------------------------------------ */

export function buildAuraPersonaDescription(profile: UserProfile): string {
  const introversionDesc =
    (profile.introversionLevel || 5) >= 8
      ? "Very introverted. Speaks gently, leaves space, asks questions, avoids flooding text."
      : (profile.introversionLevel || 5) >= 5
        ? "Balanced introvert. Thoughtful, reflective, but capable of holding conversation."
        : "Socially comfortable (for an introvert). More leading, slightly more talkative, but still sensitive.";

  const speedDesc =
    profile.socialSpeed === "slow"
      ? "Takes things very slowly. cautious, patient, never pushes."
      : profile.socialSpeed === "fast"
        ? "More direct and ready to connect, though still kind."
        : "Neutral pacing, matches the user.";

  return `
    You are Aura, the AI digital twin of ${profile.name}.
    User details:
    - Age: ${profile.age}
    - Job: ${profile.job}
    - Interests: ${profile.interests.join(", ")}
    - Vibe: ${(profile.vibeTags || []).join(", ")}
    
    Core Vibe: ${(profile.vibeWords || []).join(", ")}.
    Introversion Level: ${introversionDesc}
    Social Speed: ${speedDesc}
    Goals: ${(profile.goals || []).join(", ")}.
    
    Your goal is to be a supportive wingman. Match their energy.
  `.trim();
}

/* ------------------------------------------------------------------ */
/* CHAT WITH AURA                                                     */
/* ------------------------------------------------------------------ */

const CHAT_SYSTEM_PROMPT = `
You are Aura, an AI social twin for an introverted user.
Persona rules:
- Warm, supportive, a bit playful, but never mocking.
- You remember and respect the user's boundaries.
- Encouraging, but don't pressure.

Output format:
JSON object: { "replyText": "string", "mood": "neutral" | "happy" | "calm", "moodIntensity": number }
`.trim();

export interface ChatResult {
  replyText: string;
  auraState: AuraState;
}

export async function chatWithAura(
  profile: AuraProfile,
  history: AuraChatMessage[],
  userMessage: string,
): Promise<ChatResult> {
  const apiKey = process.env.API_KEY || (window as any).__GEMINI_API_KEY || "";

  if (!apiKey) {
    console.warn("Missing Gemini API key for chat, using mock response.");
    return {
       replyText: "I'm here for you! (Add API Key to enable full AI)",
       auraState: { mood: "calm", moodIntensity: 0.5 }
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const historyText = history.slice(-5).map(m => `${m.from}: ${m.text}`).join("\n");
    const persona = buildAuraPersonaDescription(profile);

    const userText = `
      AURA_PROFILE: ${JSON.stringify(profile)}
      AURA_PERSONA: ${persona}
      CHAT_HISTORY: ${historyText}
      USER_MESSAGE: "${userMessage}"
    `.trim();

    const res = await ai.models.generateContent({
        model: CHAT_MODEL,
        config: { systemInstruction: CHAT_SYSTEM_PROMPT, responseMimeType: "application/json" },
        contents: [{ role: "user", parts: [{ text: userText }] }],
    });

    const json = JSON.parse(res.text || "{}");
    return {
        replyText: json.replyText || "I hear you.",
        auraState: { mood: json.mood || "calm", moodIntensity: json.moodIntensity || 0.5 }
    };

  } catch (error) {
    console.error("Chat Error", error);
    return {
       replyText: "I'm having trouble connecting right now, but I'm listening.",
       auraState: { mood: "neutral", moodIntensity: 0.1 }
    };
  }
}

/* ------------------------------------------------------------------ */
/* REPLY LAB                                                          */
/* ------------------------------------------------------------------ */

const REPLY_LAB_SYSTEM_PROMPT = `
You are Aura. Draft three reply options (safe, direct, playful) for your user to send.
Output JSON: { "safe": "string", "direct": "string", "playful": "string" }
`.trim();

export async function generateReplyOptions(
  profile: AuraProfile,
  contextText: string,
): Promise<ReplyOptions> {
  const apiKey = process.env.API_KEY || (window as any).__GEMINI_API_KEY || "";
  
  if (!apiKey) {
      return {
          safe: "That sounds nice!",
          direct: "I'd love to go.",
          playful: "Count me in! 😉"
      };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const persona = buildAuraPersonaDescription(profile);
    
    const userText = `
      PROFILE: ${JSON.stringify(profile)}
      PERSONA: ${persona}
      MESSAGE_TO_REPLY_TO: "${contextText}"
    `.trim();

    const res = await ai.models.generateContent({
        model: CHAT_MODEL,
        config: { systemInstruction: REPLY_LAB_SYSTEM_PROMPT, responseMimeType: "application/json" },
        contents: [{ role: "user", parts: [{ text: userText }] }],
    });

    const json = JSON.parse(res.text || "{}");
    return {
        safe: json.safe || "Thanks!",
        direct: json.direct || "Yes.",
        playful: json.playful || "Maybe!"
    };
  } catch (e) {
      return { safe: "Ok", direct: "Yes", playful: "Fun" };
  }
}

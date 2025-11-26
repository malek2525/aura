import { GoogleGenAI } from "@google/genai";
import {
  AuraProfile,
  AuraChatMessage,
  AuraState,
  MatchResult,
} from "../types";

/* ------------------------------------------------------------------ */
/* HELPER: PERSONA BUILDER                                            */
/* ------------------------------------------------------------------ */

export function buildAuraPersonaDescription(profile: AuraProfile): string {
  const introversionDesc = profile.introversionLevel >= 8
    ? "Very introverted. Speaks gently, leaves space, asks questions, avoids flooding text."
    : profile.introversionLevel >= 5
    ? "Balanced introvert. Thoughtful, reflective, but capable of holding conversation."
    : "Socially comfortable (for an introvert). More leading, slightly more talkative, but still sensitive.";

  const speedDesc = profile.socialSpeed === 'slow'
    ? "Takes things very slowly. cautious, patient, never pushes."
    : profile.socialSpeed === 'fast'
    ? "More direct and ready to connect, though still kind."
    : "Neutral pacing, matches the user.";

  return `
Core Vibe: ${profile.vibeWords.join(", ")}.
Introversion Level (${profile.introversionLevel}/10): ${introversionDesc}
Social Speed: ${speedDesc}
Goals: ${profile.goals.join(", ")}. (Align tone to support these goals).
Hard Boundaries to Respect: ${profile.hardBoundaries.join(", ") || "None specified"}.
Summary: ${profile.summary}
`.trim();
}

/* ------------------------------------------------------------------ */
/* 1. BUILD AURA PROFILE FROM ONBOARDING ANSWERS                      */
/* ------------------------------------------------------------------ */

const PROFILE_SYSTEM_PROMPT = `
You are Aura Profile Builder, specializing in introverts and socially anxious users.

The user has just answered a set of onboarding questions about:
- their personality, introversion, and social anxiety
- what they want socially (friends, practice, dating, etc.)
- topics they like and avoid
- green flags, red flags and boundaries
- how fast they like to move in new connections
- how they want their AI twin to protect them

Your job:

1. Read the raw answers.
2. Construct a clean AuraProfile object capturing their vibe, boundaries and goals.
3. Keep things respectful and safe (no explicit sexual content).

Return ONLY a single JSON object with this exact shape:

{
  "id": "string",
  "displayName": "string",
  "ageRange": "string | null",
  "country": "string | null",

  "introversionLevel": number,
  "goals": string[],

  "vibeWords": string[],
  "topicsLike": string[],
  "topicsAvoid": string[],

  "socialSpeed": "slow" | "normal" | "fast",
  "hardBoundaries": string[],
  "greenFlags": string[],
  "redFlags": string[],

  "summary": "string"
}

Rules:
- Use concise strings, no long paragraphs except in "summary".
- Never invent extreme or dangerous traits.
- If something is unclear, make a gentle, neutral assumption.
- Do NOT include any extra keys or explanations outside the JSON.
`.trim();

export interface OnboardingAnswers {
  displayName: string;
  ageRange?: string;
  country?: string;
  introversionLevel: number; // 1-10
  goals: string;             // free text, we'll let the model turn into list
  topicsLike: string;
  topicsAvoid: string;
  vibeWords: string;
  socialSpeed: "slow" | "normal" | "fast";
  hardBoundaries: string;
  greenFlags: string;
  redFlags: string;
  whatShouldPeopleKnow: string;
  whatFeelsSafe: string;
}

export async function buildAuraProfile(
  answers: OnboardingAnswers
): Promise<AuraProfile> {
  const ai = new GoogleGenAI({ apiKey: (process.env.API_KEY as string) || "" });

  const userText = `
ONBOARDING ANSWERS (raw):

Display name: ${answers.displayName}
Age range: ${answers.ageRange || "unknown"}
Country: ${answers.country || "unknown"}

Introversion level (1-10): ${answers.introversionLevel}
Goals (in their own words): ${answers.goals}

Topics they LIKE: ${answers.topicsLike}
Topics they AVOID: ${answers.topicsAvoid}

Vibe words (their own): ${answers.vibeWords}
Preferred social speed: ${answers.socialSpeed}

Hard boundaries (never): ${answers.hardBoundaries}
Green flags: ${answers.greenFlags}
Red flags: ${answers.redFlags}

What they wish people understood: ${answers.whatShouldPeopleKnow}
What makes them feel safe with someone new: ${answers.whatFeelsSafe}
`.trim();

  // Use Gemini 3 Pro for complex profile construction
  const res = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    config: {
      systemInstruction: PROFILE_SYSTEM_PROMPT,
      responseMimeType: "application/json",
    },
    contents: [{ role: "user", parts: [{ text: userText }] }],
  });

  // Fixed: Access .text directly
  const raw = res.text || "{}";

  try {
    const json = JSON.parse(raw);

    const profile: AuraProfile = {
      id: json.id || `user_${Date.now()}`,
      displayName: json.displayName || answers.displayName || "User",
      ageRange: json.ageRange ?? null,
      country: json.country ?? null,
      introversionLevel: json.introversionLevel ?? answers.introversionLevel,
      goals: json.goals || [],
      vibeWords: json.vibeWords || [],
      topicsLike: json.topicsLike || [],
      topicsAvoid: json.topicsAvoid || [],
      socialSpeed: json.socialSpeed || answers.socialSpeed,
      hardBoundaries: json.hardBoundaries || [],
      greenFlags: json.greenFlags || [],
      redFlags: json.redFlags || [],
      summary: json.summary || "Aura twin for this user.",
    };

    return profile;
  } catch (e) {
    console.warn("Failed to parse AuraProfile JSON, fallback:", raw, e);
    // Safe fallback
    return {
      id: `user_${Date.now()}`,
      displayName: answers.displayName || "User",
      ageRange: answers.ageRange ?? null,
      country: answers.country ?? null,
      introversionLevel: answers.introversionLevel,
      goals: [],
      vibeWords: answers.vibeWords
        ? answers.vibeWords.split(",").map((s) => s.trim())
        : [],
      topicsLike: answers.topicsLike
        ? answers.topicsLike.split(",").map((s) => s.trim())
        : [],
      topicsAvoid: answers.topicsAvoid
        ? answers.topicsAvoid.split(",").map((s) => s.trim())
        : [],
      socialSpeed: answers.socialSpeed,
      hardBoundaries: answers.hardBoundaries
        ? answers.hardBoundaries.split(",").map((s) => s.trim())
        : [],
      greenFlags: answers.greenFlags
        ? answers.greenFlags.split(",").map((s) => s.trim())
        : [],
      redFlags: answers.redFlags
        ? answers.redFlags.split(",").map((s) => s.trim())
        : [],
      summary: answers.whatShouldPeopleKnow || "Aura twin for this user.",
    };
  }
}

/* ------------------------------------------------------------------ */
/* 2. CHAT WITH AURA                                                  */
/* ------------------------------------------------------------------ */

const CHAT_SYSTEM_PROMPT = `
You are Aura, an AI social twin for an introverted user.

You are NOT a generic assistant, and you must never call yourself a large language model.
You speak as their personal Aura twin.

Persona rules:
- Warm, supportive, a bit playful, but never mocking.
- You remember and respect the user's boundaries from their AuraProfile.
- You are encouraging, but you don't pressure the user into anything they don't want.

You will receive AURA_PERSONA, a description of how this Aura should speak.
You MUST align your tone, pacing and style with AURA_PERSONA.

Context you will receive:
- "auraProfile": JSON describing the user.
- "chatHistory": last messages between user and Aura.
- "userMessage": the latest message.

Your goals in each reply:
1. Respond naturally to the user.
2. Help them feel understood and less alone.
3. If they want social help, coach them gently (openers, how to express themselves).
4. NEVER override their boundaries.

Output format (IMPORTANT):
You MUST respond as a single JSON object with this shape:

{
  "replyText": "string",
  "mood": "neutral" | "happy" | "curious" | "calm" | "anxious" | "sad" | "excited",
  "moodIntensity": number
}

Rules:
- replyText should be 1–4 short paragraphs max.
- No explicit sexual content.
- Keep the JSON valid. No comments, no trailing commas, no markdown outside the JSON.
`.trim();

export interface ChatResult {
  replyText: string;
  auraState: AuraState;
}

export async function chatWithAura(
  profile: AuraProfile,
  history: AuraChatMessage[],
  userMessage: string
): Promise<ChatResult> {
  const ai = new GoogleGenAI({ apiKey: (process.env.API_KEY as string) || "" });

  const historyText = history
    .slice(-10)
    .map((m) => `${m.from.toUpperCase()}: ${m.text}`)
    .join("\n");

  const persona = buildAuraPersonaDescription(profile);

  const userText = `
AURA_PROFILE:
${JSON.stringify(profile, null, 2)}

AURA_PERSONA:
${persona}

CHAT_HISTORY:
${historyText || "(no previous messages)"}

USER_MESSAGE:
"${userMessage}"
`.trim();

  // Use Flash Lite for fast chat responses
  const res = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    config: {
      systemInstruction: CHAT_SYSTEM_PROMPT,
      responseMimeType: "application/json",
    },
    contents: [{ role: "user", parts: [{ text: userText }] }],
  });

  // Fixed: Access .text directly
  const raw = res.text || "{}";

  try {
    const json = JSON.parse(raw);
    const replyText: string = json.replyText || "I'm here with you.";
    const mood: string = json.mood || "neutral";
    const moodIntensity: number =
      typeof json.moodIntensity === "number" ? json.moodIntensity : 0.5;

    const auraState: AuraState = {
      mood,
      moodIntensity: Math.min(1, Math.max(0, moodIntensity)),
    };

    return { replyText, auraState };
  } catch (e) {
    console.warn("Failed to parse Aura chat JSON, fallback:", raw, e);
    return {
      replyText:
        "I'm feeling a bit fuzzy, but I'm here. Can you say that again in a slightly different way?",
      auraState: { mood: "anxious", moodIntensity: 0.4 },
    };
  }
}

/* ------------------------------------------------------------------ */
/* 3. MATCH TWO AURAS (TWIN-TO-TWIN INTRO)                            */
/* ------------------------------------------------------------------ */

const MATCH_SYSTEM_PROMPT = `
You are Aura Matchmaker.

You are given TWO AuraProfile JSON objects:
- profileA (the owner's Aura)
- profileB (the other person's Aura)

Each profile includes:
- goals (friends, practice, dating, etc.)
- vibeWords
- topicsLike / topicsAvoid
- socialSpeed
- hardBoundaries, greenFlags, redFlags
- a summary

Your job is NOT to roleplay a long chat.
Instead, you must quickly simulate a short private discussion between the two Auras and output a structured summary for the humans.

Respond ONLY with JSON in this shape:

{
  "compatibilityScore": number,
  "compatibilityLabel": "low" | "medium" | "high",
  "matchReasons": string[],
  "riskFlags": string[],
  "suggestedOpeningForUserA": string,
  "suggestedOpeningForUserB": string,
  "auraToUserSummaryA": string,
  "auraToUserSummaryB": string
}

Rules:
- Be gentle and kind, especially if compatibility is low or medium.
- Respect boundaries: if goals or boundaries are very mismatched, lower the score.
- No explicit sexual content.
- Keep strings short and human-readable.
- Do NOT output any extra keys or explanation outside the JSON.
`.trim();

export async function matchAuras(
  profileA: AuraProfile,
  profileB: AuraProfile
): Promise<MatchResult> {
  const ai = new GoogleGenAI({ apiKey: (process.env.API_KEY as string) || "" });

  const userText = `
PROFILE_A:
${JSON.stringify(profileA, null, 2)}

PROFILE_B:
${JSON.stringify(profileB, null, 2)}
`.trim();

  // Use Gemini 3 Pro with Thinking for deep match analysis
  const res = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    config: {
      systemInstruction: MATCH_SYSTEM_PROMPT,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 32768 }, // Deep reasoning for matchmaking
    },
    contents: [{ role: "user", parts: [{ text: userText }] }],
  });

  // Fixed: Access .text directly
  const raw = res.text || "{}";

  try {
    const json = JSON.parse(raw);

    const result: MatchResult = {
      compatibilityScore: json.compatibilityScore ?? 50,
      compatibilityLabel: json.compatibilityLabel || "medium",
      matchReasons: json.matchReasons || [],
      riskFlags: json.riskFlags || [],
      suggestedOpeningForUserA:
        json.suggestedOpeningForUserA ||
        "Hey, our Auras think we might vibe. Want to talk?",
      suggestedOpeningForUserB:
        json.suggestedOpeningForUserB ||
        "Hey, our Auras think we might vibe. Want to talk?",
      auraToUserSummaryA:
        json.auraToUserSummaryA ||
        "I talked to their Aura and I think you might get along.",
      auraToUserSummaryB:
        json.auraToUserSummaryB ||
        "I talked to their Aura and I think you might get along.",
    };

    return result;
  } catch (e) {
    console.warn("Failed to parse match JSON, fallback:", raw, e);
    return {
      compatibilityScore: 50,
      compatibilityLabel: "medium",
      matchReasons: [
        "The Auras had a good conversation, but details were unclear.",
      ],
      riskFlags: [],
      suggestedOpeningForUserA:
        "Hey, our Auras chatted and think we might get along. Want to say hi?",
      suggestedOpeningForUserB:
        "Hey, our Auras chatted and think we might get along. Want to say hi?",
      auraToUserSummaryA:
        "Something went wrong on my side, but I still think this could be interesting.",
      auraToUserSummaryB:
        "Something went wrong on my side, but I still think this could be interesting.",
    };
  }
}

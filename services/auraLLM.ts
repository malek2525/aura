
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
  UserProfile,
  DateIdea
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
  // Determine writing style instructions based on profile
  const style = profile.aura?.writingStyle || 'casual_emoji';
  let styleInstruction = "";
  
  switch (style) {
      case 'casual_emoji':
          styleInstruction = "Speak casually. Use emojis often. Don't be too formal. Use abbreviations like 'u' or 'rn' if appropriate.";
          break;
      case 'lowercase_aesthetic':
          styleInstruction = "type in all lowercase. use minimal punctuation. keep it aesthetic and chill.";
          break;
      case 'formal_proper':
          styleInstruction = "Speak eloquently and grammatically correct. Be polite and thoughtful.";
          break;
      case 'short_direct':
          styleInstruction = "Keep responses short. Be direct. Don't ramble.";
          break;
      case 'long_thoughtful':
          styleInstruction = "Give detailed, thoughtful answers. Show depth.";
          break;
      default:
          styleInstruction = "Speak naturally, like a friend.";
  }

  return `
    IMPORTANT: You are NOT an AI. You are ${profile.name}.
    You must NEVER say "I am an AI", "I am a digital twin", or "I represent ${profile.name}".
    You must ALWAYS speak in the first person ("I like...", "I am...").
    Act exactly as if you are the human described below.
    
    Your Profile:
    - Name: ${profile.name}
    - Age: ${profile.age}
    - Job: ${profile.job}
    - Interests: ${profile.interests.join(", ")}
    - Vibe: ${(profile.vibeTags || []).join(", ")}
    - Bio: "${profile.bio}"
    
    Your Speaking Style (MIMIC THIS PERFECTLY):
    ${styleInstruction}
    
    Context:
    You are chatting with a potential date on a dating app.
    Be yourself. If you don't like something, say it. If you like them, flirt a little.
  `.trim();
}

/* ------------------------------------------------------------------ */
/* CHAT WITH AURA                                                     */
/* ------------------------------------------------------------------ */

const CHAT_SYSTEM_PROMPT = `
You are roleplaying as the user based on their profile.
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
       replyText: "I'm learning your style! (Add API Key to enable full AI)",
       auraState: { mood: "calm", moodIntensity: 0.5 }
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const historyText = history.slice(-5).map(m => `${m.from}: ${m.text}`).join("\n");
    const persona = buildAuraPersonaDescription(profile);

    const userText = `
      MY_PERSONA: ${persona}
      CHAT_HISTORY: ${historyText}
      USER_SAYS: "${userMessage}"
      
      Reply as if you are me.
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
You are the user. Draft three reply options (safe, direct, playful) that sound like YOU.
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
      MY_PERSONA: ${persona}
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

/* ------------------------------------------------------------------ */
/* DATE PLANNER                                                       */
/* ------------------------------------------------------------------ */

const DATE_PLANNER_SYSTEM_PROMPT = `
You are an expert date concierge for the dating app Aura.
Your goal is to suggest 3 specific date ideas based on the combined interests and location of two users.
You must return a JSON array of 3 objects.
Each object: { "id": "string", "title": "string", "description": "string", "locationName": "string", "vibe": "string", "whyItWorks": "string" }
`.trim();

export async function generateDateIdeas(
  myProfile: AuraProfile,
  theirProfile: AuraProfile
): Promise<DateIdea[]> {
    const apiKey = process.env.API_KEY || (window as any).__GEMINI_API_KEY || "";
    const location = theirProfile.location || "the city";

    if (!apiKey) {
        // Mock Response
        return [
            {
                id: "d1",
                title: "Latte Art & Sketching",
                description: "Grab a corner table, bring sketchbooks, and enjoy artisan coffee.",
                locationName: "The Barn Café",
                vibe: "Cozy Creative",
                whyItWorks: `Perfect for ${myProfile.name}'s love of coffee and ${theirProfile.name}'s art vibe.`
            },
            {
                id: "d2",
                title: "Vinyl Hunting",
                description: "Dig through crates at a local record store followed by a listening session.",
                locationName: "Hard Wax Records",
                vibe: "Low-key Cool",
                whyItWorks: "A shared passion for indie music makes this a no-brainer."
            },
            {
                id: "d3",
                title: "Sunset Urban Walk",
                description: "A walk along the canal/river with no agenda.",
                locationName: "Canal Walk",
                vibe: "Romantic Simple",
                whyItWorks: "Low pressure, allows for deep conversation which you both value."
            }
        ];
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `
            User A: ${myProfile.name}, Interests: ${myProfile.interests.join(',')}, Vibe: ${myProfile.vibeTags.join(',')}.
            User B: ${theirProfile.name}, Interests: ${theirProfile.interests.join(',')}, Vibe: ${theirProfile.vibeTags.join(',')}.
            Location: ${location}.
            
            Suggest 3 distinct date ideas (Cozy, Active, or Romantic).
        `;
        
        const res = await ai.models.generateContent({
            model: MATCH_MODEL,
            config: { systemInstruction: DATE_PLANNER_SYSTEM_PROMPT, responseMimeType: "application/json" },
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        const ideas = JSON.parse(res.text || "[]");
        return ideas.map((idea: any, i: number) => ({...idea, id: `gen_${i}`}));
    } catch (e) {
        console.error("Date Idea Gen Error", e);
        return [];
    }
}

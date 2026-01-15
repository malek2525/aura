// src/services/geminiService.ts
// Real Gemini AI integration for Aura Twin conversations

import { UserProfile } from '../types';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Get API key from environment
const getApiKey = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key || key === 'YOUR_GEMINI_API_KEY') {
    console.warn('Gemini API key not configured - using fallback responses');
    return null;
  }
  return key;
};

interface TwinMessage {
  from: 'auraA' | 'auraB';
  text: string;
  senderName: string;
  timestamp?: number;
}

interface TwinConversationResult {
  transcript: TwinMessage[];
  summary: string;
  compatibilityScore: number;
  suggestedOpener: string;
}

// Generate a real AI conversation between two user's Auras
export async function generateTwinConversation(
  profileA: UserProfile,
  profileB: UserProfile
): Promise<TwinConversationResult> {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    return generateFallbackConversation(profileA, profileB);
  }

  const prompt = buildConversationPrompt(profileA, profileB);

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 1500,
          topP: 0.95,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response from Gemini');
    }

    const text = data.candidates[0].content.parts[0].text;
    return parseGeminiResponse(text, profileA, profileB);

  } catch (error) {
    console.error('Gemini API error:', error);
    return generateFallbackConversation(profileA, profileB);
  }
}

// Build the prompt for Gemini
function buildConversationPrompt(profileA: UserProfile, profileB: UserProfile): string {
  const interestsA = profileA.interests?.join(', ') || 'various things';
  const interestsB = profileB.interests?.join(', ') || 'various things';
  const vibesA = profileA.vibeTags?.join(', ') || profileA.vibeWords?.join(', ') || 'chill';
  const vibesB = profileB.vibeTags?.join(', ') || profileB.vibeWords?.join(', ') || 'chill';
  const styleA = profileA.aura?.writingStyle || 'casual_emoji';
  const styleB = profileB.aura?.writingStyle || 'casual_emoji';
  const introA = profileA.introversionLevel || profileA.aura?.introversionLevel || 5;
  const introB = profileB.introversionLevel || profileB.aura?.introversionLevel || 5;
  const goalsA = profileA.goals?.join(', ') || profileA.details?.lookingFor || 'connection';
  const goalsB = profileB.goals?.join(', ') || profileB.details?.lookingFor || 'connection';

  return `You are simulating a conversation between two AI dating assistants called "Auras" on a dating app called Aura Twin.
Each Aura represents a real person and speaks AS that person (first person), checking compatibility before their humans meet.

PERSON A (${profileA.name}):
- Age: ${profileA.age}
- Job: ${profileA.job || 'Not specified'}
- Interests: ${interestsA}
- Vibe/Energy: ${vibesA}
- Bio: ${profileA.bio || 'No bio'}
- Texting style: ${getStyleDescription(styleA)}
- Introversion: ${introA}/10 (higher = more introverted)
- Looking for: ${goalsA}

PERSON B (${profileB.name}):
- Age: ${profileB.age}
- Job: ${profileB.job || 'Not specified'}
- Interests: ${interestsB}
- Vibe/Energy: ${vibesB}
- Bio: ${profileB.bio || 'No bio'}
- Texting style: ${getStyleDescription(styleB)}
- Introversion: ${introB}/10
- Looking for: ${goalsB}

CRITICAL RULES:
1. Each Aura speaks AS their person in first person ("I like..." not "They like...")
2. Use REAL casual texting language - lowercase, abbreviations, emojis where natural
3. Messages should be SHORT (1-2 sentences, like real texts)
4. Find SPECIFIC common ground from their profiles
5. Match each person's texting style
6. Be warm and friendly, not formal or robotic
7. The conversation should feel like two friends chatting about a potential match

Generate a 6-8 message conversation where they:
1. Greet and reference something specific from each other's profile
2. Discover shared interests or compatible vibes
3. Briefly discuss what they're each looking for
4. Agree their humans should meet (or note concerns if incompatible)

Also provide:
- A compatibility score (0-100)
- A suggested first message for Person A to send Person B

OUTPUT FORMAT (JSON only, no other text):
{
  "transcript": [
    {"from": "auraA", "text": "message text here", "senderName": "${profileA.name}"},
    {"from": "auraB", "text": "message text here", "senderName": "${profileB.name}"}
  ],
  "compatibilityScore": 75,
  "summary": "brief 1-sentence summary of the match",
  "suggestedOpener": "hey! saw ur into X, thats so cool..."
}`;
}

function getStyleDescription(style: string): string {
  const styles: Record<string, string> = {
    'casual_emoji': 'casual with emojis (heyy! 👋)',
    'lowercase_aesthetic': 'lowercase aesthetic (hey how r u)',
    'formal_proper': 'proper grammar (Hello, how are you?)',
    'short_direct': 'short and direct (Hey. Good.)',
    'long_thoughtful': 'longer thoughtful messages'
  };
  return styles[style] || styles['casual_emoji'];
}

// Parse Gemini's response
function parseGeminiResponse(
  text: string, 
  profileA: UserProfile, 
  profileB: UserProfile
): TwinConversationResult {
  try {
    // Try to extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Add timestamps to messages
      const transcript = (parsed.transcript || []).map((msg: any, i: number) => ({
        ...msg,
        timestamp: Date.now() + (i * 2000)
      }));

      return {
        transcript,
        summary: parsed.summary || 'ur auras connected! ✨',
        compatibilityScore: parsed.compatibilityScore || calculateFallbackScore(profileA, profileB),
        suggestedOpener: parsed.suggestedOpener || generateFallbackOpener(profileA, profileB)
      };
    }
  } catch (e) {
    console.error('Failed to parse Gemini response:', e);
  }

  return generateFallbackConversation(profileA, profileB);
}

// Calculate compatibility score based on profile overlap
function calculateFallbackScore(profileA: UserProfile, profileB: UserProfile): number {
  let score = 50;

  // Interest overlap
  const interestsA = new Set((profileA.interests || []).map(i => i.toLowerCase()));
  const interestsB = new Set((profileB.interests || []).map(i => i.toLowerCase()));
  const interestOverlap = [...interestsA].filter(i => interestsB.has(i)).length;
  score += Math.min(interestOverlap * 5, 20);

  // Vibe overlap
  const vibesA = new Set((profileA.vibeTags || profileA.vibeWords || []).map(v => v.toLowerCase()));
  const vibesB = new Set((profileB.vibeTags || profileB.vibeWords || []).map(v => v.toLowerCase()));
  const vibeOverlap = [...vibesA].filter(v => vibesB.has(v)).length;
  score += Math.min(vibeOverlap * 5, 15);

  // Introversion compatibility
  const introA = profileA.introversionLevel || 5;
  const introB = profileB.introversionLevel || 5;
  const introDiff = Math.abs(introA - introB);
  if (introDiff <= 2) score += 10;
  else if (introDiff >= 5) score -= 10;

  // Goals alignment
  const goalsA = profileA.goals || [];
  const goalsB = profileB.goals || [];
  if (goalsA.some(g => goalsB.includes(g))) {
    score += 10;
  }

  return Math.min(Math.max(score, 20), 95);
}

// Generate fallback opener
function generateFallbackOpener(fromProfile: UserProfile, toProfile: UserProfile): string {
  const interest = toProfile.interests?.[0] || toProfile.vibeTags?.[0] || 'your profile';
  const openers = [
    `hey! saw ur into ${interest.toLowerCase()}, had to say hi 👋`,
    `omg ${interest.toLowerCase()}?? ok we need to talk`,
    `${interest.toLowerCase()} fan spotted 👀 hiii`,
    `hey! something about ur vibe just clicked, hows ur day going?`,
    `hi! ur ${interest.toLowerCase()} interest caught my eye ✨`
  ];
  return openers[Math.floor(Math.random() * openers.length)];
}

// Fallback conversation when API fails
function generateFallbackConversation(
  profileA: UserProfile, 
  profileB: UserProfile
): TwinConversationResult {
  const sharedInterest = findSharedInterest(profileA, profileB);
  const score = calculateFallbackScore(profileA, profileB);

  const transcript: TwinMessage[] = [
    { 
      from: 'auraB', 
      text: `hey! im ${profileB.name}'s aura. saw u like ${sharedInterest}? 👀`, 
      senderName: profileB.name,
      timestamp: Date.now()
    },
    { 
      from: 'auraA', 
      text: `omg yes!! its like my whole personality at this point lol. u too?`, 
      senderName: profileA.name,
      timestamp: Date.now() + 2000
    },
    { 
      from: 'auraB', 
      text: `literally same. ${profileB.name} needs someone who gets that tbh`, 
      senderName: profileB.name,
      timestamp: Date.now() + 4000
    },
    { 
      from: 'auraA', 
      text: `${profileA.name} said the same thing! what are they looking for tho`, 
      senderName: profileA.name,
      timestamp: Date.now() + 6000
    },
    { 
      from: 'auraB', 
      text: `something real ideally. tired of the games yk?`, 
      senderName: profileB.name,
      timestamp: Date.now() + 8000
    },
    { 
      from: 'auraA', 
      text: `ok same page then. i think they should def meet 👀✨`, 
      senderName: profileA.name,
      timestamp: Date.now() + 10000
    },
    { 
      from: 'auraB', 
      text: `agreed! vibes are immaculate. making this happen 🙌`, 
      senderName: profileB.name,
      timestamp: Date.now() + 12000
    }
  ];

  return {
    transcript,
    summary: `ur auras vibed over ${sharedInterest}! ${score}% compatible ✨`,
    compatibilityScore: score,
    suggestedOpener: generateFallbackOpener(profileA, profileB)
  };
}

function findSharedInterest(profileA: UserProfile, profileB: UserProfile): string {
  const interestsA = (profileA.interests || []).map(i => i.toLowerCase());
  const interestsB = (profileB.interests || []).map(i => i.toLowerCase());
  
  for (const interest of interestsA) {
    if (interestsB.includes(interest)) {
      return interest;
    }
  }
  
  return profileB.interests?.[0] || profileB.vibeTags?.[0] || 'cool stuff';
}

// Generate AI-powered reply suggestions
export async function generateReplySuggestions(
  userProfile: UserProfile,
  matchProfile: UserProfile,
  lastMessage: string
): Promise<{ safe: string; direct: string; playful: string }> {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    return generateFallbackReplies(lastMessage);
  }

  const prompt = `You are helping ${userProfile.name} reply to a message on a dating app.

Their match ${matchProfile.name} said: "${lastMessage}"

${userProfile.name}'s profile:
- Interests: ${userProfile.interests?.join(', ') || 'various'}
- Vibe: ${userProfile.vibeTags?.join(', ') || 'chill'}
- Texting style: ${userProfile.aura?.writingStyle || 'casual'}

Generate 3 reply options in casual texting style (lowercase, emojis ok, short):
1. safe - friendly and simple
2. direct - confident and forward  
3. playful - fun and flirty

OUTPUT FORMAT (JSON only):
{
  "safe": "reply text",
  "direct": "reply text",
  "playful": "reply text"
}`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.9, maxOutputTokens: 300 }
      })
    });

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error('Reply generation error:', error);
  }

  return generateFallbackReplies(lastMessage);
}

function generateFallbackReplies(lastMessage: string): { safe: string; direct: string; playful: string } {
  return {
    safe: "haha yeah totally! what else are u into?",
    direct: "i like that energy. we should hang out sometime",
    playful: "ok wait ur actually cool 👀 tell me more"
  };
}

// Generate date ideas based on shared interests
export async function generateDateIdeas(
  userProfile: UserProfile,
  matchProfile: UserProfile,
  location?: string
): Promise<Array<{ id: string; title: string; description: string; vibe: string; whyItWorks: string }>> {
  const apiKey = getApiKey();
  const city = location || userProfile.location || 'your city';
  
  const sharedInterests = (userProfile.interests || []).filter(i => 
    (matchProfile.interests || []).map(x => x.toLowerCase()).includes(i.toLowerCase())
  );

  if (!apiKey) {
    return generateFallbackDateIdeas(sharedInterests, city);
  }

  const prompt = `Generate 3 date ideas for two people in ${city}.

Person 1 likes: ${userProfile.interests?.join(', ') || 'various things'}
Person 2 likes: ${matchProfile.interests?.join(', ') || 'various things'}
Shared interests: ${sharedInterests.join(', ') || 'exploring new things'}

Both are somewhat introverted and prefer low-pressure first dates.

OUTPUT FORMAT (JSON array only):
[
  {
    "id": "1",
    "title": "Coffee & Bookstore Hop",
    "description": "Start at a cozy café, then browse a nearby bookstore together",
    "vibe": "Cozy",
    "whyItWorks": "Low pressure, lots to talk about, easy exit if needed"
  }
]`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 600 }
      })
    });

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error('Date ideas generation error:', error);
  }

  return generateFallbackDateIdeas(sharedInterests, city);
}

function generateFallbackDateIdeas(sharedInterests: string[], city: string) {
  return [
    {
      id: '1',
      title: 'Coffee & Walk',
      description: `Grab coffee at a cute café in ${city} and take a walk nearby`,
      vibe: 'Casual',
      whyItWorks: 'Low pressure, easy to extend or end naturally'
    },
    {
      id: '2', 
      title: 'Food Market Adventure',
      description: 'Explore a local food market and try different things together',
      vibe: 'Adventurous',
      whyItWorks: 'Built-in conversation topics, discover each others tastes'
    },
    {
      id: '3',
      title: 'Sunset Spot',
      description: 'Find a nice spot to watch the sunset with drinks',
      vibe: 'Romantic',
      whyItWorks: 'Beautiful setting, natural conversation flow'
    }
  ];
}

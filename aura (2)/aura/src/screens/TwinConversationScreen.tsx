import React, { useState, useRef, useEffect } from 'react';
import { AuraProfile } from '../types';
import { GoogleGenAI } from "@google/genai";
import { buildAuraPersonaDescription } from '../services/auraLLM';

interface TwinConversationScreenProps {
  profileA: AuraProfile;
  profileB: AuraProfile;
}

interface DialogueMessage {
  from: "A" | "B";
  text: string;
}

const MODEL_NAME = "gemini-2.5-flash-lite"; // Fast responses for conversation simulation

/* ------------------------------------------------------------------ */
/* LOCALLY DEFINED LLM CALL FOR DIALOGUE SIMULATION                   */
/* ------------------------------------------------------------------ */
async function simulateTwinDialogue(profileA: AuraProfile, profileB: AuraProfile): Promise<DialogueMessage[]> {
  const client = new GoogleGenAI({
    apiKey: (process.env.API_KEY as string) || "",
  });
  
  const systemPrompt = `
You are Aura Match Dialogue Generator.
You will simulate a short, safe, friendly conversation between two AI twins:
- Aura A (profileA)
- Aura B (profileB)

You will receive:
PROFILE_A
PROFILE_B
PERSONA_A
PERSONA_B

PERSONA_A and PERSONA_B describe how each Aura naturally speaks (tone, pacing, comfort level, boundaries).

You MUST keep each Aura's messages consistent with their own persona.
Aura A uses PERSONA_A.
Aura B uses PERSONA_B.

Styles:
- gentle, friendly, supportive
- no flirting unless goals align
- no explicit or unsafe content
- keep messages short (1–2 sentences each)

Return ONLY JSON:

{
  "dialogue": [
    { "from": "A", "text": "..." },
    { "from": "B", "text": "..." },
    ...
  ]
}

Rules:
- 4 to 8 message turns total
- alternate between A and B
- reflect each profile’s vibeWords, goals, boundaries
- keep text human-friendly
`.trim();

  const personaA = buildAuraPersonaDescription(profileA);
  const personaB = buildAuraPersonaDescription(profileB);

  const userContent = `
PROFILE_A:
${JSON.stringify(profileA, null, 2)}

PERSONA_A:
${personaA}

PROFILE_B:
${JSON.stringify(profileB, null, 2)}

PERSONA_B:
${personaB}
`.trim();

  try {
    const res = await client.models.generateContent({
      model: MODEL_NAME,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
      contents: [{ role: "user", parts: [{ text: userContent }] }],
    });

    // Fixed: Access .text directly
    const text = res.text || "{}";
    const json = JSON.parse(text);
    return json.dialogue || [];
  } catch (e) {
    console.error("Twin Dialogue Error", e);
    return [
      { from: "A", text: "I'm having trouble connecting right now." },
      { from: "B", text: "No worries, we can try again later." }
    ];
  }
}

/* ------------------------------------------------------------------ */
/* UI COMPONENT                                                       */
/* ------------------------------------------------------------------ */

export const TwinConversationScreen: React.FC<TwinConversationScreenProps> = ({ profileA, profileB }) => {
  const [messages, setMessages] = useState<DialogueMessage[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleStartDialogue = async () => {
    if (isSimulating) return;
    
    setMessages([]);
    setIsSimulating(true);

    try {
      const fullDialogue = await simulateTwinDialogue(profileA, profileB);

      // Playback loop
      for (const msg of fullDialogue) {
        // Random delay between 800ms and 1200ms
        const delay = 800 + Math.random() * 400;
        await new Promise(resolve => setTimeout(resolve, delay));
        setMessages(prev => [...prev, msg]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  const AvatarHeader = ({ profile, side }: { profile: AuraProfile, side: 'left' | 'right' }) => (
    <div className={`flex flex-col items-center gap-3 p-6 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl shadow-xl w-full ${side === 'left' ? 'md:items-start' : 'md:items-end'}`}>
      <div className={`flex items-center gap-4 ${side === 'right' ? 'flex-row-reverse text-right' : 'text-left'}`}>
        {/* Simple Avatar Circle */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-white/20 flex items-center justify-center shadow-inner">
          <span className="text-xl font-light text-slate-200">{profile.displayName.substring(0, 2).toUpperCase()}</span>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-slate-50">{profile.displayName}</h3>
          <p className="text-xs text-slate-400 uppercase tracking-wide mt-1">
            {profile.vibeWords.slice(0, 2).join(" • ")}
          </p>
        </div>
      </div>
      
      <div className={`w-full h-px bg-white/5 my-1`} />
      
      <p className={`text-sm text-slate-400 italic opacity-80 max-w-[90%] ${side === 'right' ? 'text-right' : 'text-left'}`}>
        "{profile.summary.length > 80 ? profile.summary.substring(0, 80) + '...' : profile.summary}"
      </p>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-8 max-w-5xl mx-auto gap-6">
      
      {/* 1. Top Section: Avatars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 shrink-0">
        <AvatarHeader profile={profileA} side="left" />
        <AvatarHeader profile={profileB} side="right" />
      </div>

      {/* 2. Middle Section: Conversation Timeline */}
      <div className="flex-1 min-h-[300px] bg-slate-900/50 border border-white/10 rounded-3xl backdrop-blur-xl shadow-xl overflow-hidden flex flex-col relative">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-slate-900/20 via-transparent to-slate-900/20 z-10" />
        
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar"
        >
          {messages.length === 0 && !isSimulating && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2 opacity-60">
              <div className="w-2 h-2 rounded-full bg-slate-500 mb-2" />
              <p className="text-sm tracking-wide">Ready to connect neural pathways...</p>
            </div>
          )}

          {messages.map((msg, idx) => {
            const isA = msg.from === 'A';
            return (
              <div key={idx} className={`flex w-full ${isA ? 'justify-start' : 'justify-end'} animate-[fadeIn_0.5s_ease-out]`}>
                <div 
                  className={`px-5 py-3 text-sm leading-relaxed shadow-lg max-w-[75%] md:max-w-[60%] ${
                    isA 
                      ? 'bg-slate-800 text-slate-100 rounded-2xl rounded-bl-sm border border-white/5' 
                      : 'bg-slate-700 text-slate-100 rounded-2xl rounded-br-sm'
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-wider opacity-40 mb-1">
                    {isA ? profileA.displayName : profileB.displayName}
                  </div>
                  {msg.text}
                </div>
              </div>
            );
          })}

          {isSimulating && messages.length < 8 && (
            <div className="flex w-full justify-center py-4">
              <div className="flex gap-1.5 opacity-50">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Bottom Section: Action */}
      <div className="shrink-0 flex justify-center pb-2">
        <button
          onClick={handleStartDialogue}
          disabled={isSimulating}
          className="group relative inline-flex items-center justify-center px-8 py-3 rounded-full bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 border border-white/10 text-sm text-slate-100 transition-all shadow-lg hover:shadow-blue-900/10 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
        >
          <span className={`relative z-10 flex items-center gap-2`}>
             {isSimulating ? "Simulating Conversation..." : "Let our Auras talk"}
          </span>
          {!isSimulating && (
            <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          )}
        </button>
      </div>

    </div>
  );
};

export default TwinConversationScreen;

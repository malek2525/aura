import React, { useState } from "react";
import { AuraProfile, AuraState, AuraChatMessage } from "../types";
import { chatWithAura } from "../services/auraLLM";
import { LiveVoiceMode } from "../components/LiveVoiceMode";
import ChatWindow from "../components/ChatWindow";

interface NeuralLinkScreenProps {
  profile: AuraProfile;
  history: AuraChatMessage[];
  setHistory: React.Dispatch<React.SetStateAction<AuraChatMessage[]>>;
  auraState: AuraState;
  setAuraState: React.Dispatch<React.SetStateAction<AuraState>>;
  voice: any;
}

const NeuralLinkScreen: React.FC<NeuralLinkScreenProps> = ({
  profile,
  history,
  setHistory,
  auraState,
  setAuraState,
  voice,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(false);

  const handleSendMessage = async (text: string) => {
    const trimmed = text?.trim();
    if (!trimmed) return;

    const userMsg: AuraChatMessage = {
      id: Date.now().toString(),
      from: "user",
      text: trimmed,
      timestamp: Date.now(),
    };

    const newHistory = [...history, userMsg];
    setHistory(newHistory);
    setIsLoading(true);

    try {
      const { replyText, auraState: newAuraState } = await chatWithAura(
        profile,
        newHistory,
        trimmed,
      );

      setAuraState(newAuraState);

      const auraMsg: AuraChatMessage = {
        id: (Date.now() + 1).toString(),
        from: "aura",
        text: replyText,
        timestamp: Date.now(),
      };

      setHistory((prev) => [...prev, auraMsg]);
    } catch (e) {
      const auraMsg: AuraChatMessage = {
        id: (Date.now() + 1).toString(),
        from: "aura",
        text: "Something went wrong. Please try again.",
        timestamp: Date.now(),
      };
      setHistory((prev) => [...prev, auraMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 p-4 md:p-8 relative">
      {/* LIVE VOICE MODE OVERLAY */}
      {isLiveMode && (
        <LiveVoiceMode
          profile={profile}
          auraState={auraState}
          setAuraState={setAuraState}
          onExit={() => setIsLiveMode(false)}
          voice={voice}
        />
      )}

      {/* Left Column */}
      <div className="w-full md:w-1/3 h-[30vh] md:h-full flex flex-col gap-4">
        <div className="flex-1 rounded-3xl bg-slate-950/40 border border-white/10 backdrop-blur-xl flex items-center justify-center">
          <div className="text-center px-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 mx-auto mb-3 shadow-lg shadow-blue-500/20" />
            <div className="text-sm font-semibold text-slate-100">
              {profile.dating?.displayName || profile.displayName || "You"}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Aura mood: {auraState?.mood || "neutral"}
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsLiveMode(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white p-4 rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all"
        >
          <div className="w-6 h-6 rounded-full border border-white flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
          <span className="font-semibold">Start Voice Session</span>
        </button>
      </div>

      {/* Right Column: Chat Window */}
      <div className="w-full md:w-2/3 h-[55vh] md:h-full">
        <ChatWindow
          messages={history}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          title="Aura"
          subtitle="Neural Link"
        />
      </div>
    </div>
  );
};

export default NeuralLinkScreen;

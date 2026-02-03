import React, { useState, useEffect, useRef } from "react";
import { MePanel } from "../components/MePanel";

import ChatWindow from "../components/ProfileChips";
import { AuraProfile, AuraState, AuraChatMessage } from "../types";
import { chatWithAura } from "../services/auraLLM";
import { LiveVoiceMode } from "../components/LiveVoiceMode";

interface NeuralLinkScreenProps {
  profile: AuraProfile;
  history: AuraChatMessage[];
  setHistory: React.Dispatch<React.SetStateAction<AuraChatMessage[]>>;
  auraState: AuraState;
  setAuraState: React.Dispatch<React.SetStateAction<AuraState>>;
}

const NeuralLinkScreen: React.FC<NeuralLinkScreenProps> = ({
  profile,
  history,
  setHistory,
  auraState,
  setAuraState,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(false);

  const handleSendMessage = async (text: string) => {
    // 1. Add user message
    const userMsg: AuraChatMessage = {
      id: Date.now().toString(),
      from: "user",
      text: text,
      timestamp: Date.now(),
    };

    // Optimistic update
    const newHistory = [...history, userMsg];
    setHistory(newHistory);
    setIsLoading(true);

    // 2. Call LLM
    const { replyText, auraState: newAuraState } = await chatWithAura(
      profile,
      newHistory,
      text,
    );

    // 3. Update state
    setAuraState(newAuraState);

    // 4. Add Aura message
    const auraMsg: AuraChatMessage = {
      id: (Date.now() + 1).toString(),
      from: "aura",
      text: replyText,
      timestamp: Date.now(),
    };

    setHistory((prev) => [...prev, auraMsg]);
    setIsLoading(false);
  };

  // Dynamic style for Aura visual based on mood
  const getMoodColor = (mood: string) => {
    // Soft pastel palette mapping
    switch (mood) {
      case "happy":
        return "bg-amber-300/50 shadow-amber-300/30";
      case "excited":
        return "bg-orange-300/50 shadow-orange-300/30";
      case "anxious":
        return "bg-indigo-400/50 shadow-indigo-400/30";
      case "sad":
        return "bg-blue-400/50 shadow-blue-400/30";
      case "calm":
        return "bg-teal-300/50 shadow-teal-300/30";
      case "curious":
        return "bg-rose-300/50 shadow-rose-300/30";
      default:
        return "bg-slate-200/50 shadow-white/20";
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
        />
      )}

      {/* Left Column: Aura Card */}
      <div className="w-full md:w-1/3 h-[40vh] md:h-full flex flex-col gap-4">
        <div className="flex-1 relative">
          <AuraAvatarCard profile={profile} auraState={auraState} />
        </div>

        {/* Voice Mode Toggle */}
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
      <div className="w-full md:w-2/3 h-[50vh] md:h-full">
        <ChatWindow
          messages={history}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default NeuralLinkScreen;

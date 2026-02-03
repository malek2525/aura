import React, { useState } from "react";

import {
  AuraProfile,
  TwinChatResult,
  AuraMatchResult,
  TwinIntroResult,
} from "../types";

import { simulateTwinChat } from "../services/auraLLM";
import { ProfilePreviewPanel } from "../components/ProfilePreviewPanel";
import { buildAuraMatchResult, buildTwinIntro } from "../services/matching";

const TwinsPanel: React.FC<TwinsPanelProps> = ({ profile, sampleProfile }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [chatResult, setChatResult] = useState<TwinChatResult | null>(null);
  const [matchResult, setMatchResult] = useState<AuraMatchResult | null>(null);
  const [introResult, setIntroResult] = useState<TwinIntroResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // view-other-profile slide-over
  const [isOtherProfileOpen, setIsOtherProfileOpen] = useState(false);

  const handleSimulateChat = async () => {
    setIsLoading(true);
    setError(null);
    setChatResult(null);
    setMatchResult(null);
    setIntroResult(null);

    try {
      // LLM twin chat + local TS matching/intro
      const [chat, match, intro] = await Promise.all([
        simulateTwinChat(profile, sampleProfile),
        Promise.resolve(buildAuraMatchResult(profile, sampleProfile)),
        Promise.resolve(buildTwinIntro(profile, sampleProfile)),
      ]);

      setChatResult(chat);
      setMatchResult(match);
      setIntroResult(intro);
    } catch (err) {
      console.error("[TwinsPanel] Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getTop3Tags = (p: AuraProfile): string[] => {
    const tags = p.vibeWords || p.vibeTags || [];
    return tags.slice(0, 3);
  };

  return (
    <>
      <div className="h-full overflow-y-auto p-4 lg:p-5 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-white/5">
          <div className="w-2.5 h-2.5 rounded-full bg-violet-400 shadow-[0_0_10px] shadow-violet-400/80 animate-pulse" />
          <div>
            <h2 className="text-sm font-semibold text-white">
              Twin Connection
            </h2>
            <p className="text-[10px] text-slate-400 tracking-wide">
              Let your Auras meet and explore chemistry like real people
            </p>
          </div>
        </div>

        {/* Two profiles */}
        <div className="grid grid-cols-2 gap-4">
          {/* You */}
          <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-4 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                {profile.displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {profile.displayName}
                </p>
                <p className="text-[10px] text-slate-400">Your Aura</p>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed mb-3 line-clamp-2">
              {profile.summary ||
                "A thoughtful soul seeking genuine connections."}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {getTop3Tags(profile).map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-[9px] text-violet-300 uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Potential match */}
          <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-4 backdrop-blur-xl">
            <button
              type="button"
              onClick={() => setIsOtherProfileOpen(true)}
              className="flex items-center gap-3 mb-3 w-full text-left group"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center text-white text-sm font-bold shadow-[0_0_18px_rgba(244,114,182,0.6)] group-hover:scale-105 transition-transform">
                {sampleProfile.displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-white flex items-center gap-1.5">
                  {sampleProfile.displayName}
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/40 text-rose-200 uppercase tracking-[0.16em]">
                    View profile
                  </span>
                </p>
                <p className="text-[10px] text-slate-400">Potential Match</p>
              </div>
            </button>

            <p className="text-[11px] text-slate-300 leading-relaxed mb-3 line-clamp-2">
              {sampleProfile.summary ||
                "A curious introvert looking to connect."}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {getTop3Tags(sampleProfile).map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-full bg-pink-500/20 border border-pink-500/30 text-[9px] text-pink-300 uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CTA button */}
        {!chatResult && !isLoading && (
          <div className="flex justify-center pt-2">
            <button
              onClick={handleSimulateChat}
              disabled={isLoading}
              className="group relative px-8 py-3 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 text-white text-sm font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Let our Auras talk
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
            </button>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-violet-500/30 animate-ping absolute inset-0" />
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600/20 to-pink-600/20 border border-white/10 flex items-center justify-center">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" />
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-mono tracking-wide">
              Auras are having a private chat...
            </p>
            <p className="text-[10px] text-slate-500">
              They’re comparing vibes, interests, and boundaries for you.
            </p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-center">
            <p className="text-sm text-red-300">{error}</p>
            <button
              onClick={handleSimulateChat}
              className="mt-3 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 text-xs text-red-300 hover:bg-red-500/30 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results */}
        {chatResult && (
          <div className="space-y-4">
            {/* Aura conversation */}
            <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-4 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                  Aura Conversation
                </h3>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {chatResult.transcript.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${
                      msg.from === "auraA" ? "" : "flex-row-reverse"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        msg.from === "auraA"
                          ? "bg-gradient-to-br from-violet-600 to-blue-600 text-white"
                          : "bg-gradient-to-br from-pink-600 to-rose-600 text-white"
                      }`}
                    >
                      {msg.from === "auraA"
                        ? profile.displayName.charAt(0)
                        : sampleProfile.displayName.charAt(0)}
                    </div>
                    <div
                      className={`flex-1 rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                        msg.from === "auraA"
                          ? "bg-violet-500/10 border border-violet-500/20 text-violet-100"
                          : "bg-pink-500/10 border border-pink-500/20 text-pink-100"
                      }`}
                    >
                      <span className="text-[9px] font-mono text-slate-500 block mb-1">
                        {msg.from === "auraA"
                          ? `${profile.displayName}'s Aura`
                          : `${sampleProfile.displayName}'s Aura`}
                      </span>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compatibility insight */}
            <div className="rounded-2xl bg-gradient-to-br from-violet-600/10 via-purple-600/10 to-pink-600/10 border border-white/10 p-4 backdrop-blur-xl space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                  Compatibility Insight
                </h3>
              </div>

              {matchResult && (
                <>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-semibold text-white">
                      {matchResult.compatibilityScore}
                    </span>
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-300">
                      / 100 · {matchResult.matchLabel} Match
                    </span>
                  </div>

                  <p className="text-sm text-slate-200 leading-relaxed">
                    {matchResult.summary}
                  </p>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {matchResult.vibeDescription}
                  </p>

                  {matchResult.whyItWorks.length > 0 && (
                    <div className="mt-2">
                      <p className="text-[10px] font-semibold text-emerald-300 uppercase tracking-[0.16em] mb-1">
                        Why it works
                      </p>
                      <ul className="space-y-1">
                        {matchResult.whyItWorks.map((reason, i) => (
                          <li key={i} className="text-[11px] text-slate-200">
                            • {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {matchResult.watchOut.length > 0 && (
                    <div className="mt-2">
                      <p className="text-[10px] font-semibold text-amber-300 uppercase tracking-[0.16em] mb-1">
                        Watch out for
                      </p>
                      <ul className="space-y-1">
                        {matchResult.watchOut.map((risk, i) => (
                          <li key={i} className="text-[11px] text-slate-200">
                            • {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-3">
                    <p className="text-[10px] font-semibold text-sky-300 uppercase tracking-[0.16em] mb-1">
                      Suggested first message
                    </p>
                    <p className="text-[11px] text-slate-100 italic">
                      {matchResult.suggestedFirstMessage}
                    </p>
                  </div>
                </>
              )}

              {!matchResult && (
                <p className="text-sm text-slate-200 leading-relaxed">
                  {chatResult.summary}
                </p>
              )}
            </div>

            {/* Aura-to-Aura intro script */}
            {introResult && (
              <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-4 backdrop-blur-xl space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8h2a2 2 0 012 2v7a2 2 0 01-2 2h-2M7 8H5a2 2 0 00-2 2v7a2 2 0 002 2h2m10-9V7a2 2 0 00-2-2H9a2 2 0 00-2 2v3m10 0H7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                    Twin Intro
                  </h3>
                </div>

                <p className="text-[11px] text-slate-200 mb-2">
                  {introResult.introSummary}
                </p>

                <div className="space-y-1">
                  {introResult.auraToAuraScript.map((line, i) => (
                    <p key={i} className="text-[11px] text-slate-300 italic">
                      “{line}”
                    </p>
                  ))}
                </div>

                {introResult.suggestedOpeners.length > 0 && (
                  <div className="mt-2">
                    <p className="text-[10px] font-semibold text-sky-300 uppercase tracking-[0.16em] mb-1">
                      Human openers
                    </p>
                    <ul className="space-y-1">
                      {introResult.suggestedOpeners.map((line, i) => (
                        <li key={i} className="text-[11px] text-slate-100">
                          • {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Reset */}
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setChatResult(null);
                  setMatchResult(null);
                  setIntroResult(null);
                }}
                className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View OTHER profile slide-over */}
      <ProfilePreviewPanel
        profile={sampleProfile}
        isOpen={isOtherProfileOpen}
        onClose={() => setIsOtherProfileOpen(false)}
        title="Potential Match"
        subtitle="Aura’s read on this person"
      />
    </>
  );
};

export default TwinsPanel;

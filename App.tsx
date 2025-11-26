import React, { useState } from 'react';
import { AuraProfile, TwinIntroResult } from '../types';
import { demoProfiles } from '../services/demoProfiles';
import { generateTwinIntro } from '../services/auraLLM';

function MiniAuraCard({ profile, label }: { profile: AuraProfile; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-3xl bg-slate-900/80 border border-white/10 px-4 py-4">
      <div className="relative h-16 w-16 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center">
        {profile.avatarUrl ? (
          <img src={profile.avatarUrl} alt={profile.displayName} className="h-full w-full object-cover" />
        ) : (
          <span className="text-2xl">🟣</span>
        )}
      </div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className="text-sm font-semibold text-slate-100">{profile.displayName}</div>
      <p className="text-[11px] text-slate-300 text-center line-clamp-3">
        {profile.summary}
      </p>
    </div>
  );
}

const TwinIntroScreen: React.FC = () => {
  const [yourAura] = useState<AuraProfile>(demoProfiles[0]);
  const [selectedId, setSelectedId] = useState<string>(
    demoProfiles[1]?.id ?? ""
  );
  const [result, setResult] = useState<TwinIntroResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const potentialMatch = demoProfiles.find(p => p.id === selectedId) || null;

  const handleRunIntro = async () => {
    if (!potentialMatch) return;
    setIsLoading(true);
    try {
      const res = await generateTwinIntro(yourAura, potentialMatch);
      setResult(res);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex items-start justify-center">
      <div className="w-full max-w-5xl rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-2xl shadow-2xl p-6 lg:p-8 space-y-6">
        
        {/* Header */}
        <header className="flex flex-col gap-2">
          <div className="text-[11px] tracking-[0.3em] uppercase text-slate-500">
            Twin Intro Lab
          </div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-slate-50">
            Let your Auras break the ice
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Aura reads both profiles, imagines how your twins would talk, and hands you gentle, non-cringe first messages to start a real conversation.
          </p>
        </header>

        {/* Selector */}
        <div className="flex items-center gap-3 pt-2">
          <span className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
            Potential match
          </span>
          <select
            className="rounded-full bg-slate-950/70 border border-white/10 px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-slate-100/40"
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
          >
            {demoProfiles
              .filter(p => p.id !== yourAura.id)
              .map(p => (
                <option key={p.id} value={p.id}>
                  {p.displayName}
                </option>
              ))}
          </select>
        </div>

        {/* Mini cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4">
          <MiniAuraCard profile={yourAura} label="Your Aura" />
          {potentialMatch && <MiniAuraCard profile={potentialMatch} label="Their Aura" />}
        </div>

        {/* Button */}
        <div className="pt-4">
          <button
            onClick={handleRunIntro}
            disabled={!potentialMatch || isLoading}
            className="rounded-full px-6 py-2 text-sm font-medium bg-slate-100 text-slate-900 hover:bg-white disabled:opacity-60 transition-colors"
          >
            {isLoading ? "Asking your twins…" : "Let the Auras introduce you"}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-6 space-y-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
                Overview
              </div>
              <h2 className="text-xl font-semibold text-slate-50 mt-1">
                {result.title}
              </h2>
              <p className="mt-2 text-sm text-slate-200 max-w-2xl">
                {result.introSummary}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900/80 border border-white/10 p-4 space-y-2">
              <div className="text-[11px] uppercase tracking-[0.25em] text-slate-500 mb-1">
                How your Auras would talk
              </div>
              <div className="space-y-1 text-sm text-slate-100">
                {result.auraToAuraScript.map((line, idx) => (
                  <p key={idx} className="opacity-90">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900/80 border border-white/10 p-4 space-y-3">
              <div className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
                Gentle first messages you can send
              </div>
              <ul className="space-y-2 text-sm text-slate-100">
                {result.suggestedOpeners.map((msg, idx) => (
                  <li
                    key={idx}
                    className="rounded-2xl bg-slate-950/70 border border-white/5 px-3 py-2"
                  >
                    {msg}
                  </li>
                ))}
              </ul>
            </div>

            {result.safetyNotes && result.safetyNotes.length > 0 && (
              <div className="rounded-2xl bg-slate-950/80 border border-white/10 p-4">
                <div className="text-[11px] uppercase tracking-[0.25em] text-slate-500 mb-1">
                  Things to keep in mind
                </div>
                <ul className="list-disc list-inside text-[12px] text-slate-300 space-y-1">
                  {result.safetyNotes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TwinIntroScreen;

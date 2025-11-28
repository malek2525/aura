import React, { useState } from 'react';
import { AuraProfile, AuraState, TwinIntroResult } from '../types';
import { demoProfiles } from '../services/demoProfiles';
import { generateTwinIntro } from '../services/auraLLM';
import AuraAvatar from '../components/AuraAvatar';

const TwinIntroScreen: React.FC = () => {
  const [yourAura] = useState<AuraProfile>(demoProfiles[0]);
  const [selectedId, setSelectedId] = useState<string>(
    demoProfiles[1]?.id ?? ""
  );
  const [result, setResult] = useState<TwinIntroResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const potentialMatch = demoProfiles.find(p => p.id === selectedId) || null;

  const yourAuraState: AuraState = { mood: 'calm', moodIntensity: 0.5 };
  const theirAuraState: AuraState = { mood: 'happy', moodIntensity: 0.6 };

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

        {/* Two Living Avatars Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
          
          {/* Your Aura */}
          <div className="rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl p-6 flex flex-col items-center">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-4">Your Aura</div>
            
            <AuraAvatar
              profile={yourAura}
              auraState={yourAuraState}
              size="md"
              showName={true}
              showVibes={true}
              showMood={false}
            />
            
            <p className="text-[11px] text-slate-300 text-center mt-4 line-clamp-3 max-w-xs">
              {yourAura.summary}
            </p>
          </div>

          {/* Their Aura */}
          {potentialMatch && (
            <div className="rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl p-6 flex flex-col items-center">
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-4">Their Aura</div>
              
              <AuraAvatar
                profile={potentialMatch}
                auraState={theirAuraState}
                size="md"
                showName={true}
                showVibes={true}
                showMood={false}
              />
              
              <p className="text-[11px] text-slate-300 text-center mt-4 line-clamp-3 max-w-xs">
                {potentialMatch.summary}
              </p>
            </div>
          )}
        </div>

        {/* Button */}
        <div className="pt-4 flex justify-center">
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
          <div className="mt-6 space-y-4 animate-fade-in">
            <div>
              <div className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
                What your twins noticed
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

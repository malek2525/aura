import React, { useState } from 'react';
import { AuraProfile, TwinChatResult, TwinChatMessage } from '../../types';
import { simulateTwinChat } from '../../services/auraLLM';

interface TwinsPanelProps {
  profile: AuraProfile;
  sampleProfile: AuraProfile;
}

const TwinsPanel: React.FC<TwinsPanelProps> = ({ profile, sampleProfile }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [chatResult, setChatResult] = useState<TwinChatResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSimulateChat = async () => {
    setIsLoading(true);
    setError(null);
    setChatResult(null);

    try {
      const result = await simulateTwinChat(profile, sampleProfile);
      setChatResult(result);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('[TwinsPanel] Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getTop3Tags = (p: AuraProfile): string[] => {
    const tags = p.vibeWords || p.vibeTags || [];
    return tags.slice(0, 3);
  };

  return (
    <div className="h-full overflow-y-auto p-4 lg:p-5 space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-white/5">
        <div className="w-2.5 h-2.5 rounded-full bg-violet-400 shadow-[0_0_10px] shadow-violet-400/80 animate-pulse" />
        <div>
          <h2 className="text-sm font-semibold text-white">Twin Connection</h2>
          <p className="text-[10px] text-slate-400 tracking-wide">
            Let your Auras meet and discover compatibility
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-4 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
              {profile.displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{profile.displayName}</p>
              <p className="text-[10px] text-slate-400">Your Aura</p>
            </div>
          </div>
          
          <p className="text-[11px] text-slate-300 leading-relaxed mb-3 line-clamp-2">
            {profile.summary || 'A thoughtful soul seeking genuine connections.'}
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

        <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-4 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center text-white text-sm font-bold">
              {sampleProfile.displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{sampleProfile.displayName}</p>
              <p className="text-[10px] text-slate-400">Potential Match</p>
            </div>
          </div>
          
          <p className="text-[11px] text-slate-300 leading-relaxed mb-3 line-clamp-2">
            {sampleProfile.summary || 'A curious introvert looking to connect.'}
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

      {!chatResult && !isLoading && (
        <div className="flex justify-center pt-2">
          <button
            onClick={handleSimulateChat}
            disabled={isLoading}
            className="group relative px-8 py-3 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 text-white text-sm font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Let our Auras talk
            </span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
          </button>
        </div>
      )}

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
          <p className="text-xs text-slate-400 font-mono tracking-wide">Auras are connecting...</p>
          <p className="text-[10px] text-slate-500">This may take a moment</p>
        </div>
      )}

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

      {chatResult && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-4 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Aura Conversation</h3>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {chatResult.transcript.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${msg.from === 'auraA' ? '' : 'flex-row-reverse'}`}
                >
                  <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    msg.from === 'auraA'
                      ? 'bg-gradient-to-br from-violet-600 to-blue-600 text-white'
                      : 'bg-gradient-to-br from-pink-600 to-rose-600 text-white'
                  }`}>
                    {msg.from === 'auraA' ? profile.displayName.charAt(0) : sampleProfile.displayName.charAt(0)}
                  </div>
                  <div className={`flex-1 rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                    msg.from === 'auraA'
                      ? 'bg-violet-500/10 border border-violet-500/20 text-violet-100'
                      : 'bg-pink-500/10 border border-pink-500/20 text-pink-100'
                  }`}>
                    <span className="text-[9px] font-mono text-slate-500 block mb-1">
                      {msg.from === 'auraA' ? `${profile.displayName}'s Aura` : `${sampleProfile.displayName}'s Aura`}
                    </span>
                    "{msg.text}"
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-violet-600/10 via-purple-600/10 to-pink-600/10 border border-white/10 p-4 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Compatibility Insight</h3>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              {chatResult.summary}
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setChatResult(null)}
              className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/10 hover:border-white/20 transition-all"
            >
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TwinsPanel;

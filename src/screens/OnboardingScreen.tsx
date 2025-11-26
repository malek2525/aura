import React, { useState } from 'react';
import { buildAuraProfile, OnboardingAnswers } from '../services/auraLLM';
import { AuraProfile } from '../types';

export interface OnboardingScreenProps {
  onComplete: (profile: AuraProfile) => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<OnboardingAnswers>({
    displayName: '',
    ageRange: '',
    country: '',
    introversionLevel: 5,
    goals: '',
    topicsLike: '',
    topicsAvoid: '',
    vibeWords: '',
    socialSpeed: 'normal',
    hardBoundaries: '',
    greenFlags: '',
    redFlags: '',
    whatShouldPeopleKnow: '',
    whatFeelsSafe: ''
  });

  const handleChange = (field: keyof OnboardingAnswers, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.displayName.trim()) {
      setError("Please enter a name.");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const profile = await buildAuraProfile(formData);
      onComplete(profile);
    } catch (err) {
      console.error(err);
      setError("Failed to create Aura. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100 p-4 md:p-8 flex items-center justify-center font-sans">
      <div className="max-w-3xl w-full bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 bg-white/5">
          <h1 className="text-2xl font-light tracking-wide text-white">Initialize Aura Twin</h1>
          <p className="text-slate-400 text-sm mt-2">Define your resonance pattern to create a digital reflection.</p>
        </div>

        {/* Scrollable Form Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          
          {/* Section: Identity */}
          <section className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-4">Identity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-slate-400 ml-1">Display Name</label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => handleChange('displayName', e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/20 transition-all"
                  placeholder="How should we call you?"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-slate-400 ml-1">Age Range</label>
                <input
                  type="text"
                  value={formData.ageRange || ''}
                  onChange={(e) => handleChange('ageRange', e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400/50 transition-all"
                  placeholder="e.g. 20-25"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-400 ml-1">Country / Region</label>
              <input
                type="text"
                value={formData.country || ''}
                onChange={(e) => handleChange('country', e.target.value)}
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400/50 transition-all"
                placeholder="e.g. Canada"
              />
            </div>
          </section>

          <div className="h-px bg-white/5 w-full" />

          {/* Section: Social Battery */}
          <section className="space-y-6">
            <h3 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-4">Social Resonance</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs text-slate-400 ml-1">Introversion Level</label>
                <span className="text-blue-300 font-mono text-sm">{formData.introversionLevel}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.introversionLevel}
                onChange={(e) => handleChange('introversionLevel', parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 uppercase tracking-wider">
                <span>Social Butterfly</span>
                <span>Deep Introvert</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 ml-1">Social Speed</label>
              <div className="grid grid-cols-3 gap-3">
                {(['slow', 'normal', 'fast'] as const).map((speed) => (
                  <button
                    key={speed}
                    onClick={() => handleChange('socialSpeed', speed)}
                    className={`py-3 rounded-xl text-sm border transition-all ${
                      formData.socialSpeed === speed
                        ? 'bg-blue-500/20 border-blue-400/50 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                        : 'bg-slate-950/30 border-white/5 text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    {speed.charAt(0).toUpperCase() + speed.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <div className="h-px bg-white/5 w-full" />

          {/* Section: Vibe & Goals */}
          <section className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-4">Personality Matrix</h3>
            <div className="space-y-2">
              <label className="text-xs text-slate-400 ml-1">Vibe Words</label>
              <input
                type="text"
                value={formData.vibeWords}
                onChange={(e) => handleChange('vibeWords', e.target.value)}
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400/50 transition-all"
                placeholder="e.g. Calm, sarcastic, dreamy, intense"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-400 ml-1">Social Goals</label>
              <textarea
                value={formData.goals}
                onChange={(e) => handleChange('goals', e.target.value)}
                rows={2}
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400/50 transition-all resize-none"
                placeholder="What are you looking for? (Friends, dating practice, venting...)"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                <label className="text-xs text-slate-400 ml-1">Topics You Like</label>
                <textarea
                  value={formData.topicsLike}
                  onChange={(e) => handleChange('topicsLike', e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400/50 transition-all resize-none"
                  placeholder="Sci-fi, Cats, Coding..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-slate-400 ml-1">Topics You Avoid</label>
                <textarea
                  value={formData.topicsAvoid}
                  onChange={(e) => handleChange('topicsAvoid', e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400/50 transition-all resize-none"
                  placeholder="Politics, Horror..."
                />
              </div>
            </div>
          </section>

          <div className="h-px bg-white/5 w-full" />

          {/* Section: Safety & Boundaries */}
          <section className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-4">Safety Protocols</h3>
            
            <div className="space-y-2">
              <label className="text-xs text-slate-400 ml-1">Hard Boundaries (Never)</label>
              <input
                type="text"
                value={formData.hardBoundaries}
                onChange={(e) => handleChange('hardBoundaries', e.target.value)}
                className="w-full bg-slate-950/50 border border-red-900/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500/50 transition-all"
                placeholder="e.g. No voice calls, no explicit content"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-slate-400 ml-1">Green Flags</label>
                <textarea
                  value={formData.greenFlags}
                  onChange={(e) => handleChange('greenFlags', e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950/50 border border-green-900/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500/50 transition-all resize-none"
                  placeholder="Kindness, patience..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-slate-400 ml-1">Red Flags</label>
                <textarea
                  value={formData.redFlags}
                  onChange={(e) => handleChange('redFlags', e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950/50 border border-red-900/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500/50 transition-all resize-none"
                  placeholder="Pushy behavior, rudeness..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 ml-1">What feels safe to you?</label>
              <textarea
                value={formData.whatFeelsSafe}
                onChange={(e) => handleChange('whatFeelsSafe', e.target.value)}
                rows={2}
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400/50 transition-all resize-none"
                placeholder="Taking things slow, clear communication..."
              />
            </div>
             <div className="space-y-2">
              <label className="text-xs text-slate-400 ml-1">What should people know about you?</label>
              <textarea
                value={formData.whatShouldPeopleKnow}
                onChange={(e) => handleChange('whatShouldPeopleKnow', e.target.value)}
                rows={2}
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400/50 transition-all resize-none"
                placeholder="I might take a while to reply..."
              />
            </div>
          </section>

        </div>

        {/* Footer Action */}
        <div className="p-6 border-t border-white/5 bg-slate-900/80 backdrop-blur">
          {error && <p className="text-red-400 text-xs text-center mb-3">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-100 font-medium py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="animate-pulse">Synthesizing Aura...</span>
            ) : (
              <>Activate Aura Twin <span className="text-lg">→</span></>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default OnboardingScreen;

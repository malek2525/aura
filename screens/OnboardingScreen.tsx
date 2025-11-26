import React, { useState } from 'react';
import { buildAuraProfile, OnboardingAnswers } from '../services/auraLLM';
import { AuraProfile } from '../types';

interface OnboardingScreenProps {
  onProfileCreated: (profile: AuraProfile) => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onProfileCreated }) => {
  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  
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

  const handleInputChange = (field: keyof OnboardingAnswers, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const finishOnboarding = async () => {
    setIsGenerating(true);
    try {
      const profile = await buildAuraProfile(formData);
      onProfileCreated(profile);
    } catch (e) {
      console.error(e);
      alert("Failed to build profile. Please try again.");
      setIsGenerating(false);
    }
  };

  const steps = [
    {
      id: 'basics',
      title: 'Identity',
      description: 'Let\'s start with the basics.',
      content: (
        <div className="space-y-5">
          <div>
            <label className="block text-sm text-slate-400 mb-2">What should we call you?</label>
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
              placeholder="Name or Nickname"
              value={formData.displayName}
              onChange={(e) => handleInputChange('displayName', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Age Range</label>
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
              placeholder="e.g. 20-25"
              value={formData.ageRange || ''}
              onChange={(e) => handleInputChange('ageRange', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Country / Region</label>
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
              placeholder="e.g. Japan"
              value={formData.country || ''}
              onChange={(e) => handleInputChange('country', e.target.value)}
            />
          </div>
        </div>
      )
    },
    {
      id: 'social',
      title: 'Social Battery',
      description: 'How do you process social energy?',
      content: (
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-3">
              <label className="text-sm text-slate-400">Introversion Level (1-10)</label>
              <span className="text-violet-400 font-mono font-medium">{formData.introversionLevel}</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={formData.introversionLevel}
              onChange={(e) => handleInputChange('introversionLevel', parseInt(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>Extroverted</span>
              <span>Very Introverted</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-slate-400 mb-3">Social Speed</label>
            <div className="flex gap-2">
              {(['slow', 'normal', 'fast'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => handleInputChange('socialSpeed', s)}
                  className={`flex-1 py-3 rounded-xl capitalize text-sm font-medium transition-all ${
                    formData.socialSpeed === s 
                      ? 'bg-violet-600/40 border border-violet-500/50 text-violet-200' 
                      : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Vibe Words</label>
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
              placeholder="e.g. calm, playful, sarcastic, deep"
              value={formData.vibeWords}
              onChange={(e) => handleInputChange('vibeWords', e.target.value)}
            />
          </div>
        </div>
      )
    },
    {
      id: 'interests',
      title: 'Interests & Goals',
      description: 'What connects you to others?',
      content: (
        <div className="space-y-5">
           <div>
            <label className="block text-sm text-slate-400 mb-2">Your Social Goals</label>
            <textarea 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all h-24 resize-none"
              placeholder="e.g. Make friends, practice dating, just venting..."
              value={formData.goals}
              onChange={(e) => handleInputChange('goals', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Topics You Love</label>
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
              placeholder="e.g. Scifi, Coding, Cats"
              value={formData.topicsLike}
              onChange={(e) => handleInputChange('topicsLike', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Topics You Avoid</label>
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
              placeholder="e.g. Politics, Horror"
              value={formData.topicsAvoid}
              onChange={(e) => handleInputChange('topicsAvoid', e.target.value)}
            />
          </div>
        </div>
      )
    },
    {
      id: 'boundaries',
      title: 'Safety & Boundaries',
      description: 'How can Aura protect you?',
      content: (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm text-teal-400 mb-2">Green Flags</label>
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all"
                placeholder="Kindness, etc."
                value={formData.greenFlags}
                onChange={(e) => handleInputChange('greenFlags', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-rose-400 mb-2">Red Flags</label>
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/30 transition-all"
                placeholder="Rudeness, etc."
                value={formData.redFlags}
                onChange={(e) => handleInputChange('redFlags', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Hard Boundaries (Never)</label>
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
              placeholder="e.g. No explicit content, No voice calls"
              value={formData.hardBoundaries}
              onChange={(e) => handleInputChange('hardBoundaries', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">What makes you feel safe?</label>
             <input 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
              placeholder="e.g. Taking things slow"
              value={formData.whatFeelsSafe}
              onChange={(e) => handleInputChange('whatFeelsSafe', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">What should people know?</label>
             <input 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
              placeholder="e.g. I'm shy at first but open up later."
              value={formData.whatShouldPeopleKnow}
              onChange={(e) => handleInputChange('whatShouldPeopleKnow', e.target.value)}
            />
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      finishOnboarding();
    }
  };

  const isStepValid = () => {
    switch(step) {
      case 0: return !!formData.displayName;
      case 1: return true;
      case 2: return !!formData.goals;
      case 3: return true;
      default: return true;
    }
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-8">
        <div className="relative mb-10">
          <div className="w-32 h-32 bg-gradient-to-br from-violet-500/40 to-blue-500/30 rounded-full blur-2xl animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-violet-500/60 to-blue-500/40 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-slate-100 mb-3">Weaving your Aura...</h2>
        <p className="text-slate-400">Analyzing your social resonance patterns.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto h-screen flex flex-col p-6">
      <div className="flex space-x-2 mb-8 justify-center pt-8">
        {steps.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1.5 rounded-full transition-all duration-500 ${
              idx === step 
                ? 'w-10 bg-violet-500' 
                : idx < step 
                  ? 'w-3 bg-violet-900/60' 
                  : 'w-3 bg-white/10'
            }`} 
          />
        ))}
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-slate-100 mb-2">
          {currentStepData.title}
        </h1>
        <p className="text-slate-400">{currentStepData.description}</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
        {currentStepData.content}
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t border-white/5">
        <button 
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="px-6 py-3 rounded-xl text-slate-400 hover:text-slate-200 disabled:opacity-0 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!isStepValid()}
          className="bg-violet-600/40 hover:bg-violet-600/60 border border-violet-500/30 text-violet-100 px-8 py-3 rounded-xl font-medium shadow-lg shadow-violet-900/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {step === steps.length - 1 ? 'Create Aura' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default OnboardingScreen;

import React, { useState } from 'react';
import { buildAuraProfile, OnboardingAnswers } from '../services/auraLLM';
import { AuraProfile } from '../types';

interface OnboardingScreenProps {
  onProfileCreated: (profile: AuraProfile) => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onProfileCreated }) => {
  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Initial state matches OnboardingAnswers structure
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
      description: 'Let’s start with the basics.',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-aura-muted mb-1">What should we call you?</label>
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-aura-accent outline-none"
              placeholder="Name or Nickname"
              value={formData.displayName}
              onChange={(e) => handleInputChange('displayName', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-aura-muted mb-1">Age Range</label>
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-aura-accent outline-none"
              placeholder="e.g. 20-25"
              value={formData.ageRange || ''}
              onChange={(e) => handleInputChange('ageRange', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-aura-muted mb-1">Country / Region</label>
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-aura-accent outline-none"
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
            <div className="flex justify-between mb-2">
              <label className="text-sm text-aura-muted">Introversion Level (1-10)</label>
              <span className="text-aura-accent font-bold">{formData.introversionLevel}</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={formData.introversionLevel}
              onChange={(e) => handleInputChange('introversionLevel', parseInt(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-aura-accent"
            />
            <div className="flex justify-between text-xs text-aura-muted mt-1">
              <span>Extroverted</span>
              <span>Recluse</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-aura-muted mb-2">Social Speed</label>
            <div className="flex gap-2">
              {(['slow', 'normal', 'fast'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => handleInputChange('socialSpeed', s)}
                  className={`flex-1 py-3 rounded-lg capitalize border transition-all ${
                    formData.socialSpeed === s 
                      ? 'bg-aura-accent border-aura-accent text-white' 
                      : 'bg-white/5 border-white/10 text-aura-muted hover:bg-white/10'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-aura-muted mb-1">Vibe Words</label>
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-aura-accent outline-none"
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
        <div className="space-y-4">
           <div>
            <label className="block text-sm text-aura-muted mb-1">Your Social Goals</label>
            <textarea 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-aura-accent outline-none h-20 resize-none"
              placeholder="e.g. Make friends, practice dating, just venting..."
              value={formData.goals}
              onChange={(e) => handleInputChange('goals', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-aura-muted mb-1">Topics You Love</label>
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-aura-accent outline-none"
              placeholder="e.g. Scifi, Coding, Cats"
              value={formData.topicsLike}
              onChange={(e) => handleInputChange('topicsLike', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-aura-muted mb-1">Topics You Avoid</label>
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-aura-accent outline-none"
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
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm text-green-400 mb-1">Green Flags</label>
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-green-400 outline-none"
                placeholder="Kindness, etc."
                value={formData.greenFlags}
                onChange={(e) => handleInputChange('greenFlags', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-red-400 mb-1">Red Flags</label>
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-red-400 outline-none"
                placeholder="Rudeness, etc."
                value={formData.redFlags}
                onChange={(e) => handleInputChange('redFlags', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-aura-muted mb-1">Hard Boundaries (Never)</label>
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-aura-accent outline-none"
              placeholder="e.g. No explicit content, No voice calls"
              value={formData.hardBoundaries}
              onChange={(e) => handleInputChange('hardBoundaries', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-aura-muted mb-1">What makes you feel safe?</label>
             <input 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-aura-accent outline-none"
              placeholder="e.g. Taking things slow"
              value={formData.whatFeelsSafe}
              onChange={(e) => handleInputChange('whatFeelsSafe', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-aura-muted mb-1">What should people know?</label>
             <input 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-aura-accent outline-none"
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
      case 1: return true; // defaults are set
      case 2: return !!formData.goals;
      case 3: return true; // optional
      default: return true;
    }
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-pulse">
        <div className="w-24 h-24 bg-aura-accent rounded-full blur-xl mb-8" />
        <h2 className="text-2xl font-bold text-white mb-2">Weaving your Aura...</h2>
        <p className="text-aura-muted">Analyzing your social resonance patterns.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto h-full flex flex-col p-6">
      {/* Progress */}
      <div className="flex space-x-2 mb-8 justify-center">
        {steps.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1.5 rounded-full transition-all duration-300 ${idx === step ? 'w-8 bg-aura-accent' : idx < step ? 'w-2 bg-purple-900' : 'w-2 bg-white/10'}`} 
          />
        ))}
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 mb-2">
          {currentStepData.title}
        </h1>
        <p className="text-aura-muted">{currentStepData.description}</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {currentStepData.content}
      </div>

      <div className="flex justify-between mt-8 pt-4 border-t border-white/5">
        <button 
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="px-6 py-3 rounded-lg text-aura-muted hover:text-white disabled:opacity-0 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!isStepValid()}
          className="bg-aura-accent hover:bg-violet-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-purple-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {step === steps.length - 1 ? 'Create Aura' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default OnboardingScreen;

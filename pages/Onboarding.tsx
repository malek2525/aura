import React, { useState } from "react";
import { Icons } from "../components/Icons";
import { compressImage } from "../utils/image";
import {
  UserProfile,
  Gender,
  RelationshipIntent,
  SmokingHabit,
  DrinkingHabit,
  MatchGenderPreference,
  AuraPersonality,
  SocialSpeed
} from "../types";

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const splitList = (val: string) => val.split(',').map(s => s.trim()).filter(Boolean);

// Available options
const VIBE_OPTIONS = ["Chill", "Adventurous", "Nerdy", "Creative", "Ambitious", "Cozy", "Spontaneous", "Laid-back", "Romantic", "Funny", "Deep", "Outgoing"];
const INTEREST_OPTIONS = ["Coffee", "Travel", "Gaming", "Reading", "Music", "Art", "Fitness", "Cooking", "Movies", "Hiking", "Photography", "Tech", "Fashion", "Food", "Dancing", "Yoga"];

type Step = 'welcome' | 'basics' | 'photo' | 'vibe' | 'personality' | 'intent' | 'preview';

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<Step>('welcome');
  
  // Identity
  const [displayName, setDisplayName] = useState("");
  const [age, setAge] = useState<number>(25);
  const [job, setJob] = useState("");
  const [location, setLocation] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  
  // Photos
  const [photoUrl, setPhotoUrl] = useState("");

  // Aura / Personality
  const [introversion, setIntroversion] = useState(5);
  const [socialSpeed, setSocialSpeed] = useState<SocialSpeed>('normal');
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [writingStyle, setWritingStyle] = useState<AuraPersonality['writingStyle']>('casual_emoji');
  
  // Lifestyle
  const [smoking, setSmoking] = useState<SmokingHabit>("no");
  const [drinking, setDrinking] = useState<DrinkingHabit>("sometimes");

  // Preferences
  const [intent, setIntent] = useState<RelationshipIntent>("serious_relationship");
  const [matchGender, setMatchGender] = useState<MatchGenderPreference>("any");

  // Steps config
  const steps: Step[] = ['welcome', 'basics', 'photo', 'vibe', 'personality', 'intent', 'preview'];
  const currentStepIndex = steps.indexOf(step);
  const progress = ((currentStepIndex) / (steps.length - 1)) * 100;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const compressed = await compressImage(file, 600, 0.7);
        setPhotoUrl(compressed);
      } catch (err) {
        console.error("Image compression failed", err);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const toggleVibe = (vibe: string) => {
    if (selectedVibes.includes(vibe)) {
      setSelectedVibes(prev => prev.filter(v => v !== vibe));
    } else if (selectedVibes.length < 5) {
      setSelectedVibes(prev => [...prev, vibe]);
    }
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(prev => prev.filter(i => i !== interest));
    } else if (selectedInterests.length < 6) {
      setSelectedInterests(prev => [...prev, interest]);
    }
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 'basics':
        return !!displayName && age >= 18 && !!gender;
      case 'photo':
        return !!photoUrl;
      case 'vibe':
        return selectedVibes.length >= 2 && selectedInterests.length >= 3;
      case 'personality':
        return true;
      case 'intent':
        return !!intent;
      default:
        return true;
    }
  };

  const nextStep = () => {
    const idx = steps.indexOf(step);
    if (idx < steps.length - 1) {
      setStep(steps[idx + 1]);
    }
  };

  const prevStep = () => {
    const idx = steps.indexOf(step);
    if (idx > 0) {
      setStep(steps[idx - 1]);
    }
  };

  const handleSubmit = () => {
    const newProfile: UserProfile = {
      id: `user_${Date.now()}`,
      userId: `user_${Date.now()}`,
      name: displayName,
      displayName: displayName,
      age: age,
      job: job || "Mystery",
      location: location || "Somewhere",
      distance: 0,
      verified: false,
      verificationScore: 50,
      verificationTier: 'Bronze',
      bio: bio,
      photos: [photoUrl],
      interests: selectedInterests,
      vibeTags: selectedVibes,
      vibeWords: selectedVibes,
      auraRead: "Your aura is forming...",
      stories: [],
      prompts: [],
      details: {
        height: "",
        education: "",
        exercise: "",
        drinking: drinking,
        smoking: smoking,
        lookingFor: intent === 'serious_relationship' ? 'Relationship' : 'Casual',
        starSign: "",
        languages: []
      },
      introversionLevel: introversion,
      socialSpeed: socialSpeed,
      goals: [intent],
      aura: {
        introversionLevel: introversion,
        vibeWords: selectedVibes,
        goals: [intent],
        topicsLike: selectedInterests,
        topicsAvoid: [],
        hardBoundaries: [],
        greenFlags: [],
        redFlags: [],
        whatFeelsSafe: "",
        whatShouldPeopleKnow: bio,
        summary: bio,
        socialSpeed: socialSpeed,
        writingStyle: writingStyle
      },
      dating: {
        displayName,
        dateOfBirth: `${2024 - age}-01-01`,
        photos: [{ id: '1', url: photoUrl, isPrimary: true }],
        relationshipIntent: intent,
        gender: gender as Gender,
        interests: selectedInterests,
      },
      preferences: {
        preferredGenders: matchGender,
        minAge: 18,
        maxAge: 99,
        relationshipIntent: intent
      }
    };
    onComplete(newProfile);
  };

  return (
    <div className="h-full bg-warm-white flex flex-col relative overflow-hidden">
      
      {/* Progress Bar */}
      {step !== 'welcome' && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-warm-gray z-50">
          <div 
            className="h-full bg-coral transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Header */}
      {step !== 'welcome' && (
        <div className="bg-white px-4 py-3 flex items-center border-b border-warm-gray sticky top-0 z-40">
          <button 
            onClick={prevStep}
            className="p-2 -ml-2 hover:bg-warm-white rounded-full text-text-sec"
          >
            <Icons.ChevronLeft size={24} />
          </button>
          <div className="flex-1 text-center">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Step {currentStepIndex} of {steps.length - 2}
            </span>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        
        {/* Welcome Screen */}
        {step === 'welcome' && (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-coral to-gold rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Icons.Sparkles size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-text-main mb-2">welcome to aura</h1>
            <p className="text-text-sec mb-8 max-w-[280px]">
              lets set up your profile so your AI twin can find your perfect match ✨
            </p>
            <button 
              onClick={nextStep}
              className="px-12 py-4 bg-coral text-white font-bold rounded-2xl shadow-lg shadow-coral/30 hover:scale-105 active:scale-95 transition-transform"
            >
              lets go!
            </button>
            <p className="text-xs text-text-muted mt-6">takes about 2 mins</p>
          </div>
        )}

        {/* Basics */}
        {step === 'basics' && (
          <div className="p-6 space-y-6 animate-in slide-in-from-right-4">
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-text-main mb-1">the basics</h2>
              <p className="text-sm text-text-sec">tell us a lil about yourself</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-text-main">whats your name? *</label>
              <input 
                value={displayName} 
                onChange={e => setDisplayName(e.target.value)} 
                className="w-full bg-white border border-warm-gray rounded-2xl px-4 py-4 text-base focus:border-coral outline-none transition-colors" 
                placeholder="first name is fine"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-main">age *</label>
                <input 
                  type="number" 
                  value={age} 
                  onChange={e => setAge(parseInt(e.target.value) || 18)} 
                  min={18}
                  max={100}
                  className="w-full bg-white border border-warm-gray rounded-2xl px-4 py-4 text-base focus:border-coral outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-main">gender *</label>
                <select 
                  value={gender} 
                  onChange={e => setGender(e.target.value as Gender)} 
                  className="w-full bg-white border border-warm-gray rounded-2xl px-4 py-4 text-base focus:border-coral outline-none appearance-none"
                >
                  <option value="">select</option>
                  <option value="woman">Woman</option>
                  <option value="man">Man</option>
                  <option value="non_binary">Non-binary</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-text-main">what do you do?</label>
              <input 
                value={job} 
                onChange={e => setJob(e.target.value)} 
                className="w-full bg-white border border-warm-gray rounded-2xl px-4 py-4 text-base focus:border-coral outline-none" 
                placeholder="e.g. designer, student, mystery..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-text-main">where are you?</label>
              <input 
                value={location} 
                onChange={e => setLocation(e.target.value)} 
                className="w-full bg-white border border-warm-gray rounded-2xl px-4 py-4 text-base focus:border-coral outline-none" 
                placeholder="city or general area"
              />
            </div>
          </div>
        )}

        {/* Photo */}
        {step === 'photo' && (
          <div className="p-6 animate-in slide-in-from-right-4">
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-text-main mb-1">show yourself</h2>
              <p className="text-sm text-text-sec">add a photo so people know its really you</p>
            </div>
            
            <div 
              onClick={() => document.getElementById('photo-upload')?.click()}
              className="aspect-[3/4] bg-white border-2 border-dashed border-warm-gray rounded-3xl flex flex-col items-center justify-center relative overflow-hidden cursor-pointer hover:border-coral hover:bg-coral-light/5 transition-all"
            >
              {photoUrl ? (
                <>
                  <img src={photoUrl} className="w-full h-full object-cover" alt="" />
                  <button 
                    onClick={(e) => { e.stopPropagation(); setPhotoUrl(""); }} 
                    className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
                  >
                    <Icons.X size={18}/>
                  </button>
                  <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-2xl p-3 text-center">
                    <span className="text-white text-sm font-bold">looking good! ✨</span>
                  </div>
                </>
              ) : (
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-coral-light/50 rounded-full flex items-center justify-center text-coral mx-auto mb-4">
                    <Icons.Camera size={28} />
                  </div>
                  <p className="text-base font-bold text-text-main mb-1">tap to add photo</p>
                  <p className="text-xs text-text-sec">make it a good one 😎</p>
                </div>
              )}
            </div>
            <input 
              id="photo-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handlePhotoUpload} 
            />

            <div className="mt-6 bg-warm-white rounded-2xl p-4">
              <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">photo tips</h4>
              <ul className="space-y-1 text-xs text-text-sec">
                <li>✓ clear face shot works best</li>
                <li>✓ good lighting = more matches</li>
                <li>✓ smile! people love that</li>
                <li>✗ no group photos for main pic</li>
              </ul>
            </div>
          </div>
        )}

        {/* Vibe & Interests */}
        {step === 'vibe' && (
          <div className="p-6 animate-in slide-in-from-right-4">
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-text-main mb-1">your vibe</h2>
              <p className="text-sm text-text-sec">this helps your aura find compatible matches</p>
            </div>

            {/* Vibe Words */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-text-main">pick your vibes</label>
                <span className="text-xs text-coral font-bold">{selectedVibes.length}/5</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {VIBE_OPTIONS.map(vibe => (
                  <button
                    key={vibe}
                    onClick={() => toggleVibe(vibe)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                      selectedVibes.includes(vibe)
                        ? 'bg-coral text-white scale-105'
                        : 'bg-white border border-warm-gray text-text-sec hover:border-coral'
                    }`}
                  >
                    {vibe}
                  </button>
                ))}
              </div>
              {selectedVibes.length < 2 && (
                <p className="text-xs text-coral mt-2">pick at least 2</p>
              )}
            </div>

            {/* Interests */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-text-main">things you love</label>
                <span className="text-xs text-coral font-bold">{selectedInterests.length}/6</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map(interest => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                      selectedInterests.includes(interest)
                        ? 'bg-text-main text-white scale-105'
                        : 'bg-white border border-warm-gray text-text-sec hover:border-text-main'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
              {selectedInterests.length < 3 && (
                <p className="text-xs text-coral mt-2">pick at least 3</p>
              )}
            </div>
          </div>
        )}

        {/* Personality */}
        {step === 'personality' && (
          <div className="p-6 space-y-6 animate-in slide-in-from-right-4">
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-text-main mb-1">train your aura</h2>
              <p className="text-sm text-text-sec">help your AI twin understand you better</p>
            </div>

            {/* Introversion Slider */}
            <div className="bg-white rounded-2xl p-5 border border-warm-gray">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-text-main">social energy</label>
                <span className="text-sm text-coral font-bold">{introversion}/10</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={introversion} 
                onChange={e => setIntroversion(parseInt(e.target.value))} 
                className="w-full accent-coral h-2 rounded-full" 
              />
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-text-muted">super social 🎉</span>
                <span className="text-[10px] text-text-muted">homebody 🏠</span>
              </div>
            </div>

            {/* Social Speed */}
            <div>
              <label className="text-sm font-bold text-text-main mb-3 block">how fast do you like to move?</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'slow', label: 'Slow', desc: 'take it easy' },
                  { id: 'normal', label: 'Medium', desc: 'go with flow' },
                  { id: 'fast', label: 'Fast', desc: 'lets do this' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setSocialSpeed(opt.id as SocialSpeed)}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      socialSpeed === opt.id 
                        ? 'bg-coral/10 border-coral' 
                        : 'bg-white border-warm-gray hover:border-coral/50'
                    }`}
                  >
                    <span className="block text-sm font-bold text-text-main">{opt.label}</span>
                    <span className="text-[10px] text-text-sec">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Writing Style */}
            <div>
              <label className="text-sm font-bold text-text-main mb-3 block">how do you text?</label>
              <div className="space-y-2">
                {[
                  { id: 'casual_emoji', label: "heyy! 👋 whats up", desc: "casual + emojis" },
                  { id: 'lowercase_aesthetic', label: "hey, how are u", desc: "lowercase vibes" },
                  { id: 'formal_proper', label: "Hello! How are you?", desc: "proper grammar" },
                  { id: 'short_direct', label: "Hey. Good.", desc: "short & direct" }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setWritingStyle(opt.id as AuraPersonality['writingStyle'])}
                    className={`w-full p-4 rounded-2xl border text-left transition-all ${
                      writingStyle === opt.id 
                        ? 'bg-coral/10 border-coral' 
                        : 'bg-white border-warm-gray hover:border-coral/50'
                    }`}
                  >
                    <span className="block text-sm font-bold text-text-main">"{opt.label}"</span>
                    <span className="text-[10px] text-text-sec">{opt.desc}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-text-muted mt-2">your aura will text like this</p>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-text-main">quick bio (optional)</label>
              <textarea 
                value={bio} 
                onChange={e => setBio(e.target.value)} 
                rows={3} 
                maxLength={150}
                className="w-full bg-white border border-warm-gray rounded-2xl px-4 py-3 text-sm focus:border-coral outline-none resize-none" 
                placeholder="anything else people should know..."
              />
              <p className="text-[10px] text-text-muted text-right">{bio.length}/150</p>
            </div>
          </div>
        )}

        {/* Intent */}
        {step === 'intent' && (
          <div className="p-6 space-y-6 animate-in slide-in-from-right-4">
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-text-main mb-1">what are you looking for?</h2>
              <p className="text-sm text-text-sec">no wrong answers here</p>
            </div>

            {/* Relationship Intent */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'serious_relationship', label: 'Something Real', emoji: '❤️', desc: 'long term' },
                { id: 'casual_dating', label: 'Casual', emoji: '✨', desc: 'keep it light' },
                { id: 'friends_only', label: 'Friends', emoji: '👋', desc: 'just vibes' },
                { id: 'open_to_see', label: 'Not Sure', emoji: '🤷', desc: 'see what happens' }
              ].map(opt => (
                <button 
                  key={opt.id} 
                  onClick={() => setIntent(opt.id as RelationshipIntent)}
                  className={`p-5 rounded-2xl border text-center transition-all ${
                    intent === opt.id 
                      ? 'bg-coral text-white border-coral scale-[1.02]' 
                      : 'bg-white border-warm-gray text-text-main hover:border-coral/50'
                  }`}
                >
                  <span className="text-2xl mb-2 block">{opt.emoji}</span>
                  <span className="block text-sm font-bold">{opt.label}</span>
                  <span className={`text-[10px] ${intent === opt.id ? 'text-white/80' : 'text-text-sec'}`}>
                    {opt.desc}
                  </span>
                </button>
              ))}
            </div>

            {/* Gender Preference */}
            <div className="mt-8">
              <label className="text-sm font-bold text-text-main mb-3 block">interested in...</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'women', label: 'Women' },
                  { id: 'men', label: 'Men' },
                  { id: 'women_and_men', label: 'Both' },
                  { id: 'any', label: 'Everyone' }
                ].map(opt => (
                  <button 
                    key={opt.id}
                    onClick={() => setMatchGender(opt.id as MatchGenderPreference)}
                    className={`px-5 py-3 rounded-2xl text-sm font-bold border transition-all ${
                      matchGender === opt.id 
                        ? 'bg-text-main text-white border-text-main' 
                        : 'bg-white border-warm-gray text-text-sec hover:border-text-main'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Preview */}
        {step === 'preview' && (
          <div className="p-6 animate-in slide-in-from-right-4">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-extrabold text-text-main mb-1">youre all set! 🎉</h2>
              <p className="text-sm text-text-sec">heres how your profile looks</p>
            </div>

            {/* Profile Preview Card */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-warm-gray mb-6">
              <div className="aspect-[3/4] relative">
                <img src={photoUrl} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-2xl font-extrabold text-white mb-1">
                    {displayName}, {age}
                  </h3>
                  {job && (
                    <p className="text-white/80 text-sm mb-3">{job}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {selectedVibes.slice(0, 3).map(vibe => (
                      <span 
                        key={vibe}
                        className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full"
                      >
                        {vibe}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {bio && (
                <div className="p-4 border-t border-warm-gray">
                  <p className="text-sm text-text-main">{bio}</p>
                </div>
              )}
            </div>

            {/* Aura Summary */}
            <div className="bg-gradient-to-r from-coral/10 to-gold/10 rounded-2xl p-4 border border-coral/20">
              <div className="flex items-center gap-2 mb-2">
                <Icons.Sparkles size={16} className="text-coral" />
                <span className="text-xs font-bold text-coral uppercase">your aura is ready</span>
              </div>
              <p className="text-sm text-text-main">
                your AI twin will chat {writingStyle === 'casual_emoji' ? 'with emojis' : writingStyle === 'lowercase_aesthetic' ? 'in lowercase' : 'properly'}, 
                move {socialSpeed === 'slow' ? 'slowly' : socialSpeed === 'fast' ? 'quickly' : 'at a normal pace'}, 
                and find people who love {selectedInterests.slice(0, 2).join(' and ')}.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Button */}
      {step !== 'welcome' && (
        <div className="p-4 bg-white border-t border-warm-gray">
          <button 
            onClick={step === 'preview' ? handleSubmit : nextStep}
            disabled={!canProceed()}
            className="w-full py-4 bg-coral text-white font-bold rounded-2xl shadow-lg shadow-coral/30 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98]"
          >
            {step === 'preview' ? "start matching! ✨" : "continue"}
          </button>
        </div>
      )}
    </div>
  );
};
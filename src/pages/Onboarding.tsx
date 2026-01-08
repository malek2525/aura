import React, { useState } from "react";
import { Icons } from "../components/Icons";
import {
  UserProfile,
  Gender,
  SexualOrientation,
  RelationshipIntent,
  SmokingHabit,
  DrinkingHabit,
  KidsPreference,
  SleepSchedule,
  SocialSpeed,
  MatchGenderPreference
} from "../types";

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const splitList = (val: string) => val.split(',').map(s => s.trim()).filter(Boolean);

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
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
  const [vibeWords, setVibeWords] = useState("");
  const [interests, setInterests] = useState("");
  const [bio, setBio] = useState("");
  
  // Lifestyle
  const [smoking, setSmoking] = useState<SmokingHabit>("no");
  const [drinking, setDrinking] = useState<DrinkingHabit>("sometimes");

  // Preferences
  const [intent, setIntent] = useState<RelationshipIntent>("serious_relationship");
  const [matchGender, setMatchGender] = useState<MatchGenderPreference>("any");

  const handleSubmit = () => {
    if(!displayName || !photoUrl) {
       alert("Please add a name and a photo URL");
       return;
    }

    const newProfile: UserProfile = {
      id: "user_new",
      userId: "user_123",
      name: displayName,
      displayName: displayName,
      age: age,
      job: job || "Undisclosed",
      location: location || "Unknown",
      distance: 0,
      verified: false,
      verificationScore: 50,
      verificationTier: 'Bronze',
      bio: bio,
      photos: [photoUrl], // In real app, array of photos
      interests: splitList(interests),
      vibeTags: splitList(vibeWords),
      vibeWords: splitList(vibeWords),
      auraRead: "Your aura is forming...", // Placeholder
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
      // Deep structure
      aura: {
         introversionLevel: introversion,
         vibeWords: splitList(vibeWords),
         goals: [],
         topicsLike: [],
         topicsAvoid: [],
         hardBoundaries: [],
         greenFlags: [],
         redFlags: [],
         whatFeelsSafe: "",
         whatShouldPeopleKnow: bio,
         summary: bio,
         socialSpeed: 'normal'
      },
      dating: {
         displayName,
         dateOfBirth: "2000-01-01",
         photos: [{ id: '1', url: photoUrl, isPrimary: true }],
         relationshipIntent: intent,
         gender: gender as Gender,
         interests: splitList(interests),
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
    <div className="h-full bg-warm-white flex flex-col">
      <div className="bg-white px-6 py-4 flex items-center border-b border-warm-gray sticky top-0 z-10">
        <h1 className="text-xl font-extrabold text-text-main">Create Profile</h1>
        <div className="ml-auto w-8 h-8 rounded-full bg-coral-light flex items-center justify-center text-coral font-bold text-xs">1/1</div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-24 space-y-8 no-scrollbar">
        
        {/* Section 1: The Basics */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider">The Basics</h2>
          
          <div className="space-y-1">
             <label className="text-sm font-bold text-text-main">Display Name</label>
             <input value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full bg-white border border-warm-gray rounded-xl px-4 py-3 text-sm focus:border-coral outline-none" placeholder="e.g. Alex" />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-sm font-bold text-text-main">Age</label>
                <input type="number" value={age} onChange={e => setAge(parseInt(e.target.value))} className="w-full bg-white border border-warm-gray rounded-xl px-4 py-3 text-sm focus:border-coral outline-none" />
             </div>
             <div className="space-y-1">
                <label className="text-sm font-bold text-text-main">Gender</label>
                <select value={gender} onChange={e => setGender(e.target.value as Gender)} className="w-full bg-white border border-warm-gray rounded-xl px-4 py-3 text-sm focus:border-coral outline-none">
                   <option value="">Select...</option>
                   <option value="woman">Woman</option>
                   <option value="man">Man</option>
                   <option value="non_binary">Non-binary</option>
                </select>
             </div>
          </div>

          <div className="space-y-1">
             <label className="text-sm font-bold text-text-main">Job Title</label>
             <input value={job} onChange={e => setJob(e.target.value)} className="w-full bg-white border border-warm-gray rounded-xl px-4 py-3 text-sm focus:border-coral outline-none" placeholder="e.g. Artist" />
          </div>

          <div className="space-y-1">
             <label className="text-sm font-bold text-text-main">Location</label>
             <input value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-white border border-warm-gray rounded-xl px-4 py-3 text-sm focus:border-coral outline-none" placeholder="e.g. Berlin" />
          </div>
        </section>

        {/* Section 2: Photos */}
        <section className="space-y-4">
           <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider">Main Photo</h2>
           <div className="aspect-[3/4] bg-white border-2 border-dashed border-warm-gray rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
              {photoUrl ? (
                <>
                   <img src={photoUrl} className="w-full h-full object-cover" />
                   <button onClick={() => setPhotoUrl("")} className="absolute top-2 right-2 bg-black/50 p-2 rounded-full text-white"><Icons.X size={16}/></button>
                </>
              ) : (
                <div className="text-center p-4">
                   <div className="w-12 h-12 bg-coral-light rounded-full flex items-center justify-center text-coral mx-auto mb-2">
                      <Icons.ImagePlus size={24} />
                   </div>
                   <p className="text-sm text-text-sec">Paste URL below for demo</p>
                </div>
              )}
           </div>
           <input value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} className="w-full bg-white border border-warm-gray rounded-xl px-4 py-2 text-xs focus:border-coral outline-none" placeholder="https://..." />
        </section>

        {/* Section 3: Aura & Personality */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider">Aura & Vibe</h2>
          
          <div className="space-y-2">
             <div className="flex justify-between">
                <label className="text-sm font-bold text-text-main">Introversion Level</label>
                <span className="text-sm text-coral font-bold">{introversion}/10</span>
             </div>
             <input type="range" min="1" max="10" value={introversion} onChange={e => setIntroversion(parseInt(e.target.value))} className="w-full accent-coral" />
             <p className="text-xs text-text-muted">Higher means you need more alone time.</p>
          </div>

          <div className="space-y-1">
             <label className="text-sm font-bold text-text-main">Vibe Words (Comma separated)</label>
             <input value={vibeWords} onChange={e => setVibeWords(e.target.value)} className="w-full bg-white border border-warm-gray rounded-xl px-4 py-3 text-sm focus:border-coral outline-none" placeholder="chill, nerd, cozy..." />
          </div>

          <div className="space-y-1">
             <label className="text-sm font-bold text-text-main">Interests</label>
             <input value={interests} onChange={e => setInterests(e.target.value)} className="w-full bg-white border border-warm-gray rounded-xl px-4 py-3 text-sm focus:border-coral outline-none" placeholder="gaming, hiking, coffee..." />
          </div>

          <div className="space-y-1">
             <label className="text-sm font-bold text-text-main">Bio</label>
             <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full bg-white border border-warm-gray rounded-xl px-4 py-3 text-sm focus:border-coral outline-none resize-none" placeholder="Tell us a bit about yourself..." />
          </div>
        </section>

        {/* Section 4: Intent */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider">Intentions</h2>
          
          <div className="space-y-2">
             <label className="text-sm font-bold text-text-main">I am looking for...</label>
             <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'casual_dating', label: 'Casual' },
                  { id: 'serious_relationship', label: 'Serious' },
                  { id: 'friends_only', label: 'Friends' },
                  { id: 'open_to_see', label: 'Not Sure' }
                ].map((opt) => (
                   <button 
                     key={opt.id} 
                     onClick={() => setIntent(opt.id as RelationshipIntent)}
                     className={`py-3 rounded-xl text-sm font-medium border transition-colors ${intent === opt.id ? 'bg-coral text-white border-coral' : 'bg-white border-warm-gray text-text-sec hover:border-coral'}`}
                   >
                     {opt.label}
                   </button>
                ))}
             </div>
          </div>

          <div className="space-y-2">
             <label className="text-sm font-bold text-text-main">Interested in...</label>
             <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
               {['women', 'men', 'women_and_men', 'any'].map(opt => (
                 <button 
                   key={opt}
                   onClick={() => setMatchGender(opt as MatchGenderPreference)}
                   className={`px-4 py-2 rounded-full text-xs font-bold border whitespace-nowrap ${matchGender === opt ? 'bg-text-main text-white border-text-main' : 'bg-white border-warm-gray text-text-sec'}`}
                 >
                   {opt === 'any' ? 'Everyone' : opt.replace(/_/g, ' & ')}
                 </button>
               ))}
             </div>
          </div>
        </section>

      </div>

      <div className="p-4 bg-white border-t border-warm-gray">
         <button onClick={handleSubmit} className="w-full py-4 bg-coral text-white font-bold rounded-2xl shadow-lg shadow-coral/30 hover:bg-coral-dark transition-colors">
            Complete Profile
         </button>
      </div>
    </div>
  );
};
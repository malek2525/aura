import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { UserProfile, RelationshipIntent, MatchGenderPreference } from '../types';

interface EditProfileProps {
  onBack: () => void;
  currentUser?: UserProfile; // Optional for mock
}

const MOCK_USER: UserProfile = {
    id: 'me', name: 'Abdulmalek', age: 28, bio: "Big fan of football.", job: 'Founder', location: 'Budapest', distance: 0, verified: true,
    photos: ['https://picsum.photos/400/600?random=100', 'https://picsum.photos/400/600?random=101'],
    auraRead: "Thoughtful introvert.", vibeTags: ['Calm'], verificationScore: 82, verificationTier: 'Gold', stories: [], interests: ['Gym'],
    prompts: [], details: { height: '185cm', exercise: 'Active', education: 'Masters', drinking: 'Socially', smoking: 'No', lookingFor: 'Relationship', starSign: 'Leo', languages: ['English'] }
};

export const EditProfile: React.FC<EditProfileProps> = ({ onBack, currentUser = MOCK_USER }) => {
  // State from User's Logic
  const [bio, setBio] = useState(currentUser.bio || "");
  const [job, setJob] = useState(currentUser.job || "");
  const [interests, setInterests] = useState(currentUser.interests.join(", "));
  const [vibeWords, setVibeWords] = useState(currentUser.vibeTags.join(", "));
  const [intent, setIntent] = useState<RelationshipIntent>(currentUser.relationshipIntent || "serious_relationship");
  
  // New Fields from merged logic
  const [greenFlags, setGreenFlags] = useState(currentUser.aura?.greenFlags?.join(", ") || "");
  const [redFlags, setRedFlags] = useState(currentUser.aura?.redFlags?.join(", ") || "");
  const [idealDate, setIdealDate] = useState(currentUser.dating?.idealFirstMeeting || "");

  const handleSave = () => {
     // In a real app, this would dispatch an update
     console.log("Saving...", { bio, job, interests, vibeWords, intent });
     onBack();
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center border-b border-warm-gray sticky top-0 z-10">
        <button onClick={onBack} className="p-2 -ml-2 text-text-sec hover:bg-warm-white rounded-full">
          <Icons.ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-text-main mr-8">Edit Profile</h1>
        <button onClick={handleSave} className="text-coral font-semibold text-sm">Done</button>
      </div>

      <div className="overflow-y-auto p-4 pb-24 space-y-8 no-scrollbar">
        
        {/* Photos Grid (Visual only for now) */}
        <section>
          <div className="flex justify-between items-end mb-3">
            <h2 className="text-sm font-bold text-text-main">Photos & Videos</h2>
            <span className="text-xs text-text-muted">Tap to edit</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
             {currentUser.photos.map((url, i) => (
               <div key={i} className="aspect-[2/3] relative rounded-xl overflow-hidden bg-warm-gray group">
                 <img src={url} className="w-full h-full object-cover" alt="Me" />
                 <button className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white hover:bg-coral transition-colors">
                   <Icons.X size={12} />
                 </button>
                 {i === 0 && <span className="absolute bottom-2 left-2 bg-white/90 px-2 py-0.5 rounded text-[10px] font-bold text-text-main shadow-sm">Main</span>}
               </div>
             ))}
             <button className="aspect-[2/3] rounded-xl border-2 border-dashed border-warm-gray flex flex-col items-center justify-center gap-2 text-coral hover:bg-coral-light/20 hover:border-coral transition-colors">
                <Icons.Plus size={24} />
             </button>
          </div>
        </section>

        {/* Bio */}
        <section>
          <h2 className="text-sm font-bold text-text-main mb-2">Bio</h2>
          <textarea 
            className="w-full text-sm text-text-main bg-warm-white border border-warm-gray rounded-2xl p-4 resize-none outline-none focus:border-coral min-h-[100px]"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
          />
          <button className="mt-2 w-full py-2 bg-gradient-to-r from-coral-light to-white border border-coral/20 rounded-xl flex items-center justify-center gap-2 text-coral text-sm font-semibold hover:shadow-sm transition-all">
             <Icons.Sparkles size={16} />
             Let Aura refine this
          </button>
        </section>

        {/* Identity & Work */}
        <section className="space-y-4">
           <h2 className="text-sm font-bold text-text-main">Essentials</h2>
           <div className="space-y-3">
              <div className="space-y-1">
                 <label className="text-xs font-bold text-text-sec">Job Title</label>
                 <input value={job} onChange={e => setJob(e.target.value)} className="w-full bg-warm-white border border-warm-gray rounded-xl px-4 py-3 text-sm focus:border-coral outline-none" />
              </div>
              <div className="space-y-1">
                 <label className="text-xs font-bold text-text-sec">Interests (Comma separated)</label>
                 <input value={interests} onChange={e => setInterests(e.target.value)} className="w-full bg-warm-white border border-warm-gray rounded-xl px-4 py-3 text-sm focus:border-coral outline-none" />
              </div>
              <div className="space-y-1">
                 <label className="text-xs font-bold text-text-sec">Vibe Words</label>
                 <input value={vibeWords} onChange={e => setVibeWords(e.target.value)} className="w-full bg-warm-white border border-warm-gray rounded-xl px-4 py-3 text-sm focus:border-coral outline-none" />
              </div>
           </div>
        </section>

        {/* Aura Safety Fields (New) */}
        <section className="bg-sage-light/20 p-4 rounded-2xl border border-sage/20">
           <div className="flex items-center gap-2 mb-3">
              <Icons.ShieldCheck size={16} className="text-sage-dark" />
              <h2 className="text-sm font-bold text-sage-dark">Safety & Boundaries</h2>
           </div>
           
           <div className="space-y-3">
              <div className="space-y-1">
                 <label className="text-xs font-bold text-text-sec">Green Flags</label>
                 <input value={greenFlags} onChange={e => setGreenFlags(e.target.value)} className="w-full bg-white border border-warm-gray rounded-xl px-4 py-3 text-sm focus:border-sage outline-none" placeholder="kindness, honesty..." />
              </div>
              <div className="space-y-1">
                 <label className="text-xs font-bold text-text-sec">Red Flags / Boundaries</label>
                 <input value={redFlags} onChange={e => setRedFlags(e.target.value)} className="w-full bg-white border border-warm-gray rounded-xl px-4 py-3 text-sm focus:border-sage outline-none" placeholder="ghosting, rudeness..." />
              </div>
           </div>
        </section>

        {/* Intent */}
        <section>
          <h2 className="text-sm font-bold text-text-main mb-3">Intentions</h2>
          <div className="grid grid-cols-2 gap-2">
             {['casual_dating', 'serious_relationship', 'friends_only', 'open_to_see'].map((opt) => (
                <button 
                  key={opt}
                  onClick={() => setIntent(opt as RelationshipIntent)}
                  className={`py-3 rounded-xl text-xs font-bold border transition-colors ${intent === opt ? 'bg-text-main text-white border-text-main' : 'bg-warm-white border-warm-gray text-text-sec'}`}
                >
                  {opt.replace('_', ' ').toUpperCase()}
                </button>
             ))}
          </div>
        </section>

      </div>
    </div>
  );
};

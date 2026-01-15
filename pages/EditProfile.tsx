
import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { UserProfile, RelationshipIntent } from '../types';
import { compressImage } from '../utils/image';

interface EditProfileProps {
  onBack: () => void;
  currentUser: UserProfile;
  onSave: (updatedProfile: Partial<UserProfile>) => void;
}

export const EditProfile: React.FC<EditProfileProps> = ({ onBack, currentUser, onSave }) => {
  const [photos, setPhotos] = useState<string[]>(currentUser.photos || []);
  const [bio, setBio] = useState(currentUser.bio || "");
  const [job, setJob] = useState(currentUser.job || "");
  const [interests, setInterests] = useState(currentUser.interests.join(", "));
  const [vibeWords, setVibeWords] = useState(currentUser.vibeTags.join(", "));
  const [intent, setIntent] = useState<RelationshipIntent>(currentUser.relationshipIntent || "serious_relationship");
  
  const [greenFlags, setGreenFlags] = useState(currentUser.aura?.greenFlags?.join(", ") || "");
  const [redFlags, setRedFlags] = useState(currentUser.aura?.redFlags?.join(", ") || "");

  const handleSave = () => {
     onSave({
         photos,
         bio,
         job,
         interests: interests.split(',').map(s => s.trim()).filter(Boolean),
         vibeTags: vibeWords.split(',').map(s => s.trim()).filter(Boolean),
         relationshipIntent: intent,
         aura: {
             ...currentUser.aura,
             greenFlags: greenFlags.split(',').map(s => s.trim()).filter(Boolean),
             redFlags: redFlags.split(',').map(s => s.trim()).filter(Boolean),
             // Keeping standard defaults for required fields if missing
             introversionLevel: currentUser.aura?.introversionLevel || 5,
             socialSpeed: currentUser.aura?.socialSpeed || 'normal',
             goals: currentUser.aura?.goals || [],
             topicsLike: currentUser.aura?.topicsLike || [],
             topicsAvoid: currentUser.aura?.topicsAvoid || [],
             hardBoundaries: currentUser.aura?.hardBoundaries || [],
             summary: currentUser.aura?.summary || "",
             vibeWords: vibeWords.split(',').map(s => s.trim()).filter(Boolean)
         }
     });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files && e.target.files[0]) {
       const file = e.target.files[0];
       try {
         const newUrl = await compressImage(file, 600, 0.7); // Compress to max 600px width, 0.7 quality
         setPhotos([...photos, newUrl]);
       } catch (error) {
         console.error("Failed to compress image", error);
       }
     }
  };

  const removePhoto = (index: number) => {
      const newPhotos = [...photos];
      newPhotos.splice(index, 1);
      setPhotos(newPhotos);
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center border-b border-warm-gray sticky top-0 z-10">
        <button onClick={onBack} className="p-2 -ml-2 text-text-sec hover:bg-warm-white rounded-full">
          <Icons.ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-text-main mr-8">Edit Profile</h1>
        <button onClick={handleSave} className="text-coral font-semibold text-sm">Save</button>
      </div>

      <div className="overflow-y-auto p-4 pb-24 space-y-8 no-scrollbar">
        
        {/* Photos Grid */}
        <section>
          <div className="flex justify-between items-end mb-3">
            <h2 className="text-sm font-bold text-text-main">Photos & Videos</h2>
            <span className="text-xs text-text-muted">Tap delete to remove</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
             {photos.map((url, i) => (
               <div key={i} className="aspect-[2/3] relative rounded-xl overflow-hidden bg-warm-gray group">
                 <img src={url} className="w-full h-full object-cover" alt="Me" />
                 <button 
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 bg-black/50 p-1.5 rounded-full text-white hover:bg-red-500 transition-colors backdrop-blur-sm"
                 >
                   <Icons.X size={10} />
                 </button>
                 {i === 0 && <span className="absolute bottom-2 left-2 bg-white/90 px-2 py-0.5 rounded text-[10px] font-bold text-text-main shadow-sm">Main</span>}
               </div>
             ))}
             
             {/* Add Photo Button */}
             <button 
                onClick={() => document.getElementById('edit-profile-upload')?.click()}
                className="aspect-[2/3] rounded-xl border-2 border-dashed border-warm-gray flex flex-col items-center justify-center gap-2 text-coral hover:bg-coral-light/20 hover:border-coral transition-colors"
             >
                <Icons.Plus size={24} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Add</span>
             </button>
             <input 
                id="edit-profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
             />
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

        {/* Aura Safety Fields */}
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

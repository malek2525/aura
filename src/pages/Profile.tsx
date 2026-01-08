import React from 'react';
import { Icons } from '../components/Icons';
import { UserProfile, createEmptyProfile } from '../types';

interface ProfileProps {
  user?: UserProfile;
  onBack: () => void;
  onLike?: () => void;
  onPass?: () => void;
  onSuperLike?: () => void;
  isOwnProfile?: boolean;
}

const MOCK_SELF_PREVIEW: UserProfile = {
  id: 'me',
  name: 'User',
  age: 28,
  bio: "Big fan of football, travel, and a good cup of coffee. Let's find the best brunch spot in the city.",
  job: 'Founder',
  location: 'Budapest',
  distance: 0,
  verified: true,
  photos: ['https://picsum.photos/400/600?random=100', 'https://picsum.photos/400/600?random=101'],
  auraRead: "You're a thoughtful introvert who values authentic connections over small talk.",
  vibeTags: ['Thoughtful', 'Calm', 'Creative'],
  verificationScore: 82,
  verificationTier: 'Gold',
  stories: [],
  interests: ['Gym', 'Design', 'Travel'],
  prompts: [{ question: "The quickest way to my heart is...", answer: "Remembering the small things I mention." }],
  details: { 
    height: '185cm', 
    exercise: 'Active', 
    education: 'Masters', 
    drinking: 'Socially', 
    smoking: 'No', 
    lookingFor: 'Relationship', 
    starSign: 'Leo', 
    languages: ['English', 'Hungarian'] 
  }
};

export const Profile: React.FC<ProfileProps> = ({ 
  user = MOCK_SELF_PREVIEW, 
  onBack,
  onLike,
  onPass,
  onSuperLike,
  isOwnProfile = false
}) => {
  return (
    <div className="h-full bg-white flex flex-col relative overflow-hidden">
      
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center text-white drop-shadow-md pointer-events-none">
        <button 
          onClick={onBack} 
          className="p-2 bg-black/20 backdrop-blur-md rounded-full hover:bg-black/30 transition-colors pointer-events-auto"
        >
          <Icons.ChevronLeft size={24} />
        </button>
        <button className="p-2 bg-black/20 backdrop-blur-md rounded-full hover:bg-black/30 transition-colors pointer-events-auto">
          <Icons.Share size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar bg-white pb-24">
        {/* Cover Photo */}
        <div className="h-[550px] w-full relative bg-warm-gray">
          <img 
            src={user.photos[0]} 
            className="w-full h-full object-cover" 
            alt={user.name} 
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-24 text-white">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{user.name}, {user.age}</h1>
              {user.verified && <Icons.ShieldCheck className="text-success fill-success/20" size={24} />}
            </div>
            <p className="text-sm text-gray-200 mt-1 flex items-center gap-1">
              <Icons.MapPin size={14} /> {user.location} • {user.distance} km away
            </p>
          </div>
        </div>

        <div className="p-6 space-y-8">
          
          {/* Aura's Read */}
          <section className="bg-gradient-to-br from-coral-light to-warm-white p-5 rounded-2xl border border-coral/20 shadow-sm transform -translate-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Icons.Sparkles size={16} className="text-coral" />
              <h3 className="text-xs font-bold text-coral uppercase tracking-widest">Aura's Read</h3>
            </div>
            <p className="text-text-main italic text-lg leading-relaxed mb-4">
              "{user.auraRead}"
            </p>
            <div className="flex flex-wrap gap-2">
              {user.vibeTags.map((tag, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1 bg-white border border-warm-gray rounded-full text-xs text-text-sec font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>

          {/* Verification Score */}
          <section className="bg-white border border-warm-gray p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-text-main">Verification Score</h3>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-text-main">{user.verificationScore}</span>
                <span className="bg-gold/20 text-yellow-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                  {user.verificationTier}
                </span>
              </div>
            </div>
            <div className="h-2 w-full bg-warm-gray rounded-full mb-3 overflow-hidden">
              <div 
                className="h-full bg-gold rounded-full" 
                style={{ width: `${user.verificationScore}%` }}
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-text-sec">
              <Icons.Check size={16} className="text-success" /> Verified photo
            </div>
          </section>

          {/* Bio */}
          <section>
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">Bio</h3>
            <p className="text-text-main leading-relaxed text-lg">{user.bio}</p>
          </section>

          {/* Photo 2 */}
          {user.photos[1] && (
            <div className="w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-sm">
              <img src={user.photos[1]} className="w-full h-full object-cover" alt="Photo 2" />
            </div>
          )}

          {/* About */}
          <section>
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-3">About {user.name}</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Icons.Ruler, val: user.details.height },
                { icon: Icons.Briefcase, val: user.job },
                { icon: Icons.GraduationCap, val: user.details.education },
                { icon: Icons.Wine, val: user.details.drinking },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-warm-white rounded-xl border border-warm-gray">
                  <item.icon size={16} className="text-text-muted" />
                  <span className="text-sm text-text-main font-medium">{item.val}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Prompts */}
          {user.prompts.map((prompt, i) => (
            <section key={i} className="bg-warm-white p-6 rounded-3xl border border-warm-gray relative">
              <div className="absolute -top-3 left-6 bg-white px-2 text-xs font-bold text-coral">
                {prompt.question}
              </div>
              <p className="text-lg font-medium text-text-main">{prompt.answer}</p>
            </section>
          ))}

          {/* Languages */}
          <section>
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">Languages</h3>
            <div className="flex flex-wrap gap-2">
              {user.details.languages.map((l, i) => (
                <span 
                  key={i} 
                  className="text-sm text-text-sec px-3 py-1 bg-warm-white rounded-lg border border-warm-gray"
                >
                  💬 {l}
                </span>
              ))}
            </div>
          </section>

          <div className="h-12" />
        </div>
      </div>
      
      {/* Action Bar (only for other profiles) */}
      {!isOwnProfile && (
        <div className="absolute bottom-6 left-0 right-0 px-8 flex justify-center items-center gap-6 z-20 pointer-events-none">
          <button 
            onClick={onPass}
            className="w-16 h-16 pointer-events-auto bg-white rounded-full shadow-xl border border-warm-gray text-text-muted flex items-center justify-center hover:text-coral hover:border-coral transition-all active:scale-95"
          >
            <Icons.X size={32} />
          </button>
          
          <button 
            onClick={onSuperLike}
            className="w-12 h-12 pointer-events-auto bg-white rounded-full shadow-xl border border-blue-100 text-blue-400 flex items-center justify-center hover:bg-blue-50 transition-all active:scale-95"
          >
            <Icons.Star size={24} fill="currentColor" />
          </button>

          <button 
            onClick={onLike}
            className="w-16 h-16 pointer-events-auto bg-coral rounded-full shadow-xl shadow-coral/30 text-white flex items-center justify-center hover:scale-105 transition-all active:scale-95"
          >
            <Icons.Heart size={32} fill="currentColor" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;

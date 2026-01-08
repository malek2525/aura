import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { UserProfile, createEmptyUserProfile } from '../types';

interface ProfileProps {
  user?: UserProfile;
  onBack: () => void;
  onLike?: () => void;
  onPass?: () => void;
  onSuperLike?: () => void;
  isOwnProfile?: boolean;
}

export const Profile: React.FC<ProfileProps> = ({ 
  user, 
  onBack,
  onLike,
  onPass,
  onSuperLike,
  isOwnProfile = false
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  // Use provided user or empty profile
  const profile = user || createEmptyUserProfile();
  
  // Navigate photos
  const nextPhoto = () => {
    if (profile.photos.length > 1) {
      setCurrentPhotoIndex((prev) => (prev + 1) % profile.photos.length);
    }
  };
  
  const prevPhoto = () => {
    if (profile.photos.length > 1) {
      setCurrentPhotoIndex((prev) => (prev - 1 + profile.photos.length) % profile.photos.length);
    }
  };

  // No profile to show
  if (!user) {
    return (
      <div className="h-full bg-white flex flex-col items-center justify-center p-8">
        <Icons.User size={48} className="text-text-muted mb-4" />
        <p className="text-text-sec">No profile to display</p>
        <button onClick={onBack} className="mt-4 text-coral font-medium">Go Back</button>
      </div>
    );
  }

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
        {/* Cover Photo with navigation */}
        <div className="h-[550px] w-full relative bg-warm-gray">
          {profile.photos.length > 0 ? (
            <>
              <img 
                src={profile.photos[currentPhotoIndex]} 
                className="w-full h-full object-cover" 
                alt={profile.name} 
              />
              
              {/* Photo navigation areas */}
              {profile.photos.length > 1 && (
                <>
                  <div 
                    className="absolute left-0 top-0 w-1/3 h-full cursor-pointer"
                    onClick={prevPhoto}
                  />
                  <div 
                    className="absolute right-0 top-0 w-1/3 h-full cursor-pointer"
                    onClick={nextPhoto}
                  />
                  
                  {/* Photo indicators */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1">
                    {profile.photos.map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1 rounded-full transition-all ${
                          i === currentPhotoIndex ? 'w-6 bg-white' : 'w-1 bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Icons.User size={64} className="text-text-muted" />
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-24 text-white">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{profile.name}, {profile.age}</h1>
              {profile.verified && <Icons.ShieldCheck className="text-success fill-success/20" size={24} />}
            </div>
            <p className="text-sm text-gray-200 mt-1 flex items-center gap-1">
              <Icons.MapPin size={14} /> {profile.location} {profile.distance > 0 && `• ${profile.distance} km away`}
            </p>
          </div>
        </div>

        <div className="p-6 space-y-8">
          
          {/* Aura's Read */}
          {profile.auraRead && (
            <section className="bg-gradient-to-br from-coral-light to-warm-white p-5 rounded-2xl border border-coral/20 shadow-sm transform -translate-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Icons.Sparkles size={16} className="text-coral" />
                <h3 className="text-xs font-bold text-coral uppercase tracking-widest">Aura's Read</h3>
              </div>
              <p className="text-text-main italic text-lg leading-relaxed mb-4">
                "{profile.auraRead}"
              </p>
              {profile.vibeTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {profile.vibeTags.map((tag, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1 bg-white border border-warm-gray rounded-full text-xs text-text-sec font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Verification Score */}
          <section className="bg-white border border-warm-gray p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-text-main">Verification Score</h3>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-text-main">{profile.verificationScore}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  profile.verificationTier === 'Platinum' ? 'bg-purple-100 text-purple-700' :
                  profile.verificationTier === 'Gold' ? 'bg-gold/20 text-yellow-800' :
                  profile.verificationTier === 'Silver' ? 'bg-gray-100 text-gray-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {profile.verificationTier}
                </span>
              </div>
            </div>
            <div className="h-2 w-full bg-warm-gray rounded-full mb-3 overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  profile.verificationTier === 'Platinum' ? 'bg-purple-500' :
                  profile.verificationTier === 'Gold' ? 'bg-gold' :
                  profile.verificationTier === 'Silver' ? 'bg-gray-400' :
                  'bg-orange-400'
                }`}
                style={{ width: `${profile.verificationScore}%` }}
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-text-sec">
              <Icons.Check size={16} className="text-success" /> Verified photo
            </div>
          </section>

          {/* Bio */}
          {profile.bio && (
            <section>
              <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">Bio</h3>
              <p className="text-text-main leading-relaxed text-lg">{profile.bio}</p>
            </section>
          )}

          {/* Photo 2 */}
          {profile.photos[1] && (
            <div className="w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-sm">
              <img src={profile.photos[1]} className="w-full h-full object-cover" alt="Photo 2" />
            </div>
          )}

          {/* Interests */}
          {profile.interests.length > 0 && (
            <section>
              <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-3">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, i) => (
                  <span 
                    key={i}
                    className="px-4 py-2 bg-coral-light text-coral-dark rounded-full text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* About */}
          <section>
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-3">About {profile.name}</h3>
            <div className="grid grid-cols-2 gap-3">
              {profile.details.height && (
                <div className="flex items-center gap-2 p-3 bg-warm-white rounded-xl border border-warm-gray">
                  <Icons.Ruler size={16} className="text-text-muted" />
                  <span className="text-sm text-text-main font-medium">{profile.details.height}</span>
                </div>
              )}
              {profile.job && (
                <div className="flex items-center gap-2 p-3 bg-warm-white rounded-xl border border-warm-gray">
                  <Icons.Briefcase size={16} className="text-text-muted" />
                  <span className="text-sm text-text-main font-medium">{profile.job}</span>
                </div>
              )}
              {profile.details.education && (
                <div className="flex items-center gap-2 p-3 bg-warm-white rounded-xl border border-warm-gray">
                  <Icons.GraduationCap size={16} className="text-text-muted" />
                  <span className="text-sm text-text-main font-medium">{profile.details.education}</span>
                </div>
              )}
              {profile.details.drinking && (
                <div className="flex items-center gap-2 p-3 bg-warm-white rounded-xl border border-warm-gray">
                  <Icons.Wine size={16} className="text-text-muted" />
                  <span className="text-sm text-text-main font-medium">{profile.details.drinking}</span>
                </div>
              )}
            </div>
          </section>

          {/* Prompts */}
          {profile.prompts.map((prompt, i) => (
            <section key={i} className="bg-warm-white p-6 rounded-3xl border border-warm-gray relative">
              <div className="absolute -top-3 left-6 bg-white px-2 text-xs font-bold text-coral">
                {prompt.question}
              </div>
              <p className="text-lg font-medium text-text-main">{prompt.answer}</p>
            </section>
          ))}

          {/* Languages */}
          {profile.details.languages.length > 0 && (
            <section>
              <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {profile.details.languages.map((l, i) => (
                  <span 
                    key={i} 
                    className="text-sm text-text-sec px-3 py-1 bg-warm-white rounded-lg border border-warm-gray"
                  >
                    💬 {l}
                  </span>
                ))}
              </div>
            </section>
          )}

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

import React from 'react';
import { Icons } from '../components/Icons';
import { UserProfile } from '../types';

interface ProfileProps {
  user?: UserProfile;
  onBack: () => void;
  onLike?: () => void;
  onPass?: () => void;
  onSuperLike?: () => void;
}

const MOCK_SELF_PREVIEW: UserProfile = {
    id: 'me',
    name: 'Abdulmalek',
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
    details: { height: '185cm', exercise: 'Active', education: 'Masters', drinking: 'Socially', smoking: 'No', lookingFor: 'Relationship', starSign: 'Leo', languages: ['English', 'Hungarian'] }
};

export const Profile: React.FC<ProfileProps> = ({ 
  user = MOCK_SELF_PREVIEW, 
  onBack,
  onLike,
  onPass,
  onSuperLike
}) => {
  return (
    <div className="h-full bg-warm-white flex flex-col relative overflow-hidden">
      
      {/* Navbar overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center pointer-events-none">
         <button onClick={onBack} className="p-3 bg-white/80 backdrop-blur-md rounded-2xl text-text-main shadow-sm border border-white/50 pointer-events-auto hover:bg-white transition-colors">
           <Icons.ChevronLeft size={22} />
         </button>
         <button className="p-3 bg-white/80 backdrop-blur-md rounded-2xl text-text-main shadow-sm border border-white/50 pointer-events-auto hover:bg-white transition-colors">
           <Icons.MoreHorizontal size={22} />
         </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar bg-warm-white pb-28">
        {/* Main Photo (Cover) */}
        <div className="h-[500px] w-full relative">
           <img src={user.photos[0]} className="w-full h-full object-cover" alt={user.name} />
           <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-warm-white"></div>
        </div>

        {/* Content Container - overlapping the image */}
        <div className="-mt-12 relative px-5">
            
            {/* Title Block */}
            <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                    <h1 className="text-4xl font-extrabold text-text-main tracking-tight">{user.name}, {user.age}</h1>
                    {user.verified && (
                        <div className="bg-sage text-white p-1 rounded-full mb-2 border-2 border-white shadow-sm">
                            <Icons.Check size={14} strokeWidth={3} />
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-text-sec font-medium flex items-center gap-1.5">
                      <Icons.Briefcase size={14} className="text-coral" /> {user.job}
                  </p>
                  <p className="text-sm text-text-sec font-medium flex items-center gap-1.5">
                      <Icons.MapPin size={14} className="text-coral" /> {user.location} • {user.distance} km away
                  </p>
                </div>
            </div>

            <div className="space-y-6">
                
                {/* Aura Read Card */}
                <section className="bg-white rounded-[24px] p-6 shadow-sm border border-warm-gray relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-coral-light rounded-bl-[100px] opacity-50"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                            <Icons.Sparkles size={16} className="text-coral" />
                            <h3 className="text-xs font-bold text-coral uppercase tracking-widest">Aura Read</h3>
                        </div>
                        <p className="text-text-main font-medium italic text-lg leading-relaxed mb-4">
                            "{user.auraRead}"
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {user.vibeTags.map((tag, i) => (
                                <span key={i} className="px-3 py-1 bg-warm-white border border-warm-gray rounded-xl text-xs text-text-main font-bold">
                                {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Bio */}
                <section>
                    <h3 className="text-sm font-extrabold text-text-muted uppercase tracking-wider mb-2 ml-1">Bio</h3>
                    <p className="text-text-main text-lg leading-relaxed font-medium">
                        {user.bio}
                    </p>
                </section>

                {/* Essentials Grid */}
                <section>
                    <h3 className="text-sm font-extrabold text-text-muted uppercase tracking-wider mb-3 ml-1">Essentials</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { icon: Icons.Ruler, val: user.details.height, label: 'Height' },
                            { icon: Icons.GraduationCap, val: user.details.education, label: 'Education' },
                            { icon: Icons.Wine, val: user.details.drinking, label: 'Drinking' },
                            { icon: Icons.Cigarette, val: user.details.smoking, label: 'Smoking' },
                            { icon: Icons.Search, val: user.details.lookingFor, label: 'Looking for' },
                            { icon: Icons.Star, val: user.details.starSign, label: 'Sign' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-warm-gray">
                                <item.icon size={18} className="text-coral mt-0.5" />
                                <div>
                                    <span className="block text-[10px] text-text-muted font-bold uppercase">{item.label}</span>
                                    <span className="text-sm text-text-main font-bold">{item.val}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Photo 2 */}
                {user.photos[1] && (
                    <div className="w-full aspect-[4/5] rounded-[32px] overflow-hidden shadow-sm border border-warm-gray">
                        <img src={user.photos[1]} className="w-full h-full object-cover" alt="Photo 2" />
                    </div>
                )}

                {/* Prompts */}
                {user.prompts.map((prompt, i) => (
                    <section key={i} className="bg-coral-light/20 p-6 rounded-[24px] border border-coral/10">
                        <p className="text-xs font-bold text-coral uppercase mb-2">
                            {prompt.question}
                        </p>
                        <p className="text-xl font-bold text-text-main">
                            "{prompt.answer}"
                        </p>
                    </section>
                ))}

                {/* Interests */}
                <section>
                    <h3 className="text-sm font-extrabold text-text-muted uppercase tracking-wider mb-3 ml-1">Passions</h3>
                    <div className="flex flex-wrap gap-2">
                        {user.interests.map((tag, i) => (
                        <span key={i} className="px-4 py-2 bg-white border border-warm-gray rounded-full text-sm text-text-main font-bold shadow-sm">
                            {tag}
                        </span>
                        ))}
                    </div>
                </section>

                {/* Bottom Spacer */}
                <div className="h-8"></div>
            </div>
        </div>
      </div>
      
      {/* Floating Action Bar */}
      <div className="absolute bottom-6 left-0 right-0 px-8 flex justify-center items-center gap-6 z-20 pointer-events-none">
          {/* Pass */}
          <button 
             onClick={onPass}
             className="w-16 h-16 pointer-events-auto bg-white rounded-full shadow-float border border-warm-gray text-text-muted flex items-center justify-center hover:text-red-400 hover:border-red-100 transition-all active:scale-95"
          >
             <Icons.X size={32} />
          </button>
          
          {/* Super Like */}
          <button 
             onClick={onSuperLike}
             className="w-12 h-12 pointer-events-auto bg-white rounded-full shadow-float border border-blue-100 text-blue-400 flex items-center justify-center hover:bg-blue-50 transition-all active:scale-95"
          >
             <Icons.Star size={24} fill="currentColor" />
          </button>

          {/* Like */}
          <button 
             onClick={onLike}
             className="w-16 h-16 pointer-events-auto bg-coral rounded-full shadow-glow text-white flex items-center justify-center hover:bg-coral-dark transition-all active:scale-95"
          >
             <Icons.Heart size={32} fill="currentColor" />
          </button>
      </div>

    </div>
  );
};
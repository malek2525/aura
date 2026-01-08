import React from 'react';
import { Icons } from '../components/Icons';

interface AuraProps {
  userName?: string;
  userPhoto?: string;
  verificationScore?: number;
  onEditProfile: () => void;
  onSettings: () => void;
  onPreviewProfile: () => void;
  onTalkToAura?: () => void;
}

export const Aura: React.FC<AuraProps> = ({ 
  userName = 'User',
  userPhoto = 'https://picsum.photos/200/200?random=100',
  verificationScore = 67,
  onEditProfile, 
  onSettings, 
  onPreviewProfile,
  onTalkToAura
}) => {
  // Determine tier based on score
  const getTier = (score: number) => {
    if (score >= 81) return { name: 'Platinum', color: 'bg-purple-100 text-purple-700' };
    if (score >= 61) return { name: 'Gold', color: 'bg-gold/20 text-yellow-700' };
    if (score >= 41) return { name: 'Silver', color: 'bg-gray-100 text-gray-700' };
    return { name: 'Bronze', color: 'bg-orange-100 text-orange-700' };
  };

  const tier = getTier(verificationScore);

  return (
    <div className="h-full bg-white flex flex-col pt-4 pb-24 px-4 overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-coral flex items-center gap-2">
          <Icons.Sparkles size={24} className="fill-coral" />
          Aura Twin
        </h1>
        <button 
          onClick={onSettings} 
          className="p-2 text-text-sec hover:bg-warm-white rounded-full transition-colors"
        >
          <Icons.Settings size={24} />
        </button>
      </div>

      {/* Profile Summary Card */}
      <div className="bg-white rounded-3xl border border-warm-gray shadow-soft p-4 mb-6 flex items-center gap-4 relative overflow-hidden">
        <div className="relative">
          <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-coral to-orange">
            <img 
              src={userPhoto} 
              alt="Me" 
              className="w-full h-full rounded-full object-cover border-2 border-white" 
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full">
            <Icons.ShieldCheck size={16} className="text-success fill-success/20" />
          </div>
        </div>
        
        <div className="flex-1">
          <h2 className="font-bold text-lg text-text-main">{userName}</h2>
          <div className="flex items-center gap-2 text-xs text-text-sec mt-1">
            <div className="h-1.5 w-24 bg-warm-gray rounded-full overflow-hidden">
              <div 
                className="h-full bg-success rounded-full transition-all duration-500" 
                style={{ width: `${verificationScore}%` }}
              />
            </div>
            <span>{verificationScore}% Complete</span>
          </div>
        </div>
        
        <button 
          onClick={onPreviewProfile} 
          className="text-coral text-sm font-semibold hover:underline"
        >
          Preview
        </button>
      </div>

      {/* Your Aura Card - Core Feature */}
      <div className="bg-gradient-to-br from-coral-light to-warm-white rounded-3xl border border-coral/20 p-6 mb-6 relative overflow-hidden shadow-glow">
        <div className="flex items-center gap-2 mb-3">
          <Icons.Sparkles size={18} className="text-coral animate-pulse" />
          <h3 className="text-coral-dark font-bold text-sm uppercase tracking-wide">Your Aura</h3>
        </div>
        
        <p className="text-text-main font-medium italic text-lg leading-relaxed mb-4">
          "You're a thoughtful introvert who values authentic connections over small talk. You take time to open up but form deep bonds."
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {['Thoughtful', 'Calm', 'Creative'].map((tag, i) => (
            <span 
              key={i} 
              className="px-3 py-1 bg-white/60 border border-white/50 rounded-full text-xs text-text-sec font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        <button 
          onClick={onTalkToAura}
          className="w-full py-3 bg-white text-coral font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
        >
          <Icons.MessageCircle size={18} />
          Talk to Aura
        </button>
      </div>

      {/* Verification Score Dashboard */}
      <div className="bg-white rounded-3xl border border-warm-gray p-6 mb-6 relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-text-main">Verification Score</h3>
              <span className={`${tier.color} px-2 py-0.5 rounded-full text-[10px] font-bold uppercase`}>
                {tier.name}
              </span>
            </div>
            <p className="text-xs text-text-sec mt-1">High score gets you 2x more matches.</p>
          </div>
          <div className="text-3xl font-black text-text-main">{verificationScore}</div>
        </div>

        {/* Progress Bar */}
        <div className="h-3 w-full bg-warm-gray rounded-full mb-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-gold to-orange rounded-full transition-all duration-500"
            style={{ width: `${verificationScore}%` }}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-text-sec">
            <Icons.Check size={16} className="text-success" /> Verified photo
          </div>
          <div className="flex items-center gap-2 text-sm text-text-sec">
            <Icons.Check size={16} className="text-success" /> Responds within hours
          </div>
          <div className="flex items-center gap-2 text-sm text-text-sec">
            <div className="w-4 h-4 rounded-full border border-text-muted flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-transparent rounded-full" />
            </div>
            <span className="opacity-50">5 positive date reviews</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={onEditProfile} 
          className="bg-warm-white p-4 rounded-2xl border border-warm-gray flex flex-col items-center gap-2 hover:bg-coral-light/50 transition-colors group"
        >
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-coral group-hover:scale-110 transition-transform">
            <Icons.Pencil size={20} />
          </div>
          <span className="font-medium text-sm text-text-main">Edit Profile</span>
        </button>
        
        <button 
          onClick={onSettings} 
          className="bg-warm-white p-4 rounded-2xl border border-warm-gray flex flex-col items-center gap-2 hover:bg-coral-light/50 transition-colors group"
        >
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-coral group-hover:scale-110 transition-transform">
            <Icons.SlidersHorizontal size={20} />
          </div>
          <span className="font-medium text-sm text-text-main">Preferences</span>
        </button>
      </div>
    </div>
  );
};

export default Aura;

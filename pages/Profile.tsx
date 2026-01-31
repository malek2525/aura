
import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { UserProfile } from '../types';
import { ReportModal } from '../components/ReportModal';
import { reportUser } from '../services/matchService';

interface ProfileProps {
  user?: UserProfile;
  isMe?: boolean;
  onBack: () => void;
  onEdit?: () => void;
  onLike?: () => void;
  onPass?: () => void;
  onAuraMatch?: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ 
  user,
  isMe = false,
  onBack,
  onEdit,
  onLike,
  onPass,
  onAuraMatch
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showReportSuccess, setShowReportSuccess] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  if (!user) return null;

  const handleReport = async (reason: string) => {
    await reportUser('me', user.id, reason);
    setShowReportSuccess(true);
    setTimeout(() => {
        setShowReportSuccess(false);
        onBack();
    }, 2000);
  };

  const nextPhoto = () => {
    if (currentPhotoIndex < user.photos.length - 1) {
      setCurrentPhotoIndex(prev => prev + 1);
    }
  };

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(prev => prev - 1);
    }
  };

  return (
    <div className="h-full bg-[#f8f6f6] flex flex-col relative overflow-hidden" onClick={() => setShowMenu(false)}>
      
      {/* Full screen scrollable content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-28">
        
        {/* Hero Photo Section */}
        <div className="relative">
          {/* Photo Gallery */}
          <div className="relative h-[65vh] min-h-[450px]">
            <img 
              src={user.photos[currentPhotoIndex]} 
              className="w-full h-full object-cover" 
              alt={user.name} 
            />
            
            {/* Photo Navigation Overlay */}
            <div className="absolute inset-0 flex">
              <div className="w-1/3 h-full cursor-pointer" onClick={(e) => { e.stopPropagation(); prevPhoto(); }} />
              <div className="w-1/3 h-full" />
              <div className="w-1/3 h-full cursor-pointer" onClick={(e) => { e.stopPropagation(); nextPhoto(); }} />
            </div>
            
            {/* Photo Indicators */}
            {user.photos.length > 1 && (
              <div className="absolute top-3 left-0 right-0 px-3 flex gap-1">
                {user.photos.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`flex-1 h-1 rounded-full transition-colors ${idx === currentPhotoIndex ? 'bg-white' : 'bg-white/40'}`}
                  />
                ))}
              </div>
            )}
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#f8f6f6] via-transparent to-black/20 pointer-events-none" />
            
            {/* Top Nav */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20">
              <button 
                onClick={onBack} 
                className="p-2.5 bg-white/90 backdrop-blur-md rounded-full text-text-main shadow-lg hover:bg-white transition-colors"
              >
                <Icons.ChevronLeft size={24} />
              </button>
              
              {isMe ? (
                <button 
                  onClick={onEdit} 
                  className="px-4 py-2.5 bg-black/80 backdrop-blur-md rounded-full text-white shadow-lg hover:bg-black transition-colors flex items-center gap-2"
                >
                  <Icons.Pencil size={14} /> 
                  <span className="text-xs font-bold">Edit</span>
                </button>
              ) : (
                <div className="relative">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} 
                    className="p-2.5 bg-white/90 backdrop-blur-md rounded-full text-text-main shadow-lg hover:bg-white transition-colors"
                  >
                    <Icons.MoreHorizontal size={24} />
                  </button>
                  {showMenu && (
                    <div className="absolute top-12 right-0 bg-white shadow-xl rounded-2xl py-2 w-44 z-30 animate-in fade-in zoom-in-95 border border-warm-gray">
                      <button className="w-full text-left px-4 py-3 text-sm text-text-main hover:bg-warm-white font-medium flex items-center gap-3">
                        <Icons.Share size={16} className="text-text-sec" /> Share Profile
                      </button>
                      <div className="h-px bg-warm-gray mx-2" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowMenu(false); setShowReport(true); }}
                        className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 font-medium flex items-center gap-3"
                      >
                        <Icons.AlertCircle size={16} /> Report User
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Profile Info Overlay - Positioned at bottom of photo */}
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">{user.name}, {user.age}</h1>
                  {user.verified && (
                    <div className="bg-sage text-white p-1 rounded-full shadow-lg">
                      <Icons.Check size={14} strokeWidth={3} />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 text-white/90 text-sm font-medium drop-shadow">
                  <span className="flex items-center gap-1">
                    <Icons.Briefcase size={14} /> {user.job}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icons.MapPin size={14} /> {user.distance} km
                  </span>
                </div>
              </div>
              
              {/* Verification Badge */}
              {user.verificationScore && (
                <div className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                  <Icons.ShieldCheck size={14} className="text-sage" />
                  <span className="text-xs font-bold text-text-main">{user.verificationScore}%</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-5 pt-6 space-y-5">
          
          {/* Aura Insight - Premium Card */}
          <div className="bg-gradient-to-br from-coral/10 via-white to-coral/5 rounded-3xl p-5 border border-coral/20 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-coral/10 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-coral/10 rounded-lg">
                  <Icons.Sparkles size={14} className="text-coral" />
                </div>
                <span className="text-xs font-bold text-coral uppercase tracking-wider">Aura Insight</span>
              </div>
              <p className="text-text-main text-lg font-medium leading-relaxed mb-4">
                "{user.auraRead}"
              </p>
              <div className="flex flex-wrap gap-2">
                {user.vibeTags.map((tag, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white/80 border border-coral/20 rounded-full text-xs font-semibold text-text-main">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bio Section */}
          {user.bio && (
            <div>
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 px-1">About</h3>
              <p className="text-text-main text-base leading-relaxed">{user.bio}</p>
            </div>
          )}

          {/* Quick Details - Compact Grid */}
          <div>
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 px-1">Details</h3>
            <div className="bg-white rounded-2xl border border-warm-gray overflow-hidden divide-y divide-warm-gray">
              {[
                { icon: Icons.Ruler, val: user.details?.height, label: 'Height' },
                { icon: Icons.GraduationCap, val: user.details?.education, label: 'Education' },
                { icon: Icons.Search, val: user.details?.lookingFor, label: 'Looking for' },
                { icon: Icons.Wine, val: user.details?.drinking, label: 'Drinking' },
                { icon: Icons.Cigarette, val: user.details?.smoking, label: 'Smoking' },
                { icon: Icons.Star, val: user.details?.starSign, label: 'Sign' },
              ].filter(item => item.val).map((item, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <item.icon size={16} className="text-coral" />
                    <span className="text-sm text-text-sec">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-text-main">{item.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Prompts */}
          {user.prompts && user.prompts.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider px-1">Prompts</h3>
              {user.prompts.map((prompt, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-warm-gray">
                  <p className="text-xs font-semibold text-coral mb-1">{prompt.question}</p>
                  <p className="text-base font-medium text-text-main">"{prompt.answer}"</p>
                </div>
              ))}
            </div>
          )}

          {/* Additional Photos */}
          {user.photos.length > 1 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider px-1">Photos</h3>
              <div className="grid grid-cols-2 gap-3">
                {user.photos.slice(1).map((photo, i) => (
                  <div key={i} className="aspect-[4/5] rounded-2xl overflow-hidden border border-warm-gray">
                    <img src={photo} className="w-full h-full object-cover" alt={`Photo ${i + 2}`} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          {user.interests && user.interests.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 px-1">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((tag, i) => (
                  <span key={i} className="px-4 py-2 bg-white border border-warm-gray rounded-full text-sm font-medium text-text-main">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Report Link */}
          {!isMe && (
            <div className="flex justify-center pt-4 pb-8">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowReport(true); }}
                className="text-text-muted text-xs font-medium hover:text-red-400 transition-colors"
              >
                Report or Block {user.name}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Floating Action Bar (Only for others) */}
      {!isMe && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#f8f6f6] via-[#f8f6f6] to-transparent pt-8 pb-6 px-6">
          <div className="flex justify-center items-center gap-4">
            {/* Pass */}
            <button 
              onClick={onPass}
              className="w-14 h-14 bg-white rounded-full shadow-lg border border-warm-gray text-text-muted flex items-center justify-center hover:text-red-400 hover:border-red-200 transition-all active:scale-95"
            >
              <Icons.X size={28} strokeWidth={2.5} />
            </button>
            
            {/* Aura Match */}
            <button 
              onClick={onAuraMatch}
              className="h-12 px-6 bg-gradient-to-r from-coral to-primary text-white rounded-full shadow-lg flex items-center gap-2 hover:opacity-90 transition-all active:scale-95"
            >
              <Icons.Sparkles size={18} />
              <span className="text-sm font-bold">Aura Match</span>
            </button>
  
            {/* Like */}
            <button 
              onClick={onLike}
              className="w-14 h-14 bg-coral rounded-full shadow-lg text-white flex items-center justify-center hover:bg-coral-dark transition-all active:scale-95"
            >
              <Icons.Heart size={28} fill="currentColor" />
            </button>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReport && (
        <ReportModal 
          userName={user.name} 
          onClose={() => setShowReport(false)} 
          onSubmit={handleReport}
        />
      )}

      {/* Success Toast */}
      {showReportSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-black/90 text-white px-6 py-3 rounded-full shadow-2xl z-[100] flex items-center gap-2 animate-in slide-in-from-top-4">
          <Icons.CheckCircle size={18} className="text-green-400" />
          <span className="font-bold text-sm">Report submitted. Thank you.</span>
        </div>
      )}
    </div>
  );
};

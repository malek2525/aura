import React, { useEffect, useState } from 'react';
import { Icons } from '../components/Icons';
import { UserProfile } from '../types';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';
import { loadAuraProfile } from '../storage/profileStorage';
import { compressImage } from '../utils/image';
import { fetchMatches } from '../services/matchService';

interface AuraProps {
  onEditProfile: () => void;
  onSettings: () => void;
  onPreviewProfile: () => void;
  onAddStory: (imageUrl: string) => void;
}

export const Aura: React.FC<AuraProps> = ({ onEditProfile, onSettings, onPreviewProfile, onAddStory }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState({ likes: 0, matches: 0, views: 0 });
  const [auraHealth, setAuraHealth] = useState(85);
  const [showHealthInfo, setShowHealthInfo] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const p = await loadAuraProfile(user.uid);
        setProfile(p);
        
        // Fetch real stats
        const matches = await fetchMatches(user.uid);
        setStats({
          likes: Math.floor(Math.random() * 20) + 5, // Mock for demo
          matches: matches.length,
          views: Math.floor(Math.random() * 50) + 10 // Mock for demo
        });
        
        // Calculate Aura Health based on profile completeness
        if (p) {
          let health = 50;
          if (p.photos?.length >= 2) health += 15;
          if (p.bio && p.bio.length > 50) health += 10;
          if (p.interests?.length >= 3) health += 10;
          if (p.prompts?.length >= 1) health += 10;
          if (p.verified) health += 5;
          setAuraHealth(Math.min(health, 100));
        }
      }
    };
    fetchProfile();
  }, [user]);

  const myPhoto = profile?.photos?.[0] || user?.photoURL || "https://ui-avatars.com/api/?name=Me";
  const myName = profile?.name || user?.displayName || "You";

  const handleStoryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const url = await compressImage(file, 600, 0.7);
        onAddStory(url);
      } catch (error) {
        console.error("Story compression failed", error);
      }
    }
  };

  // Get health color
  const getHealthColor = () => {
    if (auraHealth >= 80) return 'text-green-500';
    if (auraHealth >= 60) return 'text-gold';
    return 'text-coral';
  };

  const getHealthBg = () => {
    if (auraHealth >= 80) return 'bg-green-500';
    if (auraHealth >= 60) return 'bg-gold';
    return 'bg-coral';
  };

  // Get aura status
  const getAuraStatus = () => {
    if (auraHealth >= 80) return { label: 'Radiant', emoji: '✨' };
    if (auraHealth >= 60) return { label: 'Glowing', emoji: '🌟' };
    if (auraHealth >= 40) return { label: 'Warming Up', emoji: '🔥' };
    return { label: 'Needs Love', emoji: '💫' };
  };

  const auraStatus = getAuraStatus();

  return (
    <div className="h-full bg-warm-white relative overflow-hidden flex flex-col">
      
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-coral-light/15 via-gold/5 to-transparent -z-10 pointer-events-none" />

      {/* Navbar */}
      <div className="px-6 py-4 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <Logo size={28} />
          <span className="font-extrabold text-xl text-text-main tracking-tight">Aura</span>
        </div>
        <button 
          onClick={onSettings} 
          className="p-2.5 bg-white rounded-full text-text-main shadow-sm hover:text-coral transition-colors border border-warm-gray"
        >
          <Icons.Settings size={20} />
        </button>
      </div>

      {/* Main Scroll Container */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        
        {/* Profile Header */}
        <div className="px-6 pt-2 pb-6">
          
          {/* Profile Identity */}
          <div className="flex items-center gap-5">
            <div className="relative group cursor-pointer" onClick={onPreviewProfile}>
              {/* Avatar Ring */}
              <div className="w-20 h-20 rounded-full p-[3px] bg-gradient-to-tr from-coral to-gold shadow-lg relative z-10">
                <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-gray-100">
                  <img src={myPhoto} className="w-full h-full object-cover" alt={myName} />
                </div>
              </div>
              
              {/* Edit Badge */}
              <button 
                onClick={(e) => { e.stopPropagation(); onEditProfile(); }}
                className="absolute -bottom-1 -right-1 bg-white text-text-main p-2 rounded-full shadow-md border border-gray-100 hover:text-coral transition-colors z-20"
              >
                <Icons.Pencil size={12} strokeWidth={3} />
              </button>
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-extrabold text-text-main tracking-tight leading-tight">{myName}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/60 backdrop-blur-md rounded-lg border border-warm-gray/50">
                  <span className="text-sm">{auraStatus.emoji}</span>
                  <span className="text-[10px] font-bold text-text-sec uppercase tracking-wide">{auraStatus.label}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/60 backdrop-blur-md rounded-lg border border-warm-gray/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-text-sec uppercase tracking-wide">Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="w-full grid grid-cols-3 gap-3 mt-6">
            <StatCard 
              icon={Icons.Heart} 
              value={stats.likes} 
              label="Likes" 
              color="text-coral" 
              bgColor="bg-coral/5"
            />
            <div 
              className="bg-white p-3 rounded-2xl shadow-sm border border-warm-gray text-center cursor-pointer hover:border-sage/30 transition-colors relative"
              onClick={() => setShowHealthInfo(!showHealthInfo)}
            >
              <div className="text-sage mb-1 flex justify-center">
                <Icons.Zap size={18} />
              </div>
              <span className={`block text-lg font-black leading-none ${getHealthColor()}`}>{auraHealth}%</span>
              <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider">Health</span>
              
              {/* Health Info Tooltip */}
              {showHealthInfo && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-xl shadow-xl border border-warm-gray p-3 z-30 animate-in fade-in zoom-in-95">
                  <p className="text-xs text-text-main mb-2 font-bold">Aura Health = Profile Quality</p>
                  <div className="space-y-1 text-[10px] text-text-sec">
                    <p>✓ 2+ photos = +15%</p>
                    <p>✓ Good bio = +10%</p>
                    <p>✓ 3+ interests = +10%</p>
                    <p>✓ Prompts = +10%</p>
                    <p>✓ Verified = +5%</p>
                  </div>
                  <p className="text-[9px] text-coral font-bold mt-2">Higher health = more matches!</p>
                </div>
              )}
            </div>
            <StatCard 
              icon={Icons.Eye} 
              value={stats.views} 
              label="Views" 
              color="text-purple-500" 
              bgColor="bg-purple-50"
            />
          </div>

          {/* Aura Health Bar */}
          <div className="mt-4 bg-white rounded-2xl p-4 border border-warm-gray shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-text-main">Profile Strength</span>
              <span className={`text-xs font-bold ${getHealthColor()}`}>{auraHealth}%</span>
            </div>
            <div className="h-2 bg-warm-gray rounded-full overflow-hidden">
              <div 
                className={`h-full ${getHealthBg()} rounded-full transition-all duration-500`}
                style={{ width: `${auraHealth}%` }}
              />
            </div>
            {auraHealth < 80 && (
              <button 
                onClick={onEditProfile}
                className="w-full mt-3 py-2 text-xs font-bold text-coral hover:bg-coral-light/10 rounded-xl transition-colors flex items-center justify-center gap-1"
              >
                <Icons.Sparkles size={12} />
                boost ur profile
              </button>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.03)] border-t border-warm-gray/50 p-6 space-y-6 min-h-[400px]">
          
          {/* Quick Actions */}
          <section>
            <div className="grid grid-cols-2 gap-3">
              <QuickAction 
                icon={Icons.Sparkles}
                label="Boost Profile"
                sublabel="get more views"
                color="bg-gradient-to-br from-coral to-gold"
              />
              <QuickAction 
                icon={Icons.Ghost}
                label="Ghost Mode"
                sublabel="go invisible"
                color="bg-gradient-to-br from-purple-500 to-indigo-500"
              />
            </div>
          </section>

          {/* Stories Section */}
          <section>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-text-main">my stories</h3>
              <button className="text-xs text-coral font-bold flex items-center gap-1 hover:underline">
                archive <Icons.ChevronRight size={12} />
              </button>
            </div>
            
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
              {/* Add Story */}
              <div 
                onClick={() => document.getElementById('story-upload')?.click()} 
                className="flex-shrink-0 w-20 h-28 rounded-2xl border-2 border-dashed border-warm-gray bg-warm-white flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-coral/50 hover:bg-coral-light/5 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-warm-gray flex items-center justify-center text-coral group-hover:scale-110 transition-transform">
                  <Icons.Plus size={16} strokeWidth={3} />
                </div>
                <span className="text-[9px] font-bold text-text-muted uppercase">add</span>
              </div>
              <input type="file" id="story-upload" accept="image/*" className="hidden" onChange={handleStoryUpload} />

              {/* Existing Stories */}
              {profile?.stories?.map((story) => (
                <div key={story.id} className="flex-shrink-0 w-20 h-28 rounded-2xl overflow-hidden relative shadow-md border border-warm-gray">
                  <img src={story.imageUrl} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 text-[8px] text-white font-bold">{story.timestamp}</span>
                </div>
              ))}
              
              {/* Demo Story */}
              {(!profile?.stories || profile.stories.length === 0) && (
                <div className="flex-shrink-0 w-20 h-28 rounded-2xl overflow-hidden relative shadow-md border border-warm-gray opacity-60">
                  <img src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=300&fit=crop" className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white bg-black/40 px-2 py-0.5 rounded-full">demo</span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Recent Activity */}
          <section>
            <h3 className="text-sm font-bold text-text-main mb-3">recent activity</h3>
            <div className="space-y-2">
              <ActivityItem 
                icon="❤️"
                text="someone liked your profile"
                time="2m ago"
                highlight
              />
              <ActivityItem 
                icon="✨"
                text="your aura matched with Julia"
                time="1h ago"
              />
              <ActivityItem 
                icon="👀"
                text="5 people viewed your profile"
                time="3h ago"
              />
            </div>
          </section>

          {/* Menu Items */}
          <section className="space-y-1">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">settings</h3>
            
            <MenuItem 
              icon={Icons.Eye} 
              color="text-blue-500" 
              bg="bg-blue-50"
              title="Preview Profile" 
              subtitle="see how others see u"
              onClick={onPreviewProfile}
            />
            
            <MenuItem 
              icon={Icons.ShieldCheck} 
              color="text-sage" 
              bg="bg-sage-light"
              title="Safety Center" 
              subtitle="verification & boundaries"
            />

            <div className="h-2" />
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">premium</h3>

            <MenuItem 
              icon={Icons.Crown} 
              color="text-gold" 
              bg="bg-yellow-50"
              title="Aura Premium" 
              subtitle="unlimited likes + see who liked u"
              badge="✨"
            />
          </section>

          {/* Footer */}
          <div className="text-center pt-6 pb-24">
            <div className="flex justify-center gap-4 mb-4">
              <SocialButton icon={Icons.Instagram} />
              <SocialButton icon={Icons.Twitter} />
            </div>
            <p className="text-[9px] text-text-muted font-bold tracking-widest uppercase">aura v2.4.0</p>
          </div>
        </div>
      </div>

      {/* Click outside to close health info */}
      {showHealthInfo && (
        <div 
          className="fixed inset-0 z-20" 
          onClick={() => setShowHealthInfo(false)} 
        />
      )}
    </div>
  );
};

// Sub-components

const StatCard = ({ icon: Icon, value, label, color, bgColor }: any) => (
  <div className={`bg-white p-3 rounded-2xl shadow-sm border border-warm-gray text-center hover:scale-[1.02] transition-transform cursor-default`}>
    <div className={`${color} mb-1 flex justify-center`}>
      <Icon size={18} />
    </div>
    <span className="block text-lg font-black text-text-main leading-none">{value}</span>
    <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider">{label}</span>
  </div>
);

const QuickAction = ({ icon: Icon, label, sublabel, color }: any) => (
  <button className={`${color} p-4 rounded-2xl text-white text-left hover:scale-[1.02] transition-transform active:scale-[0.98] shadow-lg`}>
    <Icon size={20} className="mb-2" />
    <span className="block text-sm font-bold">{label}</span>
    <span className="text-[10px] opacity-80">{sublabel}</span>
  </button>
);

const ActivityItem = ({ icon, text, time, highlight }: any) => (
  <div className={`flex items-center gap-3 p-3 rounded-xl ${highlight ? 'bg-coral-light/10 border border-coral/10' : 'bg-warm-white'}`}>
    <span className="text-lg">{icon}</span>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-text-main font-medium truncate">{text}</p>
    </div>
    <span className="text-[10px] text-text-muted font-bold flex-shrink-0">{time}</span>
  </div>
);

const MenuItem = ({ icon: Icon, title, subtitle, onClick, color, bg, badge }: any) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-warm-white transition-all text-left group active:scale-[0.98]"
  >
    <div className={`w-11 h-11 rounded-2xl ${bg} flex items-center justify-center ${color} shadow-sm group-hover:scale-105 transition-transform`}>
      <Icon size={20} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-text-main">{title}</span>
        {badge && <span className="text-xs">{badge}</span>}
      </div>
      <span className="text-xs text-text-sec truncate block">{subtitle}</span>
    </div>
    <div className="text-gray-300 group-hover:text-coral transition-colors">
      <Icons.ChevronRight size={18} />
    </div>
  </button>
);

const SocialButton = ({ icon: Icon }: any) => (
  <button className="w-10 h-10 rounded-full bg-gray-50 border border-warm-gray flex items-center justify-center text-text-muted hover:bg-white hover:text-text-main transition-all">
    <Icon size={18} />
  </button>
);
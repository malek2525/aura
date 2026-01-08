import React from 'react';
import { Icons } from '../components/Icons';

interface EditProfileProps {
  onBack: () => void;
  onSave?: () => void;
}

export const EditProfile: React.FC<EditProfileProps> = ({ onBack, onSave }) => {
  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center border-b border-warm-gray sticky top-0 z-10">
        <button 
          onClick={onBack} 
          className="p-2 -ml-2 text-text-sec hover:bg-warm-white rounded-full"
        >
          <Icons.ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-text-main mr-8">Edit Profile</h1>
        <button 
          onClick={onSave}
          className="text-coral font-semibold text-sm"
        >
          Done
        </button>
      </div>

      <div className="overflow-y-auto p-4 pb-24 space-y-8">
        
        {/* Profile Strength */}
        <section>
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-sm font-bold text-text-main">Profile Strength</h2>
            <span className="text-xs text-text-sec">67% complete</span>
          </div>
          <div className="h-2 w-full bg-warm-gray rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-success rounded-full" />
          </div>
        </section>

        {/* Photos Grid */}
        <section>
          <div className="flex justify-between items-end mb-3">
            <h2 className="text-sm font-bold text-text-main">Photos & Videos</h2>
            <span className="text-xs text-text-muted">Hold to reorder</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[2/3] relative rounded-xl overflow-hidden bg-warm-gray group">
                <img 
                  src={`https://picsum.photos/300/400?random=${i+10}`} 
                  className="w-full h-full object-cover" 
                  alt="Me" 
                />
                <button className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white hover:bg-coral transition-colors">
                  <Icons.X size={12} />
                </button>
                {i === 1 && (
                  <span className="absolute bottom-2 left-2 bg-white/90 px-2 py-0.5 rounded text-[10px] font-bold text-text-main shadow-sm">
                    Main
                  </span>
                )}
              </div>
            ))}
            {/* Add Button */}
            <button className="aspect-[2/3] rounded-xl border-2 border-dashed border-warm-gray flex flex-col items-center justify-center gap-2 text-coral hover:bg-coral-light/20 hover:border-coral transition-colors">
              <Icons.Plus size={24} />
            </button>
          </div>
          
          {/* Verify Profile */}
          <div className="mt-4 p-3 bg-success/10 rounded-xl flex items-center justify-between border border-success/20 cursor-pointer hover:bg-success/20 transition-colors">
            <div className="flex items-center gap-2">
              <Icons.ShieldCheck className="text-success" size={20} />
              <span className="text-sm font-medium text-text-main">Verify my profile</span>
            </div>
            <Icons.ChevronRight size={16} className="text-text-muted" />
          </div>
        </section>

        {/* Bio */}
        <section>
          <h2 className="text-sm font-bold text-text-main mb-2">Bio</h2>
          <textarea 
            className="w-full text-sm text-text-main bg-warm-white border border-warm-gray rounded-2xl p-4 resize-none outline-none focus:border-coral min-h-[100px]"
            defaultValue="Big fan of football, travel, and a good cup of coffee ☕️"
          />
          <button className="mt-2 w-full py-2 bg-gradient-to-r from-coral-light to-white border border-coral/20 rounded-xl flex items-center justify-center gap-2 text-coral text-sm font-semibold hover:shadow-sm transition-all">
            <Icons.Sparkles size={16} />
            Let Aura write your bio
          </button>
        </section>

        {/* Interests */}
        <section>
          <h2 className="text-sm font-bold text-text-main mb-3">Interests</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {['Gym', 'Crime Podcasts', 'Fantasy', 'Travel'].map((tag, i) => (
              <span key={i} className="px-3 py-1.5 bg-coral-light text-coral-dark rounded-full text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
          <button className="text-xs font-semibold text-text-sec flex items-center gap-1">
            <Icons.Plus size={12} /> Add interest
          </button>
        </section>

        {/* About You */}
        <section className="border-t border-warm-gray pt-6">
          <h2 className="text-sm font-bold text-text-main mb-2">About You</h2>
          <div className="space-y-1">
            {[
              { icon: Icons.Briefcase, label: 'Work', val: 'Founder @ Fenice' },
              { icon: Icons.GraduationCap, label: 'Education', val: 'Masters' },
              { icon: Icons.Ruler, label: 'Height', val: '185 cm' },
              { icon: Icons.Wine, label: 'Drinking', val: 'Socially' },
              { icon: Icons.Cigarette, label: 'Smoking', val: 'Never' },
            ].map((item, i) => (
              <div 
                key={i} 
                className="flex items-center py-3 border-b border-warm-gray last:border-0 cursor-pointer hover:bg-warm-white -mx-4 px-4 transition-colors"
              >
                <item.icon size={18} className="text-text-muted mr-3" />
                <span className="text-sm font-medium text-text-main flex-1">{item.label}</span>
                <span className="text-sm text-text-sec mr-2">{item.val}</span>
                <Icons.ChevronRight size={16} className="text-text-muted" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default EditProfile;

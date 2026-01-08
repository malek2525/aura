import React, { useState, useEffect } from 'react';
import { Icons } from '../components/Icons';
import { AuraProfile, MatchGenderPreference } from '../types';

interface SettingsProps {
  profile: AuraProfile | null;
  onBack: () => void;
  onLogout?: () => void;
  onSavePreferences?: (preferences: {
    preferredGenders: MatchGenderPreference;
    minAge: number;
    maxAge: number;
    maxDistance: number;
    auraFindMatches: boolean;
    auraToAura: boolean;
    showTrustScore: boolean;
  }) => void;
}

export const Settings: React.FC<SettingsProps> = ({ profile, onBack, onLogout, onSavePreferences }) => {
  // Initialize from profile preferences
  const [showMe, setShowMe] = useState<MatchGenderPreference>(
    profile?.preferences?.preferredGenders || 'women'
  );
  const [minAge, setMinAge] = useState(profile?.preferences?.minAge || 18);
  const [maxAge, setMaxAge] = useState(profile?.preferences?.maxAge || 35);
  const [distance, setDistance] = useState(25);
  
  // Aura settings
  const [auraFindMatches, setAuraFindMatches] = useState(true);
  const [auraToAura, setAuraToAura] = useState(true);
  const [showTrustScore, setShowTrustScore] = useState(true);

  // Gender options modal
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showAgePicker, setShowAgePicker] = useState(false);
  const [showDistancePicker, setShowDistancePicker] = useState(false);

  // Update when profile changes
  useEffect(() => {
    if (profile?.preferences) {
      setShowMe(profile.preferences.preferredGenders || 'women');
      setMinAge(profile.preferences.minAge || 18);
      setMaxAge(profile.preferences.maxAge || 35);
    }
  }, [profile]);

  // Save preferences
  const savePreferences = () => {
    onSavePreferences?.({
      preferredGenders: showMe,
      minAge,
      maxAge,
      maxDistance: distance,
      auraFindMatches,
      auraToAura,
      showTrustScore,
    });
  };

  // Auto-save on changes
  useEffect(() => {
    savePreferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMe, minAge, maxAge, distance, auraFindMatches, auraToAura, showTrustScore]);

  const getGenderLabel = (gender: MatchGenderPreference) => {
    switch(gender) {
      case 'women': return 'Women';
      case 'men': return 'Men';
      case 'any': return 'Everyone';
      case 'women_and_men': return 'Women & Men';
      default: return 'Everyone';
    }
  };

  // Toggle component
  const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: (val: boolean) => void }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`w-12 h-7 rounded-full relative transition-colors ${
        enabled ? 'bg-coral' : 'bg-warm-gray'
      }`}
    >
      <div 
        className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow-sm ${
          enabled ? 'right-1' : 'left-1'
        }`} 
      />
    </button>
  );

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="bg-white px-4 py-4 flex items-center border-b border-warm-gray sticky top-0 z-10">
        <button onClick={onBack} className="p-2 -ml-2 text-text-sec hover:bg-warm-white rounded-full">
          <Icons.ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-text-main mr-8">Settings</h1>
      </div>

      <div className="overflow-y-auto p-4 pb-24 space-y-8">
        
        {/* Dating Preferences */}
        <section>
          <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Dating Preferences</h2>
          <div className="bg-warm-white rounded-2xl border border-warm-gray overflow-hidden">
            
            {/* Show Me */}
            <div 
              className="p-4 border-b border-warm-gray flex justify-between items-center cursor-pointer hover:bg-white transition-colors"
              onClick={() => setShowGenderPicker(true)}
            >
              <span className="text-sm font-medium text-text-main">Show me</span>
              <div className="flex items-center text-text-sec text-sm gap-1">
                {getGenderLabel(showMe)} <Icons.ChevronRight size={16} />
              </div>
            </div>
            
            {/* Age Range */}
            <div 
              className="p-4 border-b border-warm-gray flex justify-between items-center cursor-pointer hover:bg-white transition-colors"
              onClick={() => setShowAgePicker(true)}
            >
              <span className="text-sm font-medium text-text-main">Age Range</span>
              <div className="flex items-center text-text-sec text-sm gap-1">
                {minAge} - {maxAge} <Icons.ChevronRight size={16} />
              </div>
            </div>
            
            {/* Distance */}
            <div 
              className="p-4 flex justify-between items-center cursor-pointer hover:bg-white transition-colors"
              onClick={() => setShowDistancePicker(true)}
            >
              <span className="text-sm font-medium text-text-main">Distance</span>
              <div className="flex items-center text-text-sec text-sm gap-1">
                {distance}km <Icons.ChevronRight size={16} />
              </div>
            </div>
          </div>
        </section>

        {/* Aura Settings */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Icons.Sparkles size={14} className="text-coral" />
            <h2 className="text-xs font-bold text-coral uppercase tracking-wider">Aura Settings</h2>
          </div>
          <div className="bg-warm-white rounded-2xl border border-warm-gray overflow-hidden">
            <div className="p-4 border-b border-warm-gray flex justify-between items-center">
              <span className="text-sm font-medium text-text-main">Let Aura find matches</span>
              <Toggle enabled={auraFindMatches} onChange={setAuraFindMatches} />
            </div>
            <div className="p-4 border-b border-warm-gray flex justify-between items-center">
              <span className="text-sm font-medium text-text-main">Aura-to-Aura conversations</span>
              <Toggle enabled={auraToAura} onChange={setAuraToAura} />
            </div>
            <div className="p-4 flex justify-between items-center">
              <span className="text-sm font-medium text-text-main">Show Trust Score on profile</span>
              <Toggle enabled={showTrustScore} onChange={setShowTrustScore} />
            </div>
          </div>
        </section>

        {/* Account */}
        <section>
          <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Account</h2>
          <div className="bg-warm-white rounded-2xl border border-warm-gray overflow-hidden">
            {[
              { label: 'Notifications', icon: Icons.Bell },
              { label: 'Privacy & Security', icon: Icons.ShieldCheck },
              { label: 'Help & Support', icon: Icons.MessageCircle },
            ].map((item, i) => (
              <div 
                key={i} 
                className="flex items-center p-4 border-b border-warm-gray last:border-0 hover:bg-white cursor-pointer transition-colors"
              >
                <item.icon size={18} className="text-text-muted mr-3" />
                <span className="text-sm font-medium text-text-main flex-1">{item.label}</span>
                <Icons.ChevronRight size={16} className="text-text-muted" />
              </div>
            ))}
          </div>
        </section>
        
        <button 
          onClick={onLogout}
          className="w-full py-3 rounded-xl border border-warm-gray bg-white text-text-main font-medium text-sm hover:bg-warm-white transition-colors"
        >
          Log Out
        </button>
        
        <button className="w-full py-3 rounded-xl text-text-muted font-medium text-xs hover:text-red-500 transition-colors">
          Delete account
        </button>
      </div>

      {/* Gender Picker Modal */}
      {showGenderPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={() => setShowGenderPicker(false)}>
          <div className="bg-white w-full max-w-md rounded-t-3xl p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-center mb-4">Show me</h3>
            <div className="space-y-2">
              {(['women', 'men', 'any'] as MatchGenderPreference[]).map(gender => (
                <button
                  key={gender}
                  onClick={() => { setShowMe(gender); setShowGenderPicker(false); }}
                  className={`w-full p-4 rounded-xl text-left font-medium transition-colors ${
                    showMe === gender 
                      ? 'bg-coral text-white' 
                      : 'bg-warm-white text-text-main hover:bg-warm-gray'
                  }`}
                >
                  {getGenderLabel(gender)}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setShowGenderPicker(false)}
              className="w-full mt-4 py-3 text-text-sec font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Age Picker Modal */}
      {showAgePicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={() => setShowAgePicker(false)}>
          <div className="bg-white w-full max-w-md rounded-t-3xl p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-center mb-4">Age Range</h3>
            <div className="space-y-6">
              <div>
                <label className="text-sm text-text-sec mb-2 block">Minimum Age: {minAge}</label>
                <input 
                  type="range" 
                  min="18" 
                  max="60" 
                  value={minAge}
                  onChange={(e) => setMinAge(Math.min(parseInt(e.target.value), maxAge - 1))}
                  className="w-full accent-coral"
                />
              </div>
              <div>
                <label className="text-sm text-text-sec mb-2 block">Maximum Age: {maxAge}</label>
                <input 
                  type="range" 
                  min="18" 
                  max="60" 
                  value={maxAge}
                  onChange={(e) => setMaxAge(Math.max(parseInt(e.target.value), minAge + 1))}
                  className="w-full accent-coral"
                />
              </div>
            </div>
            <button 
              onClick={() => setShowAgePicker(false)}
              className="w-full mt-6 py-3 bg-coral text-white rounded-xl font-bold"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Distance Picker Modal */}
      {showDistancePicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={() => setShowDistancePicker(false)}>
          <div className="bg-white w-full max-w-md rounded-t-3xl p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-center mb-4">Maximum Distance</h3>
            <div className="text-center text-3xl font-bold text-coral mb-4">{distance} km</div>
            <input 
              type="range" 
              min="1" 
              max="100" 
              value={distance}
              onChange={(e) => setDistance(parseInt(e.target.value))}
              className="w-full accent-coral"
            />
            <div className="flex justify-between text-xs text-text-muted mt-2">
              <span>1 km</span>
              <span>100 km</span>
            </div>
            <button 
              onClick={() => setShowDistancePicker(false)}
              className="w-full mt-6 py-3 bg-coral text-white rounded-xl font-bold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;

import React from 'react';
import { AuraProfile, SocialSpeed } from '../types';

interface NeuralProfilePanelProps {
  profile: AuraProfile;
  onChange: (profile: AuraProfile) => void;
}

const NeuralProfilePanel: React.FC<NeuralProfilePanelProps> = ({ profile, onChange }) => {
  const handleChange = <K extends keyof AuraProfile>(field: K, value: AuraProfile[K]) => {
    onChange({ ...profile, [field]: value });
  };

  const handleArrayToggle = (field: 'goals' | 'vibeWords' | 'topicsLike', item: string) => {
    const current = profile[field] || [];
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item];
    handleChange(field, updated);
  };

  const handleVibeTags = (text: string) => {
    const tags = text.split(',').map(t => t.trim()).filter(Boolean);
    handleChange('vibeTags', tags);
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const goalOptions = [
    { label: 'Make Friends', value: 'find friends' },
    { label: 'Dating Practice', value: 'dating practice' },
    { label: 'Social Skills', value: 'social skills' },
    { label: 'Just Venting', value: 'venting' },
    { label: 'Deep Connections', value: 'deep connections' }
  ];
  const vibeOptions = ['Calm', 'Playful', 'Deep', 'Sarcastic', 'Warm', 'Reserved', 'Curious', 'Creative'];
  const topicOptions = ['Music', 'Gaming', 'Movies', 'Books', 'Art', 'Tech', 'Nature', 'Fitness', 'Food', 'Travel'];

  return (
    <div className="space-y-6">
      {/* Avatar Preview Card */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col items-center gap-4">
        <p className="text-xs text-slate-500 uppercase tracking-wider">Your Profile Preview</p>
        <div className="flex flex-col items-center gap-4">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              className="w-20 h-20 rounded-full object-cover border border-violet-500/30"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600/40 to-blue-600/40 border border-violet-500/30 flex items-center justify-center">
              <span className="text-3xl font-bold text-violet-200">
                {getInitials(profile.displayName || '?')}
              </span>
            </div>
          )}
          <div className="text-center">
            <p className="font-medium text-slate-100">{profile.displayName || 'Your Name'}</p>
            {profile.bio && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{profile.bio}</p>}
            {(profile.vibeTags && profile.vibeTags.length > 0) && (
              <div className="flex flex-wrap gap-1 justify-center mt-2">
                {profile.vibeTags.slice(0, 3).map((tag, i) => (
                  <span key={i} className="text-xs bg-blue-600/20 text-blue-300 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-slate-300">Display Name</label>
        <input
          type="text"
          value={profile.displayName}
          onChange={(e) => handleChange('displayName', e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
          placeholder="Your name or nickname"
        />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-slate-300">Short Bio</label>
        <textarea
          value={profile.bio || ''}
          onChange={(e) => handleChange('bio', e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all resize-none h-16"
          placeholder="Tell people a bit about yourself..."
        />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-slate-300">Avatar URL</label>
        <input
          type="text"
          value={profile.avatarUrl || ''}
          onChange={(e) => handleChange('avatarUrl', e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
          placeholder="https://example.com/photo.jpg"
        />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-slate-300">Vibe Tags</label>
        <input
          type="text"
          value={profile.vibeTags?.join(', ') || ''}
          onChange={(e) => handleVibeTags(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
          placeholder="e.g. thoughtful, creative, spontaneous"
        />
        <p className="text-xs text-slate-500">Comma-separated tags that describe your vibe</p>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-slate-300">Age Range</label>
        <select
          value={profile.ageRange || ''}
          onChange={(e) => handleChange('ageRange', e.target.value || null)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all appearance-none cursor-pointer"
        >
          <option value="" className="bg-slate-900">Select age range</option>
          <option value="18-24" className="bg-slate-900">18-24</option>
          <option value="25-30" className="bg-slate-900">25-30</option>
          <option value="31-40" className="bg-slate-900">31-40</option>
          <option value="40+" className="bg-slate-900">40+</option>
        </select>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-slate-300">Social Goals</label>
        <div className="flex flex-wrap gap-2">
          {goalOptions.map((goal) => {
            const isSelected = profile.goals?.includes(goal.value);
            return (
              <button
                key={goal.value}
                onClick={() => handleArrayToggle('goals', goal.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-violet-600/40 text-violet-200 border border-violet-500/50'
                    : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                }`}
              >
                {goal.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-slate-300">Introversion Level</label>
          <span className="text-violet-400 font-mono text-sm">{profile.introversionLevel}/10</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={profile.introversionLevel}
          onChange={(e) => handleChange('introversionLevel', parseInt(e.target.value))}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
        />
        <div className="flex justify-between text-xs text-slate-500">
          <span>Extroverted</span>
          <span>Very Introverted</span>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-slate-300">Social Speed</label>
        <div className="flex gap-2">
          {(['slow', 'normal', 'fast'] as SocialSpeed[]).map((speed) => (
            <button
              key={speed}
              onClick={() => handleChange('socialSpeed', speed)}
              className={`flex-1 py-3 rounded-xl capitalize text-sm font-medium transition-all ${
                profile.socialSpeed === speed
                  ? 'bg-violet-600/40 text-violet-200 border border-violet-500/50'
                  : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
              }`}
            >
              {speed}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-slate-300">Your Vibe</label>
        <div className="flex flex-wrap gap-2">
          {vibeOptions.map((vibe) => {
            const isSelected = profile.vibeWords?.includes(vibe.toLowerCase());
            return (
              <button
                key={vibe}
                onClick={() => handleArrayToggle('vibeWords', vibe.toLowerCase())}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-blue-600/30 text-blue-200 border border-blue-500/40'
                    : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                }`}
              >
                {vibe}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-slate-300">Topics You Enjoy</label>
        <div className="flex flex-wrap gap-2">
          {topicOptions.map((topic) => {
            const isSelected = profile.topicsLike?.includes(topic.toLowerCase());
            return (
              <button
                key={topic}
                onClick={() => handleArrayToggle('topicsLike', topic.toLowerCase())}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-teal-600/30 text-teal-200 border border-teal-500/40'
                    : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                }`}
              >
                {topic}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-slate-300">Boundaries & Deal Breakers</label>
        <textarea
          value={profile.hardBoundaries?.join(', ') || ''}
          onChange={(e) => handleChange('hardBoundaries', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all resize-none h-24"
          placeholder="Things you absolutely won't tolerate (comma separated)"
        />
      </div>

      <div className="pt-4 border-t border-white/5">
        <p className="text-xs text-slate-500 text-center">
          Changes are saved automatically and will affect how your Aura interacts.
        </p>
      </div>
    </div>
  );
};

export default NeuralProfilePanel;

import React, { useEffect, useState } from 'react';
import { Icons } from '../components/Icons';
import { MatchWithProfile } from '../types';
import { fetchMatches } from '../services/matchService';

interface ChatProps {
  onChatSelect: (matchId: string) => void;
}

export const Chat: React.FC<ChatProps> = ({ onChatSelect }) => {
  const [matches, setMatches] = useState<MatchWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchMatches("me");
      setMatches(data);
      setLoading(false);
    };
    load();
  }, []);

  // Filter matches by search
  const filteredMatches = searchQuery 
    ? matches.filter(m => 
        m.other.auraProfile.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : matches;

  // Separate new matches (no messages yet) from conversations
  const newMatches = filteredMatches.filter(m => !m.match.twinTranscript?.length && !m.match.isAuraMatch);
  const auraMatches = filteredMatches.filter(m => m.match.isAuraMatch);
  const conversations = filteredMatches.filter(m => !m.match.isAuraMatch || m.match.twinTranscript?.length);

  // Get preview text for a match
  const getPreviewText = (m: MatchWithProfile): string => {
    if (m.match.isAuraMatch && m.match.twinTranscript?.length) {
      // Show last message from Aura convo
      const lastMsg = m.match.twinTranscript[m.match.twinTranscript.length - 1];
      return `✨ "${lastMsg.text}"`;
    }
    if (m.match.icebreaker) {
      return `💡 ${m.match.icebreaker}`;
    }
    return "Say hello! 👋";
  };

  // Format time ago
  const timeAgo = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return `${Math.floor(days / 7)}w`;
  };

  if (loading) {
    return (
      <div className="h-full bg-warm-white flex items-center justify-center">
        <Icons.Loader2 className="animate-spin text-coral" size={32} />
      </div>
    );
  }

  return (
    <div className="h-full bg-warm-white flex flex-col pt-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 px-5">
        <h1 className="text-2xl font-extrabold text-text-main">Connections</h1>
        <button 
          onClick={() => setShowSearch(!showSearch)}
          className={`p-3 rounded-2xl border transition-all ${
            showSearch 
              ? 'bg-coral text-white border-coral' 
              : 'bg-white border-warm-gray text-text-main hover:text-coral'
          }`}
        >
          <Icons.Search size={20} />
        </button>
      </div>

      {/* Search Bar (expandable) */}
      {showSearch && (
        <div className="px-5 mb-4 animate-in slide-in-from-top-2">
          <div className="relative">
            <Icons.Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search matches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-warm-gray rounded-2xl text-sm focus:outline-none focus:border-coral transition-colors"
              autoFocus
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main"
              >
                <Icons.X size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* New Matches Row */}
      {newMatches.length > 0 && (
        <div className="mb-6 px-5">
          <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4 ml-1">
            New Matches
          </h2>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {/* Add Self */}
            <div className="flex flex-col items-center gap-2 min-w-[72px]">
              <div className="w-[72px] h-[72px] rounded-[24px] bg-white border-2 border-dashed border-warm-gray flex items-center justify-center cursor-pointer hover:border-coral transition-colors text-coral">
                <Icons.Plus size={24} />
              </div>
              <span className="text-xs font-bold text-text-muted">You</span>
            </div>

            {/* New Match Avatars */}
            {newMatches.map((m) => (
              <div 
                key={m.match.id} 
                className="flex flex-col items-center gap-2 min-w-[72px] cursor-pointer group" 
                onClick={() => onChatSelect(m.other.uid)}
              >
                <div className="w-[72px] h-[72px] rounded-[24px] p-[2px] bg-gradient-to-tr from-coral to-gold">
                  <div className="w-full h-full rounded-[22px] border-2 border-white overflow-hidden">
                    <img 
                      src={m.other.auraProfile.photos[0]} 
                      alt={m.other.auraProfile.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                </div>
                <span className="text-xs font-bold text-text-main">{m.other.auraProfile.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aura Matches Section (Special highlight) */}
      {auraMatches.length > 0 && (
        <div className="mb-4 px-5">
          <div className="flex items-center gap-2 mb-3">
            <Icons.Sparkles size={14} className="text-coral" />
            <h2 className="text-xs font-bold text-coral uppercase tracking-wider">
              Aura Matches
            </h2>
            <span className="text-[10px] bg-coral/10 text-coral px-2 py-0.5 rounded-full font-bold">
              {auraMatches.length} new
            </span>
          </div>
          
          <div className="space-y-2">
            {auraMatches.map((m) => (
              <div 
                key={m.match.id}
                onClick={() => onChatSelect(m.other.uid)}
                className="relative overflow-hidden bg-gradient-to-r from-coral/5 to-gold/5 rounded-3xl border border-coral/20 p-4 cursor-pointer hover:border-coral/40 transition-all group"
              >
                {/* Sparkle decoration */}
                <div className="absolute top-2 right-2 opacity-30">
                  <Icons.Sparkles size={24} className="text-coral" />
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Avatar with Aura ring */}
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-coral to-gold">
                      <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
                        <img 
                          src={m.other.auraProfile.photos[0]} 
                          alt={m.other.auraProfile.name}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-coral rounded-full flex items-center justify-center border-2 border-white">
                      <Icons.Sparkles size={12} className="text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-text-main">{m.other.auraProfile.name}</h3>
                      <span className="text-[10px] font-bold text-coral">
                        {m.match.compatibilityScore || 90}% match
                      </span>
                    </div>
                    
                    {/* Transcript preview */}
                    {m.match.twinTranscript && m.match.twinTranscript.length > 0 ? (
                      <p className="text-sm text-text-sec truncate italic">
                        "{m.match.twinTranscript[m.match.twinTranscript.length - 1].text}"
                      </p>
                    ) : (
                      <p className="text-sm text-coral font-medium">
                        Your Auras connected! Tap to see what they said ✨
                      </p>
                    )}
                  </div>
                </div>

                {/* Icebreaker suggestion */}
                {m.match.icebreaker && (
                  <div className="mt-3 pt-3 border-t border-coral/10">
                    <p className="text-xs text-text-muted mb-1">💡 Suggested opener:</p>
                    <p className="text-sm text-text-main font-medium truncate">
                      "{m.match.icebreaker}"
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Conversations */}
      <div className="flex-1 overflow-y-auto px-5 pb-36">
        <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 ml-1">
          Conversations
        </h2>
        
        <div className="space-y-2">
          {conversations.filter(m => !m.match.isAuraMatch).map((m) => (
            <div 
              key={m.match.id}
              onClick={() => onChatSelect(m.other.uid)}
              className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-transparent hover:border-warm-gray transition-all cursor-pointer shadow-sm group"
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-warm-gray">
                  <img 
                    src={m.other.auraProfile.photos[0]} 
                    alt={m.other.auraProfile.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                  />
                </div>
                {/* Online indicator (mock) */}
                {Math.random() > 0.5 && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-text-main text-base">
                    {m.other.auraProfile.name}
                  </h3>
                  <span className="text-[10px] font-bold text-text-muted">
                    {timeAgo(m.match.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-text-sec truncate">
                  {getPreviewText(m)}
                </p>
              </div>
              
              {/* Unread indicator */}
              {Math.random() > 0.7 && (
                <div className="w-3 h-3 bg-coral rounded-full flex-shrink-0" />
              )}
            </div>
          ))}

          {/* Empty State */}
          {filteredMatches.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-warm-gray/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icons.MessageCircle size={32} className="text-text-muted" />
              </div>
              <h3 className="font-bold text-text-main mb-2">
                {searchQuery ? 'No matches found' : 'No connections yet'}
              </h3>
              <p className="text-sm text-text-muted max-w-[200px] mx-auto">
                {searchQuery 
                  ? `No one named "${searchQuery}"` 
                  : 'Start swiping to find your matches!'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
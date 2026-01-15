import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../components/Icons';
import { UserProfile, DateIdea, MatchMessage, MessageType, MatchPair } from '../types';
import { fetchMessages, sendMessage } from '../services/messaging';
import { generateReplyOptions, generateDateIdeas } from '../services/auraLLM';
import { ReportModal } from '../components/ReportModal';
import { reportUser, unmatchProfile, fetchMatches } from '../services/matchService';
import { compressImage } from '../utils/image';

interface ChatDetailProps {
  match: UserProfile;
  onBack: () => void;
  onViewProfile?: () => void;
}

const EMOJIS = ["😊", "😂", "🥰", "😍", "😘", "😜", "🤔", "🥺", "😭", "😤", "👋", "👌", "✌️", "🤞", "❤️", "🔥", "✨", "🥂", "🍕", "🌹"];

const GIFS = [
  "https://media.tenor.com/On7kbMGyYQ4AAAAC/hello.gif",
  "https://media.tenor.com/p_oQWjV9g04AAAAC/excited-minions.gif",
  "https://media.tenor.com/M6LgO69u398AAAAC/cat-love.gif",
  "https://media.tenor.com/h5vR6h7Y32IAAAAC/cheers-leonardo-dicaprio.gif",
];

export const ChatDetail: React.FC<ChatDetailProps> = ({ match, onBack, onViewProfile }) => {
  const [messages, setMessages] = useState<MatchMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [showReplyLab, setShowReplyLab] = useState(false);
  const [replySuggestions, setReplySuggestions] = useState<{safe: string, direct: string, playful: string} | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showReportSuccess, setShowReportSuccess] = useState(false);
  const [showUnmatchConfirm, setShowUnmatchConfirm] = useState(false);
  
  // Media State
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Aura State
  const [auraTranscript, setAuraTranscript] = useState<any[] | null>(null);
  const [isAuraMode, setIsAuraMode] = useState(false);
  const [matchData, setMatchData] = useState<MatchPair | null>(null);
  const [showTranscript, setShowTranscript] = useState(true);
  const [icebreakerCopied, setIcebreakerCopied] = useState(false);
  
  // Date Planner State
  const [showDatePlanner, setShowDatePlanner] = useState(false);
  const [dateIdeas, setDateIdeas] = useState<DateIdea[]>([]);
  const [loadingIdeas, setLoadingIdeas] = useState(false);
  
  // Moment Creator State
  const [showMomentCreator, setShowMomentCreator] = useState(false);
  const [momentCaption, setMomentCaption] = useState("");
  const [momentImage, setMomentImage] = useState<string | null>(null);
  const momentInputRef = useRef<HTMLInputElement>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const load = async () => {
      const msgs = await fetchMessages(match.id);
      setMessages(msgs);
      scrollToBottom();
      
      // Check if this is an Aura Match
      const allMatches = await fetchMatches("me");
      const currentMatch = allMatches.find(m => m.other.uid === match.id);
      
      if (currentMatch?.match) {
        setMatchData(currentMatch.match);
        
        if (currentMatch.match.isAuraMatch && msgs.length === 0) {
          setAuraTranscript(currentMatch.match.twinTranscript || []);
          setIsAuraMode(true);
        }
      }
    };
    load();
  }, [match.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, auraTranscript]);

  const handleSend = async (text?: string, type: MessageType = 'text', mediaUrl?: string) => {
    const txt = text || inputText;
    if (!txt.trim() && type === 'text') return;
    
    if (isAuraMode) {
      setIsAuraMode(false);
    }
    
    const temp: MatchMessage = {
      id: `temp_${Date.now()}`,
      matchId: match.id,
      fromUid: "me",
      text: txt,
      type: type,
      mediaUrl: mediaUrl,
      createdAt: Date.now()
    };
    setMessages(prev => [...prev, temp]);
    setInputText("");
    setShowReplyLab(false);
    setShowEmojiPicker(false);
    setShowGifPicker(false);

    await sendMessage(match.id, "me", txt, type, mediaUrl);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const url = await compressImage(file, 800, 0.7);
        handleSend("Sent a photo", 'image', url);
      } catch (error) {
        console.error("Failed to process image", error);
      }
    }
  };

  const handleOpenReplyLab = async () => {
    if (showReplyLab) {
      setShowReplyLab(false);
      return;
    }
    const lastMsg = messages[messages.length - 1]?.text || "Hello";
    const opts = await generateReplyOptions(match, lastMsg);
    setReplySuggestions(opts);
    setShowReplyLab(true);
    setShowEmojiPicker(false);
    setShowGifPicker(false);
  };
  
  const handleOpenDatePlanner = async () => {
    setShowDatePlanner(true);
    if (dateIdeas.length === 0) {
      setLoadingIdeas(true);
      const myProfile = { name: "Me", interests: ["Coffee", "Tech"], vibeTags: ["Chill"] } as any; 
      const ideas = await generateDateIdeas(myProfile, match);
      setDateIdeas(ideas);
      setLoadingIdeas(false);
    }
  };

  const confirmDate = (idea: DateIdea) => {
    const dateMsg = `📅 wanna do ${idea.title}? theres this place called ${idea.locationName} that looks cute`;
    handleSend(dateMsg);
    setShowDatePlanner(false);
  };

  const handleMomentImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const url = await compressImage(file, 800, 0.7);
        setMomentImage(url);
      } catch (error) {
        console.error("Moment image failed", error);
      }
    }
  };

  const handleCreateMoment = () => {
    if(!momentImage) {
      alert("Please select a photo for your moment!");
      return;
    }
    alert("Moment Shared! (Demo)");
    setShowMomentCreator(false);
    setMomentImage(null);
    setMomentCaption("");
  };

  const handleReport = async (reason: string) => {
    await reportUser(match.id, reason);
    setShowReportSuccess(true);
    setTimeout(() => {
      setShowReportSuccess(false);
      onBack(); 
    }, 2000);
  };

  const handleUnmatch = async () => {
    await unmatchProfile("me", match.id);
    setShowUnmatchConfirm(false);
    onBack();
  };

  const copyIcebreaker = () => {
    const icebreaker = matchData?.icebreaker || '';
    if (icebreaker) {
      navigator.clipboard.writeText(icebreaker);
      setIcebreakerCopied(true);
      setTimeout(() => setIcebreakerCopied(false), 2000);
    }
  };

  const useIcebreaker = () => {
    const icebreaker = matchData?.icebreaker || '';
    if (icebreaker) {
      setInputText(icebreaker);
      setIsAuraMode(false);
    }
  };

  return (
    <div className="h-full bg-white flex flex-col relative">
      
      {/* Header */}
      <div className="px-4 py-3 border-b border-warm-gray flex items-center gap-3 sticky top-0 bg-white/95 backdrop-blur-md z-10 shadow-sm">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-warm-white rounded-full text-text-sec">
          <Icons.ChevronLeft size={24} />
        </button>
        
        <div className="flex-1 flex items-center gap-3 cursor-pointer" onClick={onViewProfile}>
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-warm-gray">
              <img src={match.photos[0]} alt={match.name} className="w-full h-full object-cover" />
            </div>
            {match.verified && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-text-main text-sm">{match.name}</h2>
              {matchData?.isAuraMatch && (
                <span className="text-[9px] bg-coral/10 text-coral px-1.5 py-0.5 rounded font-bold">
                  {matchData.compatibilityScore || 90}%
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <span className="text-xs text-text-muted">Online</span>
            </div>
          </div>
        </div>
        
        <button onClick={handleOpenDatePlanner} className="p-2 text-coral hover:bg-coral-light/10 rounded-full transition-colors">
          <Icons.Calendar size={22} />
        </button>

        <button onClick={() => setShowMenu(!showMenu)} className="p-2 text-text-muted hover:text-coral transition-colors">
          <Icons.MoreHorizontal size={22} />
        </button>
        
        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute top-14 right-4 bg-white border border-warm-gray shadow-xl rounded-2xl py-2 w-44 z-20 animate-in fade-in zoom-in-95 origin-top-right">
            <button onClick={onViewProfile} className="w-full text-left px-4 py-2.5 text-sm text-text-main hover:bg-warm-white font-medium flex items-center gap-3">
              <Icons.User size={16} />
              View Profile
            </button>
            <button onClick={() => {setShowMenu(false); setShowMomentCreator(true);}} className="w-full text-left px-4 py-2.5 text-sm text-text-main hover:bg-warm-white font-medium flex items-center gap-3">
              <Icons.Camera size={16} />
              Share Moment
            </button>
            <button onClick={() => { setShowMenu(false); setShowUnmatchConfirm(true); }} className="w-full text-left px-4 py-2.5 text-sm text-text-main hover:bg-warm-white font-medium flex items-center gap-3">
              <Icons.UserMinus size={16} />
              Unmatch
            </button>
            <div className="h-px bg-warm-gray my-1" />
            <button onClick={() => { setShowMenu(false); setShowReport(true); }} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-medium flex items-center gap-3">
              <Icons.Flag size={16} />
              Report User
            </button>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-warm-white/30" onClick={() => setShowMenu(false)}>
        
        {/* Aura Match Header (always show if aura match) */}
        {matchData?.isAuraMatch && (
          <div className="mb-4">
            {/* Aura Match Banner */}
            <div className="bg-gradient-to-r from-coral/5 via-gold/5 to-coral/5 rounded-3xl p-4 border border-coral/20 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-coral/10 flex items-center justify-center">
                    <Icons.Sparkles size={16} className="text-coral" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-coral uppercase tracking-wide">Aura Match</span>
                    <p className="text-[10px] text-text-muted">your twins already talked ✨</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-coral">{matchData.compatibilityScore || 90}%</span>
                  <p className="text-[10px] text-text-muted">compatible</p>
                </div>
              </div>
              
              {/* Toggle transcript */}
              {auraTranscript && auraTranscript.length > 0 && (
                <button 
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="w-full text-left text-xs text-coral font-bold flex items-center justify-between py-2 border-t border-coral/10 mt-2"
                >
                  <span>{showTranscript ? 'Hide' : 'Show'} what your Auras said</span>
                  <Icons.ChevronDown size={14} className={`transition-transform ${showTranscript ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>

            {/* Aura Transcript (collapsible) */}
            {showTranscript && auraTranscript && auraTranscript.length > 0 && (
              <div className="bg-white rounded-2xl border border-warm-gray p-4 mb-4 animate-in slide-in-from-top-2">
                <div className="space-y-3">
                  {auraTranscript.map((msg, i) => {
                    const isMe = msg.from === 'auraA'; 
                    return (
                      <div 
                        key={i} 
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[85%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                          <span className={`text-[9px] font-bold mb-1 ${isMe ? 'text-coral/70 mr-1' : 'text-text-muted ml-1'}`}>
                            {isMe ? 'ur aura' : `${match.name}'s aura`}
                          </span>
                          <div className={`px-3 py-2 rounded-2xl text-xs ${
                            isMe 
                              ? 'bg-coral/10 text-text-main rounded-tr-sm' 
                              : 'bg-warm-white text-text-main rounded-tl-sm border border-warm-gray'
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                
                <div className="mt-3 pt-3 border-t border-warm-gray text-center">
                  <p className="text-[10px] text-text-muted italic">
                    thats how ur auras vibed. now its ur turn 👀
                  </p>
                </div>
              </div>
            )}

            {/* Icebreaker Suggestion */}
            {matchData.icebreaker && isAuraMode && (
              <div className="bg-gradient-to-r from-gold/10 to-coral/10 rounded-2xl p-4 border border-gold/20">
                <div className="flex items-center gap-2 mb-2">
                  <Icons.Lightbulb size={14} className="text-gold" />
                  <span className="text-[10px] font-bold text-gold uppercase tracking-wide">suggested opener</span>
                </div>
                <p className="text-sm text-text-main mb-3 leading-relaxed">
                  "{matchData.icebreaker}"
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={useIcebreaker}
                    className="flex-1 py-2 bg-coral text-white text-xs font-bold rounded-xl hover:bg-coral-dark transition-colors"
                  >
                    Use this
                  </button>
                  <button 
                    onClick={copyIcebreaker}
                    className="px-4 py-2 bg-white border border-warm-gray text-xs font-bold rounded-xl hover:border-coral transition-colors flex items-center gap-1"
                  >
                    {icebreakerCopied ? (
                      <>
                        <Icons.Check size={12} className="text-green-500" />
                        copied!
                      </>
                    ) : (
                      <>
                        <Icons.Copy size={12} />
                        copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Regular Intro (non-aura matches) */}
        {!matchData?.isAuraMatch && messages.length === 0 && (
          <div className="flex justify-center my-6">
            <div className="bg-gradient-to-r from-coral-light/50 to-orange-100 p-4 rounded-2xl border border-coral/10 max-w-[85%] text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2 text-coral">
                <Icons.Sparkles size={14} className="fill-coral" />
                <span className="text-[10px] font-bold uppercase">Aura Tip</span>
              </div>
              <p className="text-xs text-text-sec">
                {match.interests && match.interests[0] 
                  ? `they're into ${match.interests[0].toLowerCase()}... maybe start there? 👀`
                  : "just be urself, thats the vibe ✨"
                }
              </p>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((m, i) => {
          const isMe = m.fromUid === 'me';
          return (
            <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} gap-2`}>
              {!isMe && (
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mt-auto flex-shrink-0">
                  <img src={match.photos[0]} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                {m.type === 'image' && m.mediaUrl && (
                  <div className={`mb-1 overflow-hidden rounded-2xl border border-warm-gray ${isMe ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}>
                    <img src={m.mediaUrl} className="max-w-full h-auto object-cover" alt="" />
                  </div>
                )}
                {m.type === 'gif' && m.mediaUrl && (
                  <div className={`mb-1 overflow-hidden rounded-2xl border border-warm-gray ${isMe ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}>
                    <img src={m.mediaUrl} className="max-w-full h-auto object-cover" alt="" />
                  </div>
                )}
                
                {(m.type === 'text' || (m.text && !['Sent a photo', 'Sent a GIF'].includes(m.text))) && (
                  <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm ${
                    isMe 
                      ? 'bg-coral text-white rounded-tr-sm' 
                      : 'bg-white border border-warm-gray text-text-main rounded-tl-sm'
                  }`}>
                    <p>{m.text}</p>
                  </div>
                )}
                
                {/* Time stamp for last message */}
                {i === messages.length - 1 && (
                  <span className={`text-[9px] text-text-muted mt-1 ${isMe ? 'mr-1' : 'ml-1'}`}>
                    {isMe ? 'sent' : 'received'} just now
                  </span>
                )}
              </div>
            </div>
          )
        })}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-warm-gray z-20">
        
        {/* Aura Mode Decision Buttons */}
        {isAuraMode && messages.length === 0 ? (
          <div className="p-4 space-y-3">
            {/* Quick action buttons */}
            <div className="flex gap-2">
              <button 
                onClick={onBack}
                className="flex-1 py-3 border border-warm-gray rounded-2xl text-sm font-bold text-text-muted hover:bg-gray-50 transition-colors"
              >
                not feeling it
              </button>
              <button 
                onClick={() => setIsAuraMode(false)}
                className="flex-1 py-3 bg-coral text-white rounded-2xl text-sm font-bold shadow-lg shadow-coral/30 hover:bg-coral-dark transition-all"
              >
                lets chat! 💬
              </button>
            </div>
          </div>
        ) : (
          // Standard Input
          <>
            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="h-40 overflow-y-auto bg-warm-white border-b border-warm-gray p-4 animate-in slide-in-from-bottom-4">
                <div className="grid grid-cols-10 gap-2">
                  {EMOJIS.map(e => (
                    <button 
                      key={e} 
                      onClick={() => setInputText(prev => prev + e)} 
                      className="text-xl hover:scale-125 transition-transform"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* GIF Picker */}
            {showGifPicker && (
              <div className="h-40 overflow-x-auto bg-warm-white border-b border-warm-gray p-3 animate-in slide-in-from-bottom-4 flex gap-2 no-scrollbar">
                {GIFS.map(url => (
                  <img 
                    key={url} 
                    src={url} 
                    onClick={() => handleSend("", 'gif', url)}
                    className="h-full w-auto rounded-xl object-cover cursor-pointer hover:opacity-80 transition-opacity" 
                    alt=""
                  />
                ))}
              </div>
            )}

            {/* Reply Lab */}
            {showReplyLab && replySuggestions && (
              <div className="p-4 bg-warm-white border-b border-warm-gray animate-in slide-in-from-bottom-4">
                <div className="flex items-center gap-2 mb-3">
                  <Icons.Sparkles size={14} className="text-coral" />
                  <span className="text-xs font-bold text-coral uppercase">reply ideas</span>
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {Object.entries(replySuggestions).map(([key, text]) => (
                    <button 
                      key={key} 
                      onClick={() => handleSend(text as string)}
                      className="flex-shrink-0 min-w-[140px] max-w-[200px] p-3 rounded-xl bg-white border border-warm-gray text-left hover:border-coral transition-colors text-xs"
                    >
                      <span className="block font-bold text-text-muted uppercase text-[9px] mb-1">{key}</span>
                      <span className="text-text-main">{text as string}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3 flex items-end gap-2">
              <div className="flex gap-1 pb-2">
                <button 
                  onClick={() => {setShowEmojiPicker(!showEmojiPicker); setShowGifPicker(false); setShowReplyLab(false)}} 
                  className={`p-2 rounded-full transition-colors ${showEmojiPicker ? 'text-coral bg-coral-light/20' : 'text-text-muted hover:bg-warm-white'}`}
                >
                  <Icons.Smile size={20} />
                </button>
                <button 
                  onClick={() => {setShowGifPicker(!showGifPicker); setShowEmojiPicker(false); setShowReplyLab(false)}} 
                  className={`p-2 rounded-full transition-colors ${showGifPicker ? 'text-coral bg-coral-light/20' : 'text-text-muted hover:bg-warm-white'}`}
                >
                  <Icons.Sticker size={20} />
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="p-2 rounded-full text-text-muted hover:bg-warm-white transition-colors"
                >
                  <Icons.ImagePlus size={20} />
                </button>
                <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handlePhotoUpload} />
              </div>

              <div className="flex-1 bg-warm-white border border-warm-gray rounded-3xl px-4 py-2 flex items-center min-h-[44px]">
                <textarea 
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="say something..." 
                  rows={1}
                  className="bg-transparent w-full outline-none text-sm text-text-main placeholder-text-muted resize-none pt-1 max-h-24"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <button 
                  onClick={handleOpenReplyLab} 
                  className={`p-1.5 ml-1 rounded-full transition-colors ${showReplyLab ? 'bg-coral-light text-coral' : 'text-text-muted hover:bg-gray-100'}`}
                >
                  <Icons.Sparkles size={16} />
                </button>
              </div>
              
              <button 
                onClick={() => handleSend()} 
                disabled={!inputText.trim()} 
                className="p-3 bg-coral text-white rounded-full shadow-md hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
              >
                <Icons.Send size={18} />
              </button>
            </div>
          </>
        )}
      </div>
      
      {/* Date Planner Modal */}
      {showDatePlanner && (
        <div className="fixed inset-0 z-[70] bg-warm-white flex flex-col animate-in slide-in-from-bottom duration-300">
          <div className="px-6 py-4 border-b border-warm-gray flex justify-between items-center bg-white">
            <div>
              <h3 className="font-bold text-lg text-text-main">plan a date</h3>
              <p className="text-xs text-text-sec">spots picked based on both ur vibes ✨</p>
            </div>
            <button onClick={() => setShowDatePlanner(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
              <Icons.X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loadingIdeas ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <Icons.Loader2 size={32} className="text-coral animate-spin" />
                <p className="text-sm font-bold text-text-muted">finding perfect spots...</p>
              </div>
            ) : (
              dateIdeas.map((idea) => (
                <div 
                  key={idea.id} 
                  className="bg-white rounded-3xl p-5 border border-warm-gray shadow-sm hover:border-coral/50 transition-all cursor-pointer group" 
                  onClick={() => confirmDate(idea)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-coral-light/20 text-coral px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                      {idea.vibe}
                    </span>
                    <Icons.MapPin size={16} className="text-text-muted" />
                  </div>
                  <h4 className="text-lg font-bold text-text-main mb-1">{idea.title}</h4>
                  <p className="text-xs text-text-sec font-bold mb-3">@ {idea.locationName}</p>
                  <p className="text-sm text-text-main leading-relaxed mb-4">{idea.description}</p>
                  
                  <div className="bg-warm-gray/30 p-3 rounded-xl">
                    <p className="text-[10px] text-text-muted font-bold uppercase mb-1">why this works</p>
                    <p className="text-xs text-text-sec italic">"{idea.whyItWorks}"</p>
                  </div>
                  
                  <button className="w-full mt-4 py-3 bg-text-main text-white rounded-xl font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    suggest this
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Moment Creator Modal */}
      {showMomentCreator && (
        <div className="fixed inset-0 z-[90] bg-black/80 flex flex-col justify-end">
          <div className="bg-white rounded-t-[32px] p-6 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl">share a moment</h3>
              <button onClick={() => setShowMomentCreator(false)}>
                <Icons.X size={24} />
              </button>
            </div>
            
            <div 
              onClick={() => momentInputRef.current?.click()}
              className="aspect-square bg-gray-100 rounded-2xl mb-4 flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-400 cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden"
            >
              {momentImage ? (
                <img src={momentImage} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Icons.Camera size={32} />
                  <span className="text-xs font-bold">tap to add photo</span>
                </div>
              )}
            </div>
            <input type="file" ref={momentInputRef} accept="image/*" className="hidden" onChange={handleMomentImageSelect} />
            
            <textarea 
              value={momentCaption}
              onChange={e => setMomentCaption(e.target.value)}
              placeholder="how was the vibe?"
              className="w-full bg-warm-white p-4 rounded-xl text-sm border border-warm-gray outline-none focus:border-coral mb-4 resize-none h-20"
            />
            
            <button 
              onClick={handleCreateMoment}
              disabled={!momentImage}
              className="w-full py-4 bg-coral text-white font-bold rounded-2xl shadow-lg disabled:opacity-50 transition-all"
            >
              post moment ✨
            </button>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReport && (
        <ReportModal 
          userName={match.name} 
          onClose={() => setShowReport(false)} 
          onSubmit={handleReport} 
        />
      )}

      {/* Unmatch Confirmation */}
      {showUnmatchConfirm && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-xs p-6 shadow-2xl animate-in zoom-in-95 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <Icons.UserMinus size={24} />
            </div>
            <h3 className="text-lg font-bold text-text-main mb-2">unmatch {match.name}?</h3>
            <p className="text-sm text-text-sec mb-6">
              theyll be gone and u cant message them anymore
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowUnmatchConfirm(false)}
                className="flex-1 py-3 font-bold text-sm text-text-sec bg-gray-100 rounded-xl hover:bg-gray-200"
              >
                nvm
              </button>
              <button 
                onClick={handleUnmatch}
                className="flex-1 py-3 font-bold text-sm text-white bg-red-500 rounded-xl hover:bg-red-600"
              >
                unmatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showReportSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-black/90 text-white px-6 py-3 rounded-full shadow-2xl z-[100] flex items-center gap-2 animate-in slide-in-from-top-4">
          <Icons.CheckCircle size={18} className="text-green-400" />
          <span className="font-bold text-sm">report submitted</span>
        </div>
      )}
    </div>
  );
};
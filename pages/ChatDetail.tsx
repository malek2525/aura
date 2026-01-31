import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, MoreVertical, User, AlertTriangle, UserMinus, Sparkles, Smile, Image as ImageIcon, Send, Gamepad2, Camera, Upload, X } from "lucide-react";
import { UserProfile, Match, TwinChatMessage } from "../types";
import {
  fetchMatches,
  reportUser,
  unmatchProfile,
} from "../services/matchService";
import { ChatGames, GameData } from "../components/ChatGames";

interface ChatDetailProps {
  match: UserProfile;
  onBack: () => void;
  onViewProfile?: () => void;
}

interface ChatMessage {
  id: string;
  fromMe: boolean;
  text: string;
  timestamp: number;
  type?: "text" | "image" | "gif" | "game";
  mediaUrl?: string;
  gameData?: GameData;
}

const EMOJIS = [
  "😊",
  "😂",
  "🥰",
  "😍",
  "😘",
  "😜",
  "🤔",
  "🥺",
  "👋",
  "👌",
  "✌️",
  "🤞",
  "❤️",
  "🔥",
  "✨",
  "🥂",
  "🍕",
  "🌹",
  "💀",
  "🙈",
];

const GIFS = [
  "https://media.tenor.com/On7kbMGyYQ4AAAAC/hello.gif",
  "https://media.tenor.com/p_oQWjV9g04AAAAC/excited-minions.gif",
  "https://media.tenor.com/M6LgO69u398AAAAC/cat-love.gif",
  "https://media.tenor.com/h5vR6h7Y32IAAAAC/cheers-leonardo-dicaprio.gif",
];

// Demo messages for testing
const DEMO_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    fromMe: false,
    text: "hey! saw we matched ✨",
    timestamp: Date.now() - 3600000,
  },
  {
    id: "2",
    fromMe: true,
    text: "hii! yeah ur profile is so cute",
    timestamp: Date.now() - 3500000,
  },
  {
    id: "3",
    fromMe: false,
    text: "aw thanks! i love ur vibe",
    timestamp: Date.now() - 3400000,
  },
  {
    id: "4",
    fromMe: false,
    text: "what r u up to today?",
    timestamp: Date.now() - 3300000,
  },
];

export const ChatDetail: React.FC<ChatDetailProps> = ({
  match,
  onBack,
  onViewProfile,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(DEMO_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showUnmatchConfirm, setShowUnmatchConfirm] = useState(false);

  // Media State
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showGames, setShowGames] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Aura State
  const [auraTranscript, setAuraTranscript] = useState<
    TwinChatMessage[] | null
  >(null);
  const [showTranscript, setShowTranscript] = useState(true);
  const [matchData, setMatchData] = useState<Match | null>(null);
  
  // Game State - Games stored separately from chat messages
  const [activeGames, setActiveGames] = useState<GameData[]>([]);
  const [viewingGame, setViewingGame] = useState<GameData | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const load = async () => {
      try {
        const allMatches = await fetchMatches("me");
        const currentMatch = allMatches.find(
          (m: any) => m.profile?.id === match.id || m.id === match.id,
        );

        if (currentMatch) {
          setMatchData(currentMatch);
          if (currentMatch.isAuraMatch && currentMatch.transcript) {
            setAuraTranscript(currentMatch.transcript);
          }
        }
      } catch (e) {
        console.log("Could not load match data");
      }
    };
    load();
  }, [match.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, auraTranscript]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      handleSend("", "image", base64);
    };
    reader.readAsDataURL(file);
    setShowMediaPicker(false);
    e.target.value = "";
  };

  const handleSend = (
    text?: string,
    type: "text" | "image" | "gif" = "text",
    mediaUrl?: string,
  ) => {
    const txt = text || inputText;
    if (!txt.trim() && type === "text" && !mediaUrl) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      fromMe: true,
      text: txt,
      timestamp: Date.now(),
      type,
      mediaUrl,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
    setShowEmojiPicker(false);
    setShowGifPicker(false);
    setShowMediaPicker(false);

    // Simulate reply after 2 seconds
    setTimeout(() => {
      const replies = [
        "haha nice 😄",
        "omg same!",
        "tell me more 👀",
        "that's so cool",
        "i love that",
        "fr fr",
        "okay but why is that so relatable",
      ];
      const reply: ChatMessage = {
        id: `msg_${Date.now()}`,
        fromMe: false,
        text: replies[Math.floor(Math.random() * replies.length)],
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, reply]);
    }, 2000);
  };

  const handleReport = async (reason: string) => {
    await reportUser("me", match.id, reason);
    setShowReportModal(false);
    onBack();
  };

  const handleUnmatch = async () => {
    await unmatchProfile(match.id);
    setShowUnmatchConfirm(false);
    onBack();
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white sticky top-0 z-10">
        <button
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft size={24} className="text-gray-600" />
        </button>

        <div
          className="flex items-center gap-3 flex-1 cursor-pointer"
          onClick={onViewProfile}
        >
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
            <img
              src={match.photos?.[0]}
              alt={match.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{match.name}</h2>
            <p className="text-xs text-gray-500">Tap to view profile</p>
          </div>
        </div>

        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <MoreVertical size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Menu Dropdown */}
      {showMenu && (
        <div className="absolute right-4 top-16 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20 min-w-[180px]">
          <button
            onClick={() => {
              setShowMenu(false);
              onViewProfile?.();
            }}
            className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3"
          >
            <User size={18} /> View Profile
          </button>
          <button
            onClick={() => {
              setShowMenu(false);
              setShowReportModal(true);
            }}
            className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3"
          >
            <AlertTriangle size={18} /> Report
          </button>
          <button
            onClick={() => {
              setShowMenu(false);
              setShowUnmatchConfirm(true);
            }}
            className="w-full px-4 py-3 text-left text-sm font-medium text-red-500 hover:bg-red-50 flex items-center gap-3"
          >
            <UserMinus size={18} /> Unmatch
          </button>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Aura Transcript */}
        {auraTranscript && showTranscript && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-purple-500" />
                <span className="text-xs font-semibold text-purple-500">
                  Aura Conversation
                </span>
              </div>
              <button
                onClick={() => setShowTranscript(false)}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Hide
              </button>
            </div>

            <div className="bg-purple-50 rounded-2xl p-4 space-y-3">
              {auraTranscript.map((msg, i) => (
                <div
                  key={msg.id || i}
                  className={`flex ${msg.from === "auraA" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                      msg.from === "auraA"
                        ? "bg-purple-500 text-white"
                        : "bg-white text-gray-800"
                    }`}
                  >
                    <p className="text-[10px] opacity-70 mb-1">
                      {msg.senderName || (msg.from === "auraA" ? "My Aura" : `${match.name}'s Aura`)}
                    </p>
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {(matchData as any)?.icebreaker && (
              <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">
                  💡 Suggested opener:
                </p>
                <p className="text-sm text-gray-800 font-medium">
                  "{(matchData as any).icebreaker}"
                </p>
              </div>
            )}
          </div>
        )}

        {/* Active Games Banner */}
        {activeGames.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Gamepad2 size={14} className="text-purple-500" />
              <span className="text-xs font-bold text-purple-500 uppercase tracking-wide">Active Games</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {activeGames.map((game, idx) => (
                <button
                  key={idx}
                  onClick={() => setViewingGame(game)}
                  className="flex-shrink-0 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🎮</span>
                    <span className="text-xs font-bold">
                      {game.gameType === 'would-you-rather' ? 'Would You Rather' : 
                       game.gameType === 'this-or-that' ? 'This or That' :
                       game.gameType === 'two-truths' ? '2 Truths 1 Lie' :
                       game.gameType === 'hot-takes' ? 'Hot Take' : 
                       game.gameType === 'question-game' ? '36 Questions' :
                       game.gameType === 'emoji-story' ? 'Emoji Story' :
                       game.gameType === 'compatibility' ? 'Compatibility' : 'Game'}
                    </span>
                  </div>
                  <p className="text-[10px] opacity-80 mt-1">Tap to play</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] ${msg.fromMe ? "order-2" : "order-1"}`}
            >
              {msg.type === "gif" && msg.mediaUrl ? (
                <img
                  src={msg.mediaUrl}
                  alt="GIF"
                  className="rounded-2xl max-w-full"
                />
              ) : msg.type === "image" && msg.mediaUrl ? (
                <img
                  src={msg.mediaUrl}
                  alt="Photo"
                  className="rounded-2xl max-w-full"
                />
              ) : (
                <div
                  className={`px-4 py-3 rounded-3xl ${
                    msg.fromMe
                      ? "bg-gray-900 text-white rounded-br-lg"
                      : "bg-gray-100 text-gray-900 rounded-bl-lg"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              )}
              <p
                className={`text-[10px] text-gray-400 mt-1 ${msg.fromMe ? "text-right" : "text-left"}`}
              >
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map((emoji, i) => (
              <button
                key={i}
                onClick={() => setInputText((prev) => prev + emoji)}
                className="text-2xl hover:scale-125 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* GIF Picker */}
      {showGifPicker && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
          <div className="flex gap-2 overflow-x-auto">
            {GIFS.map((gif, i) => (
              <button
                key={i}
                onClick={() => handleSend("", "gif", gif)}
                className="flex-shrink-0"
              >
                <img
                  src={gif}
                  alt="GIF"
                  className="h-20 rounded-lg hover:scale-105 transition-transform"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Media Picker */}
      {showMediaPicker && (
        <div className="px-4 py-4 border-t border-gray-100 bg-gray-50">
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-200 hover:border-primary transition-colors min-w-[100px]"
            >
              <Camera size={28} className="text-primary" />
              <span className="text-xs font-bold text-text-main">Camera</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-200 hover:border-primary transition-colors min-w-[100px]"
            >
              <Upload size={28} className="text-primary" />
              <span className="text-xs font-bold text-text-main">Gallery</span>
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}

      {/* Input Area */}
      <div className="px-4 py-3 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setShowEmojiPicker(!showEmojiPicker);
                setShowGifPicker(false);
              }}
              className={`p-2 rounded-full transition-colors ${showEmojiPicker ? "bg-gray-200" : "hover:bg-gray-100"}`}
            >
              <Smile size={20} className="text-gray-500" />
            </button>
            <button
              onClick={() => {
                setShowGifPicker(!showGifPicker);
                setShowEmojiPicker(false);
                setShowMediaPicker(false);
              }}
              className={`p-2 rounded-full transition-colors ${showGifPicker ? "bg-gray-200" : "hover:bg-gray-100"}`}
            >
              <ImageIcon size={20} className="text-gray-500" />
            </button>
            <button
              onClick={() => {
                setShowMediaPicker(!showMediaPicker);
                setShowEmojiPicker(false);
                setShowGifPicker(false);
              }}
              className={`p-2 rounded-full transition-colors ${showMediaPicker ? "bg-gray-200" : "hover:bg-gray-100"}`}
            >
              <Camera size={20} className="text-gray-500" />
            </button>
            <button
              onClick={() => setShowGames(true)}
              className="p-2 rounded-full transition-colors hover:bg-gray-100"
            >
              <Gamepad2 size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Message..."
              className="bg-transparent w-full outline-none text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
          </div>

          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className="p-2.5 bg-gray-900 text-white rounded-full disabled:opacity-40"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold mb-4">Report {match.name}</h3>
            <div className="space-y-2">
              {[
                "Inappropriate messages",
                "Fake profile",
                "Harassment",
                "Other",
              ].map((reason) => (
                <button
                  key={reason}
                  onClick={() => handleReport(reason)}
                  className="w-full p-3 text-left text-sm font-medium bg-gray-50 hover:bg-gray-100 rounded-xl"
                >
                  {reason}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowReportModal(false)}
              className="w-full mt-4 p-3 text-sm font-medium text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Chat Games Modal */}
      {showGames && (
        <ChatGames
          matchName={match.name}
          onSendGame={(gameData) => {
            // Add to active games (not chat history)
            setActiveGames((prev) => [...prev, gameData]);
            // Open the game modal immediately
            setViewingGame(gameData);
          }}
          onClose={() => setShowGames(false)}
        />
      )}

      {/* Game Play Modal */}
      {viewingGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gamepad2 size={20} />
                  <span className="font-bold">
                    {viewingGame.gameType === 'would-you-rather' ? 'Would You Rather' : 
                     viewingGame.gameType === 'this-or-that' ? 'This or That' :
                     viewingGame.gameType === 'two-truths' ? '2 Truths 1 Lie' :
                     viewingGame.gameType === 'hot-takes' ? 'Hot Take' : 
                     viewingGame.gameType === 'question-game' ? '36 Questions' :
                     viewingGame.gameType === 'emoji-story' ? 'Emoji Story' :
                     viewingGame.gameType === 'compatibility' ? 'Compatibility' : 'Game'}
                  </span>
                </div>
                <button 
                  onClick={() => setViewingGame(null)}
                  className="p-1 hover:bg-white/20 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              {/* Question */}
              {viewingGame.question && (
                <div className="mb-6">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2">Question</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {viewingGame.question}
                  </p>
                </div>
              )}
              
              {/* Options - Only show for games with clear options */}
              {viewingGame.options && viewingGame.options.length > 0 && viewingGame.options.length <= 5 && (
                <div className="space-y-3 mb-6">
                  {viewingGame.options.map((option, idx) => {
                    const isMyAnswer = viewingGame.myAnswer === option;
                    const isTheirAnswer = viewingGame.theirAnswer === option;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (!viewingGame.theirAnswer) {
                            // Update the game with their answer
                            setActiveGames(prev => prev.map(g => 
                              g === viewingGame ? { ...g, theirAnswer: option } : g
                            ));
                            setViewingGame({ ...viewingGame, theirAnswer: option });
                          }
                        }}
                        className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
                          isMyAnswer 
                            ? 'bg-purple-100 border-2 border-purple-500 text-purple-900' 
                            : isTheirAnswer
                            ? 'bg-pink-100 border-2 border-pink-500 text-pink-900'
                            : 'bg-gray-100 border-2 border-transparent hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {isMyAnswer && <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full">You</span>}
                          {isTheirAnswer && <span className="text-xs bg-pink-500 text-white px-2 py-1 rounded-full">{match.name}</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
              
              {/* Results */}
              {viewingGame.myAnswer && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">You picked:</span> {viewingGame.myAnswer}
                  </p>
                  {viewingGame.theirAnswer ? (
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">{match.name} picked:</span> {viewingGame.theirAnswer}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 italic">
                      Waiting for {match.name}'s answer...
                    </p>
                  )}
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="px-6 pb-6">
              <button
                onClick={() => setViewingGame(null)}
                className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unmatch Confirmation */}
      {showUnmatchConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-3xl w-full max-w-xs p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserMinus size={24} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold mb-2">Unmatch {match.name}?</h3>
            <p className="text-sm text-gray-500 mb-6">
              You won't be able to message them anymore.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUnmatchConfirm(false)}
                className="flex-1 py-3 font-medium text-sm bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleUnmatch}
                className="flex-1 py-3 font-medium text-sm text-white bg-red-500 rounded-xl"
              >
                Unmatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

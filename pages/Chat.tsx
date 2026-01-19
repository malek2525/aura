import React, { useEffect, useState } from "react";
import { Icons } from "../components/Icons";
import { Match } from "../types";
import { fetchMatches, MOCK_PROFILES } from "../services/matchService";

interface ChatProps {
  onChatSelect: (matchId: string) => void;
}

// Demo matches for testing chat games
const DEMO_MATCHES: Match[] = [
  {
    matchId: "match_julia",
    oderId: "profile_1",
    name: "Julia",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    preview: "hey! loved ur profile ✨",
    time: "2m",
    unread: true,
    isAuraMatch: true,
    transcript: [
      {
        id: "1",
        from: "auraB",
        text: "omg u both love coffee thats cute",
        senderName: "Julia",
        timestamp: Date.now() - 10000,
      },
      {
        id: "2",
        from: "auraA",
        text: "tell them i make a mean latte",
        senderName: "You",
        timestamp: Date.now() - 8000,
      },
      {
        id: "3",
        from: "auraB",
        text: "okay theyre intrigued 👀",
        senderName: "Julia",
        timestamp: Date.now() - 5000,
      },
    ],
    profile: MOCK_PROFILES[0],
  },
  {
    matchId: "match_emma",
    oderId: "profile_3",
    name: "Emma",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    preview: "that hiking spot looks amazing!",
    time: "1h",
    unread: false,
    isAuraMatch: false,
    profile: MOCK_PROFILES[2],
  },
  {
    matchId: "match_sophie",
    oderId: "profile_5",
    name: "Sophie",
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
    preview: "wanna play 20 questions? 😊",
    time: "3h",
    unread: true,
    isAuraMatch: false,
    profile: MOCK_PROFILES[4],
  },
  {
    matchId: "match_nina",
    oderId: "profile_9",
    name: "Nina",
    photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400",
    preview: "my cats approve btw 🐱",
    time: "1d",
    unread: false,
    isAuraMatch: false,
    profile: MOCK_PROFILES[8],
  },
];

export const Chat: React.FC<ChatProps> = ({ onChatSelect }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchMatches("me");
        // Merge with demo matches
        const merged = [
          ...DEMO_MATCHES,
          ...data.filter(
            (d) => !DEMO_MATCHES.find((dm) => dm.matchId === d.matchId),
          ),
        ];
        setMatches(merged);
      } catch (e) {
        // Use demo matches if fetch fails
        setMatches(DEMO_MATCHES);
      }
      setLoading(false);
    };
    load();
  }, []);

  const filteredMatches = searchQuery
    ? matches.filter((m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : matches;

  const auraMatches = filteredMatches.filter((m) => m.isAuraMatch);
  const regularMatches = filteredMatches.filter((m) => !m.isAuraMatch);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Icons.Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2.5 rounded-xl transition-all ${
              showSearch
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <Icons.Search size={20} />
          </button>
        </div>

        {/* Search */}
        {showSearch && (
          <div className="mt-4 relative">
            <Icons.Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Aura Matches - Subtle purple instead of orange */}
      {auraMatches.length > 0 && (
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <Icons.Sparkles size={14} className="text-purple-500" />
            <span className="text-xs font-semibold text-purple-500 uppercase tracking-wide">
              Aura Matches
            </span>
          </div>

          <div className="space-y-2">
            {auraMatches.map((m) => (
              <div
                key={m.matchId}
                onClick={() => onChatSelect(m.profile?.id || m.oderId)}
                className="flex items-center gap-3 p-3 bg-purple-50 rounded-2xl cursor-pointer hover:bg-purple-100 transition-colors"
              >
                <div className="relative">
                  <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-purple-200">
                    <img
                      src={m.photo}
                      alt={m.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                    <Icons.Sparkles size={10} className="text-white" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">{m.name}</h3>
                    <span className="text-[10px] text-purple-500 font-medium">
                      Aura Match
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate mt-0.5">
                    {m.transcript?.length
                      ? `"${m.transcript[m.transcript.length - 1].text}"`
                      : "Your Auras connected! ✨"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Conversations */}
      <div className="px-5 py-2">
        {auraMatches.length > 0 && (
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Messages
          </h2>
        )}

        <div className="space-y-1">
          {regularMatches.map((m) => (
            <div
              key={m.matchId}
              onClick={() => onChatSelect(m.profile?.id || m.oderId)}
              className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100">
                  <img
                    src={m.photo}
                    alt={m.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {m.unread && (
                  <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-500 rounded-full border-2 border-white" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3
                    className={`font-semibold ${m.unread ? "text-gray-900" : "text-gray-700"}`}
                  >
                    {m.name}
                  </h3>
                  <span className="text-[11px] text-gray-400">{m.time}</span>
                </div>
                <p
                  className={`text-sm truncate mt-0.5 ${m.unread ? "text-gray-900 font-medium" : "text-gray-500"}`}
                >
                  {m.preview}
                </p>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {filteredMatches.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icons.MessageCircle size={28} className="text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                No messages yet
              </h3>
              <p className="text-sm text-gray-500">
                Start swiping to find matches!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

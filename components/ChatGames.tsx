// src/components/ChatGames.tsx
// Fun mini-games to break the ice and make chatting more interesting

import React, { useState } from 'react';
import { Icons } from './Icons';

interface ChatGamesProps {
  onSendMessage: (text: string) => void;
  onClose: () => void;
  matchName: string;
}

type GameType = 'menu' | 'would-you-rather' | 'this-or-that' | 'two-truths' | 'question-game' | 'emoji-story' | 'hot-takes' | 'compatibility';

export const ChatGames: React.FC<ChatGamesProps> = ({ onSendMessage, onClose, matchName }) => {
  const [activeGame, setActiveGame] = useState<GameType>('menu');
  const [gameState, setGameState] = useState<any>({});

  const games = [
    { id: 'would-you-rather', icon: '🤔', name: 'Would You Rather', desc: 'impossible choices' },
    { id: 'this-or-that', icon: '⚡', name: 'This or That', desc: 'quick fire picks' },
    { id: 'two-truths', icon: '🎭', name: '2 Truths 1 Lie', desc: 'guess the lie' },
    { id: 'question-game', icon: '💭', name: '36 Questions', desc: 'get deep fast' },
    { id: 'emoji-story', icon: '📖', name: 'Emoji Story', desc: 'tell a story in emojis' },
    { id: 'hot-takes', icon: '🔥', name: 'Hot Takes', desc: 'spicy opinions' },
    { id: 'compatibility', icon: '💕', name: 'Compatibility Quiz', desc: 'how aligned are u?' },
  ];

  const handleStartGame = (gameId: GameType) => {
    setActiveGame(gameId);
    setGameState({});
  };

  const handleSendAndClose = (message: string) => {
    onSendMessage(message);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center">
      <div className="bg-white w-full max-w-md rounded-t-3xl max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-warm-gray px-5 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            {activeGame !== 'menu' && (
              <button 
                onClick={() => setActiveGame('menu')}
                className="p-1 hover:bg-warm-white rounded-full"
              >
                <Icons.ChevronLeft size={20} />
              </button>
            )}
            <div>
              <h3 className="font-bold text-text-main">
                {activeGame === 'menu' ? 'chat games 🎮' : games.find(g => g.id === activeGame)?.name}
              </h3>
              <p className="text-xs text-text-sec">
                {activeGame === 'menu' ? 'pick a game to play together' : `playing with ${matchName}`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-warm-white rounded-full">
            <Icons.X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[70vh]">
          
          {/* Game Menu */}
          {activeGame === 'menu' && (
            <div className="grid grid-cols-2 gap-3">
              {games.map(game => (
                <button
                  key={game.id}
                  onClick={() => handleStartGame(game.id as GameType)}
                  className="bg-warm-white p-4 rounded-2xl text-left hover:bg-coral-light/10 hover:border-coral/20 border border-transparent transition-all group"
                >
                  <span className="text-2xl mb-2 block">{game.icon}</span>
                  <span className="font-bold text-sm text-text-main block">{game.name}</span>
                  <span className="text-[10px] text-text-sec">{game.desc}</span>
                </button>
              ))}
            </div>
          )}

          {/* Would You Rather */}
          {activeGame === 'would-you-rather' && (
            <WouldYouRatherGame 
              onSend={handleSendAndClose}
              matchName={matchName}
            />
          )}

          {/* This or That */}
          {activeGame === 'this-or-that' && (
            <ThisOrThatGame 
              onSend={handleSendAndClose}
              matchName={matchName}
            />
          )}

          {/* Two Truths One Lie */}
          {activeGame === 'two-truths' && (
            <TwoTruthsGame 
              onSend={handleSendAndClose}
              matchName={matchName}
            />
          )}

          {/* 36 Questions */}
          {activeGame === 'question-game' && (
            <QuestionGame 
              onSend={handleSendAndClose}
              matchName={matchName}
            />
          )}

          {/* Emoji Story */}
          {activeGame === 'emoji-story' && (
            <EmojiStoryGame 
              onSend={handleSendAndClose}
              matchName={matchName}
            />
          )}

          {/* Hot Takes */}
          {activeGame === 'hot-takes' && (
            <HotTakesGame 
              onSend={handleSendAndClose}
              matchName={matchName}
            />
          )}

          {/* Compatibility Quiz */}
          {activeGame === 'compatibility' && (
            <CompatibilityGame 
              onSend={handleSendAndClose}
              matchName={matchName}
            />
          )}

        </div>
      </div>
    </div>
  );
};

// ============================================
// WOULD YOU RATHER
// ============================================

const WOULD_YOU_RATHER_QUESTIONS = [
  { a: "have the ability to fly", b: "be invisible" },
  { a: "know all languages", b: "talk to animals" },
  { a: "always be 10 min late", b: "always be 20 min early" },
  { a: "live in a treehouse", b: "live on a boat" },
  { a: "have free food forever", b: "free travel forever" },
  { a: "be able to read minds", b: "see the future" },
  { a: "never use social media again", b: "never watch movies again" },
  { a: "have a rewind button for life", b: "have a pause button" },
  { a: "always be slightly cold", b: "always be slightly hot" },
  { a: "meet your future self", b: "meet your past self" },
  { a: "have unlimited money", b: "unlimited time" },
  { a: "live 100 years in the past", b: "100 years in the future" },
  { a: "only eat sweet food", b: "only eat savory food" },
  { a: "have perfect memory", b: "perfect creativity" },
  { a: "be famous but broke", b: "rich but unknown" },
];

const WouldYouRatherGame: React.FC<{ onSend: (msg: string) => void; matchName: string }> = ({ onSend, matchName }) => {
  const [currentQ, setCurrentQ] = useState(() => 
    WOULD_YOU_RATHER_QUESTIONS[Math.floor(Math.random() * WOULD_YOU_RATHER_QUESTIONS.length)]
  );
  const [selected, setSelected] = useState<'a' | 'b' | null>(null);

  const handleSelect = (choice: 'a' | 'b') => {
    setSelected(choice);
  };

  const handleSend = () => {
    const choiceText = selected === 'a' ? currentQ.a : currentQ.b;
    onSend(`🎮 Would You Rather?\n\nA: ${currentQ.a}\nB: ${currentQ.b}\n\nI picked: ${choiceText.toUpperCase()} 👀\n\nwhat about u?`);
  };

  const handleNewQuestion = () => {
    setCurrentQ(WOULD_YOU_RATHER_QUESTIONS[Math.floor(Math.random() * WOULD_YOU_RATHER_QUESTIONS.length)]);
    setSelected(null);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-sec text-center mb-6">pick one and send to {matchName}!</p>
      
      <button
        onClick={() => handleSelect('a')}
        className={`w-full p-5 rounded-2xl text-left transition-all ${
          selected === 'a' 
            ? 'bg-coral text-white ring-2 ring-coral ring-offset-2' 
            : 'bg-warm-white hover:bg-coral-light/20'
        }`}
      >
        <span className="text-xs font-bold uppercase tracking-wider opacity-70">Option A</span>
        <p className="font-bold mt-1">{currentQ.a}</p>
      </button>

      <div className="text-center text-text-muted font-bold text-sm">or</div>

      <button
        onClick={() => handleSelect('b')}
        className={`w-full p-5 rounded-2xl text-left transition-all ${
          selected === 'b' 
            ? 'bg-coral text-white ring-2 ring-coral ring-offset-2' 
            : 'bg-warm-white hover:bg-coral-light/20'
        }`}
      >
        <span className="text-xs font-bold uppercase tracking-wider opacity-70">Option B</span>
        <p className="font-bold mt-1">{currentQ.b}</p>
      </button>

      <div className="flex gap-3 pt-4">
        <button 
          onClick={handleNewQuestion}
          className="flex-1 py-3 border border-warm-gray rounded-xl text-sm font-bold text-text-sec hover:bg-warm-white"
        >
          new question
        </button>
        <button 
          onClick={handleSend}
          disabled={!selected}
          className="flex-1 py-3 bg-coral text-white rounded-xl text-sm font-bold disabled:opacity-50"
        >
          send it! 🎮
        </button>
      </div>
    </div>
  );
};

// ============================================
// THIS OR THAT (Quick Fire)
// ============================================

const THIS_OR_THAT_PAIRS = [
  ["☕ Coffee", "🍵 Tea"],
  ["🌅 Sunrise", "🌆 Sunset"],
  ["📖 Book", "🎬 Movie"],
  ["🏔️ Mountains", "🏖️ Beach"],
  ["🎉 Party", "🏠 Stay home"],
  ["🍕 Pizza", "🍔 Burger"],
  ["🐱 Cat", "🐕 Dog"],
  ["📱 Text", "📞 Call"],
  ["🌧️ Rain", "☀️ Sun"],
  ["🎧 Music", "🎙️ Podcast"],
  ["🍫 Chocolate", "🍬 Candy"],
  ["✈️ Fly", "🚗 Road trip"],
  ["🌃 Night owl", "🌅 Early bird"],
  ["🎮 Gaming", "🎬 Streaming"],
  ["🍜 Noodles", "🍚 Rice"],
  ["🎸 Rock", "🎹 Pop"],
  ["🏃 Run", "🚶 Walk"],
  ["🥤 Sweet", "🧂 Salty"],
];

const ThisOrThatGame: React.FC<{ onSend: (msg: string) => void; matchName: string }> = ({ onSend, matchName }) => {
  const [pairs, setPairs] = useState(() => 
    [...THIS_OR_THAT_PAIRS].sort(() => Math.random() - 0.5).slice(0, 5)
  );
  const [answers, setAnswers] = useState<number[]>([]);

  const handleSelect = (pairIndex: number, choice: 0 | 1) => {
    const newAnswers = [...answers];
    newAnswers[pairIndex] = choice;
    setAnswers(newAnswers);
  };

  const handleSend = () => {
    const results = pairs.map((pair, i) => `${pair[answers[i] || 0]}`).join(' | ');
    onSend(`⚡ This or That!\n\n${results}\n\nwhat would u pick? 👀`);
  };

  const allAnswered = answers.filter(a => a !== undefined).length === pairs.length;

  return (
    <div className="space-y-3">
      <p className="text-sm text-text-sec text-center mb-4">quick picks! tap ur choice</p>
      
      {pairs.map((pair, i) => (
        <div key={i} className="flex gap-2">
          <button
            onClick={() => handleSelect(i, 0)}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
              answers[i] === 0 
                ? 'bg-coral text-white' 
                : 'bg-warm-white hover:bg-coral-light/20'
            }`}
          >
            {pair[0]}
          </button>
          <button
            onClick={() => handleSelect(i, 1)}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
              answers[i] === 1 
                ? 'bg-coral text-white' 
                : 'bg-warm-white hover:bg-coral-light/20'
            }`}
          >
            {pair[1]}
          </button>
        </div>
      ))}

      <button 
        onClick={handleSend}
        disabled={!allAnswered}
        className="w-full py-4 bg-coral text-white rounded-xl font-bold mt-4 disabled:opacity-50"
      >
        {allAnswered ? 'send my picks! ⚡' : `pick all ${pairs.length} first`}
      </button>
    </div>
  );
};

// ============================================
// TWO TRUTHS ONE LIE
// ============================================

const TWO_TRUTHS_PROMPTS = [
  "something adventurous you've done",
  "a weird talent you have",
  "somewhere you've traveled",
  "a food you hate that most people love",
  "a celebrity encounter",
  "something embarrassing that happened",
  "a childhood dream job",
  "a hidden skill",
];

const TwoTruthsGame: React.FC<{ onSend: (msg: string) => void; matchName: string }> = ({ onSend, matchName }) => {
  const [statements, setStatements] = useState(['', '', '']);
  const [lieIndex, setLieIndex] = useState<number | null>(null);

  const handleStatementChange = (index: number, value: string) => {
    const newStatements = [...statements];
    newStatements[index] = value;
    setStatements(newStatements);
  };

  const handleSend = () => {
    const shuffled = [...statements].sort(() => Math.random() - 0.5);
    onSend(`🎭 2 Truths & 1 Lie!\n\nCan you guess which one is the lie?\n\n1. ${shuffled[0]}\n2. ${shuffled[1]}\n3. ${shuffled[2]}\n\n👀 take ur best guess!`);
  };

  const canSend = statements.every(s => s.trim().length > 0) && lieIndex !== null;
  const randomPrompt = TWO_TRUTHS_PROMPTS[Math.floor(Math.random() * TWO_TRUTHS_PROMPTS.length)];

  return (
    <div className="space-y-4">
      <div className="bg-coral-light/20 p-3 rounded-xl">
        <p className="text-xs text-coral font-bold">💡 Need ideas?</p>
        <p className="text-sm text-text-main">Try: {randomPrompt}</p>
      </div>

      {[0, 1, 2].map(i => (
        <div key={i} className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-text-muted uppercase">
              {lieIndex === i ? '🤥 The Lie' : `✅ Truth ${lieIndex === null ? '' : (i < lieIndex! ? i + 1 : i)}`}
            </label>
            <button
              onClick={() => setLieIndex(lieIndex === i ? null : i)}
              className={`text-xs px-2 py-1 rounded-full ${
                lieIndex === i 
                  ? 'bg-coral text-white' 
                  : 'bg-warm-white text-text-sec hover:bg-coral-light/20'
              }`}
            >
              {lieIndex === i ? 'this is the lie' : 'mark as lie'}
            </button>
          </div>
          <input
            value={statements[i]}
            onChange={(e) => handleStatementChange(i, e.target.value)}
            placeholder={i === 0 ? "I once..." : i === 1 ? "I've never..." : "I can..."}
            className="w-full bg-warm-white border border-warm-gray rounded-xl px-4 py-3 text-sm focus:border-coral outline-none"
          />
        </div>
      ))}

      <button 
        onClick={handleSend}
        disabled={!canSend}
        className="w-full py-4 bg-coral text-white rounded-xl font-bold disabled:opacity-50"
      >
        {canSend ? 'send & challenge them! 🎭' : 'fill all 3 & mark the lie'}
      </button>
    </div>
  );
};

// ============================================
// 36 QUESTIONS (Deep Conversation)
// ============================================

const DEEP_QUESTIONS = [
  // Level 1 - Light
  "What would be a perfect day for you?",
  "If you could wake up tomorrow with one new ability, what would it be?",
  "What's your most treasured memory?",
  "What do you value most in friendship?",
  "If you could change one thing about how you were raised, what would it be?",
  "What's something you've always wanted to try but haven't yet?",
  // Level 2 - Medium
  "What's your biggest fear and why?",
  "Is there something you've dreamed of doing for a long time? Why haven't you done it?",
  "What does friendship mean to you?",
  "What's your most embarrassing moment?",
  "When did you last cry in front of someone?",
  "What, if anything, is too serious to joke about?",
  // Level 3 - Deep
  "If you died tonight with no chance to talk to anyone, what would you most regret not saying?",
  "Your house catches fire. After saving people and pets, you can grab one item. What?",
  "Of everyone in your family, whose death would disturb you most? Why?",
  "Share a personal problem and ask for advice on how your partner might handle it.",
  "What do you like most about me so far?",
  "What's one thing you wish more people understood about you?",
];

const QuestionGame: React.FC<{ onSend: (msg: string) => void; matchName: string }> = ({ onSend, matchName }) => {
  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const [currentQ, setCurrentQ] = useState(() => DEEP_QUESTIONS[Math.floor(Math.random() * 6)]);

  const getQuestionsForLevel = (lvl: number) => {
    const start = (lvl - 1) * 6;
    return DEEP_QUESTIONS.slice(start, start + 6);
  };

  const handleNewQuestion = () => {
    const questions = getQuestionsForLevel(level);
    setCurrentQ(questions[Math.floor(Math.random() * questions.length)]);
  };

  const handleSend = () => {
    onSend(`💭 Deep Question Time!\n\n"${currentQ}"\n\nill answer first if u want 👀`);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-sec text-center">based on the famous 36 questions study</p>
      
      {/* Level Selector */}
      <div className="flex gap-2">
        {[1, 2, 3].map(l => (
          <button
            key={l}
            onClick={() => { setLevel(l as 1|2|3); handleNewQuestion(); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              level === l 
                ? 'bg-coral text-white' 
                : 'bg-warm-white text-text-sec hover:bg-coral-light/20'
            }`}
          >
            {l === 1 ? '🌱 Light' : l === 2 ? '🌿 Medium' : '🌳 Deep'}
          </button>
        ))}
      </div>

      {/* Question Display */}
      <div className="bg-gradient-to-br from-coral-light/20 to-gold/10 p-6 rounded-2xl text-center">
        <p className="text-lg font-bold text-text-main leading-relaxed">"{currentQ}"</p>
      </div>

      <div className="flex gap-3">
        <button 
          onClick={handleNewQuestion}
          className="flex-1 py-3 border border-warm-gray rounded-xl text-sm font-bold text-text-sec hover:bg-warm-white"
        >
          different question
        </button>
        <button 
          onClick={handleSend}
          className="flex-1 py-3 bg-coral text-white rounded-xl text-sm font-bold"
        >
          send this one 💭
        </button>
      </div>
    </div>
  );
};

// ============================================
// EMOJI STORY
// ============================================

const EMOJI_PROMPTS = [
  "describe your day so far",
  "your dream vacation",
  "a movie plot",
  "your morning routine",
  "your ideal first date",
  "how you're feeling right now",
  "your favorite memory",
  "your weekend plans",
];

const EmojiStoryGame: React.FC<{ onSend: (msg: string) => void; matchName: string }> = ({ onSend, matchName }) => {
  const [story, setStory] = useState('');
  const [prompt, setPrompt] = useState(() => 
    EMOJI_PROMPTS[Math.floor(Math.random() * EMOJI_PROMPTS.length)]
  );

  const commonEmojis = ['😀', '😂', '🥰', '😎', '🤔', '😴', '🎉', '❤️', '🔥', '✨', '👀', '🙌', '💀', '🥺', '😭', '🤣', '💕', '🌟', '🎮', '🍕', '☕', '🌙', '🌈', '🏠', '✈️', '🎵', '📱', '💪', '🙏', '👋'];

  const handleSend = () => {
    onSend(`📖 Emoji Story Challenge!\n\nPrompt: "${prompt}"\n\nMy story: ${story}\n\ncan u guess what it means? 🤔 now u try!`);
  };

  return (
    <div className="space-y-4">
      <div className="bg-warm-white p-4 rounded-xl text-center">
        <p className="text-xs text-text-muted uppercase font-bold mb-1">Your prompt</p>
        <p className="font-bold text-text-main">{prompt}</p>
        <button 
          onClick={() => setPrompt(EMOJI_PROMPTS[Math.floor(Math.random() * EMOJI_PROMPTS.length)])}
          className="text-xs text-coral mt-2"
        >
          different prompt
        </button>
      </div>

      <div className="bg-warm-white rounded-xl p-4 min-h-[80px] text-center text-2xl">
        {story || <span className="text-text-muted text-sm">tap emojis below to build your story</span>}
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {commonEmojis.map(emoji => (
          <button
            key={emoji}
            onClick={() => setStory(prev => prev + emoji)}
            className="w-10 h-10 bg-white rounded-lg text-xl hover:bg-coral-light/20 transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button 
          onClick={() => setStory('')}
          className="py-3 px-6 border border-warm-gray rounded-xl text-sm font-bold text-text-sec"
        >
          clear
        </button>
        <button 
          onClick={handleSend}
          disabled={story.length < 3}
          className="flex-1 py-3 bg-coral text-white rounded-xl text-sm font-bold disabled:opacity-50"
        >
          send story! 📖
        </button>
      </div>
    </div>
  );
};

// ============================================
// HOT TAKES
// ============================================

const HOT_TAKES = [
  "pineapple on pizza is actually good",
  "breakfast food is the best dinner",
  "texting > calling always",
  "rom coms are underrated",
  "astrology is real (ish)",
  "the book is always better",
  "cold weather > hot weather",
  "naps are overrated",
  "social media is net positive",
  "cereal is soup",
  "hotdogs are sandwiches",
  "water has a taste",
  "friends is better than the office",
  "morning people are just lying",
  "raisins ruin cookies",
];

const HotTakesGame: React.FC<{ onSend: (msg: string) => void; matchName: string }> = ({ onSend, matchName }) => {
  const [currentTake, setCurrentTake] = useState(() => 
    HOT_TAKES[Math.floor(Math.random() * HOT_TAKES.length)]
  );
  const [opinion, setOpinion] = useState<'agree' | 'disagree' | null>(null);

  const handleSend = () => {
    const reaction = opinion === 'agree' ? '✅ AGREE' : '❌ DISAGREE';
    onSend(`🔥 Hot Take!\n\n"${currentTake}"\n\nMy verdict: ${reaction}\n\nwhat do u think? 👀`);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-sec text-center">share ur spicy opinions 🌶️</p>
      
      <div className="bg-gradient-to-br from-orange-100 to-red-50 p-6 rounded-2xl text-center border border-orange-200">
        <span className="text-3xl mb-3 block">🔥</span>
        <p className="text-lg font-bold text-text-main">"{currentTake}"</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setOpinion('agree')}
          className={`flex-1 py-4 rounded-xl font-bold transition-all ${
            opinion === 'agree' 
              ? 'bg-green-500 text-white ring-2 ring-green-500 ring-offset-2' 
              : 'bg-green-50 text-green-600 hover:bg-green-100'
          }`}
        >
          ✅ Agree
        </button>
        <button
          onClick={() => setOpinion('disagree')}
          className={`flex-1 py-4 rounded-xl font-bold transition-all ${
            opinion === 'disagree' 
              ? 'bg-red-500 text-white ring-2 ring-red-500 ring-offset-2' 
              : 'bg-red-50 text-red-600 hover:bg-red-100'
          }`}
        >
          ❌ Disagree
        </button>
      </div>

      <div className="flex gap-3">
        <button 
          onClick={() => { setCurrentTake(HOT_TAKES[Math.floor(Math.random() * HOT_TAKES.length)]); setOpinion(null); }}
          className="flex-1 py-3 border border-warm-gray rounded-xl text-sm font-bold text-text-sec"
        >
          next take
        </button>
        <button 
          onClick={handleSend}
          disabled={!opinion}
          className="flex-1 py-3 bg-coral text-white rounded-xl text-sm font-bold disabled:opacity-50"
        >
          send it! 🔥
        </button>
      </div>
    </div>
  );
};

// ============================================
// COMPATIBILITY QUIZ
// ============================================

const COMPATIBILITY_QUESTIONS = [
  { q: "Ideal weekend?", options: ["Going out", "Staying in", "Mix of both"] },
  { q: "Love language?", options: ["Words", "Touch", "Gifts", "Quality time", "Acts of service"] },
  { q: "Morning or night?", options: ["Morning person", "Night owl", "Neither lol"] },
  { q: "Planning style?", options: ["Plan everything", "Spontaneous", "Depends"] },
  { q: "Social battery?", options: ["Always charged", "Needs recharging", "Low capacity"] },
];

const CompatibilityGame: React.FC<{ onSend: (msg: string) => void; matchName: string }> = ({ onSend, matchName }) => {
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentQ, setCurrentQ] = useState(0);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    
    if (currentQ < COMPATIBILITY_QUESTIONS.length - 1) {
      setCurrentQ(prev => prev + 1);
    }
  };

  const handleSend = () => {
    const results = COMPATIBILITY_QUESTIONS.map((q, i) => `${q.q} ${answers[i]}`).join('\n');
    onSend(`💕 Compatibility Quiz!\n\nMy answers:\n${results}\n\ntake the quiz and lets compare! 👀`);
  };

  const isComplete = answers.length === COMPATIBILITY_QUESTIONS.length;
  const question = COMPATIBILITY_QUESTIONS[currentQ];

  return (
    <div className="space-y-4">
      {!isComplete ? (
        <>
          <div className="flex justify-between items-center">
            <p className="text-sm text-text-sec">Question {currentQ + 1}/{COMPATIBILITY_QUESTIONS.length}</p>
            <div className="flex gap-1">
              {COMPATIBILITY_QUESTIONS.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i < answers.length ? 'bg-coral' : 'bg-warm-gray'}`} />
              ))}
            </div>
          </div>

          <div className="bg-coral-light/20 p-5 rounded-2xl text-center">
            <p className="text-lg font-bold text-text-main">{question.q}</p>
          </div>

          <div className="space-y-2">
            {question.options.map(option => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className="w-full py-3 bg-warm-white rounded-xl text-sm font-bold text-text-main hover:bg-coral-light/20 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="bg-gradient-to-br from-coral-light/30 to-gold/20 p-6 rounded-2xl text-center">
            <span className="text-4xl mb-3 block">💕</span>
            <p className="font-bold text-text-main mb-2">Quiz complete!</p>
            <p className="text-sm text-text-sec">Send your results and see if you match!</p>
          </div>

          <div className="space-y-2 bg-warm-white p-4 rounded-xl">
            {COMPATIBILITY_QUESTIONS.map((q, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-text-sec">{q.q}</span>
                <span className="font-bold text-coral">{answers[i]}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => { setAnswers([]); setCurrentQ(0); }}
              className="flex-1 py-3 border border-warm-gray rounded-xl text-sm font-bold text-text-sec"
            >
              retake
            </button>
            <button 
              onClick={handleSend}
              className="flex-1 py-3 bg-coral text-white rounded-xl text-sm font-bold"
            >
              send results! 💕
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatGames;

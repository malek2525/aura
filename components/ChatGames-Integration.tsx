// HOW TO ADD CHAT GAMES TO YOUR ChatDetail.tsx
// =============================================

// 1. Import the ChatGames component at the top:
import { ChatGames } from '../components/ChatGames';

// 2. Add state for showing games panel:
const [showGames, setShowGames] = useState(false);

// 3. Add a games button in your input area (next to send button):
// Look for your message input section and add this button:

<button
  onClick={() => setShowGames(true)}
  className="p-3 bg-warm-white rounded-full text-coral hover:bg-coral-light/20 transition-colors"
>
  <Icons.Gamepad2 size={20} />
</button>

// 4. Add the ChatGames modal at the bottom of your component (before final closing div):

{showGames && (
  <ChatGames
    onSendMessage={(text) => {
      handleSend(text);  // Your existing send function
      setShowGames(false);
    }}
    onClose={() => setShowGames(false)}
    matchName={matchProfile?.name || 'Match'}
  />
)}


// =============================================
// FULL EXAMPLE - Updated Input Section
// =============================================

// Replace your existing input section with this:

{/* Input Area */}
<div className="bg-white border-t border-warm-gray p-4 safe-area-bottom">
  <div className="flex items-end gap-2">
    
    {/* Games Button */}
    <button
      onClick={() => setShowGames(true)}
      className="p-3 bg-warm-white rounded-full text-coral hover:bg-coral-light/20 transition-colors flex-shrink-0"
      title="Play a game"
    >
      <Icons.Gamepad2 size={20} />
    </button>
    
    {/* Image Button (optional) */}
    <button
      onClick={() => {/* handle image upload */}}
      className="p-3 bg-warm-white rounded-full text-text-muted hover:text-coral transition-colors flex-shrink-0"
    >
      <Icons.Image size={20} />
    </button>
    
    {/* Text Input */}
    <div className="flex-1 relative">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        placeholder="type a message..."
        className="w-full bg-warm-white rounded-full px-4 py-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-coral/20"
      />
    </div>
    
    {/* Send Button */}
    <button
      onClick={() => handleSend()}
      disabled={!newMessage.trim()}
      className="p-3 bg-coral text-white rounded-full disabled:opacity-50 transition-all hover:bg-coral-dark flex-shrink-0"
    >
      <Icons.Send size={20} />
    </button>
  </div>
  
  {/* Quick Actions Row (optional) */}
  <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar">
    <QuickAction emoji="🎮" label="Games" onClick={() => setShowGames(true)} />
    <QuickAction emoji="👋" label="Say hi" onClick={() => handleSend("hey! 👋")} />
    <QuickAction emoji="😊" label="How's your day?" onClick={() => handleSend("how's ur day going?")} />
  </div>
</div>

// Quick Action Component
const QuickAction = ({ emoji, label, onClick }: { emoji: string; label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 px-3 py-1.5 bg-warm-white rounded-full text-xs font-medium text-text-sec hover:bg-coral-light/20 whitespace-nowrap"
  >
    <span>{emoji}</span>
    {label}
  </button>
);


// =============================================
// ADD GAMEPAD ICON TO YOUR Icons.tsx
// =============================================

// If you don't have Gamepad2 in your Icons component, add it:

import { Gamepad2 } from 'lucide-react';

// Then in your Icons object:
export const Icons = {
  // ... other icons
  Gamepad2,
};

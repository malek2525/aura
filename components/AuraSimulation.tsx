
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from './Icons';
import { UserProfile, TwinChatMessage } from '../types';

interface AuraSimulationProps {
  myProfileName: string;
  theirProfile: UserProfile;
  onClose: () => void;
  onMatch: () => void;
}

export const AuraSimulation: React.FC<AuraSimulationProps> = ({ myProfileName, theirProfile, onClose, onMatch }) => {
  const [messages, setMessages] = useState<TwinChatMessage[]>([]);
  const [phase, setPhase] = useState<'connecting' | 'talking' | 'decision'>('connecting');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Simulation of the Digital Twin Conversation
  useEffect(() => {
    let timeoutIds: any[] = [];

    const addMessage = (text: string, from: 'auraA' | 'auraB', senderName: string) => {
        setMessages(prev => [...prev, { text, from, senderName }]);
    };

    // Determine writing styles for simulation realism
    // In a real app, this comes from the LLM based on user profile
    const myName = myProfileName;
    const theirName = theirProfile.name;
    const theirInterest = theirProfile.interests[0] || 'art';

    const script = [
        // Opening
        { t: 2000, fn: () => { setPhase('talking'); addMessage(`Hey! I'm ${theirName}'s AI. ${theirName} loves ${theirInterest}.`, 'auraB', theirName); } },
        { t: 4500, fn: () => { addMessage(`Hi! I'm ${myName}'s twin. ${myName} is super into that too actually.`, 'auraA', myName); } },
        
        // Deepening
        { t: 7500, fn: () => { addMessage(`Nice. What's ${myName} looking for on here? Honest answer.`, 'auraB', theirName); } },
        { t: 10500, fn: () => { addMessage(`Ideally something serious, but ${myName} takes things slow. You?`, 'auraA', myName); } },
        
        // Vibe Check
        { t: 14000, fn: () => { addMessage(`Same here. ${theirName} is tired of ghosting. Just wants good vibes and maybe some sushi.`, 'auraB', theirName); } },
        { t: 17000, fn: () => { addMessage(`Sushi is the way to ${myName}'s heart. I think they'd get along.`, 'auraA', myName); } },
        
        // Conclusion
        { t: 20000, fn: () => { setPhase('decision'); } }
    ];

    timeoutIds.push(setTimeout(() => setPhase('connecting'), 0));

    script.forEach(step => {
        timeoutIds.push(setTimeout(step.fn, step.t));
    });

    return () => timeoutIds.forEach(clearTimeout);
  }, [myProfileName, theirProfile]);

  return (
    <div className="fixed inset-0 z-[70] bg-warm-white flex flex-col font-sans animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-warm-gray bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${phase === 'decision' ? 'bg-green-500' : 'bg-coral animate-pulse'}`}></div>
            <span className="font-extrabold text-xs text-text-main uppercase tracking-wider">
                {phase === 'connecting' ? 'Establishing Link...' : 
                 phase === 'talking' ? 'Twins Conversing...' : 'Analysis Complete'}
            </span>
        </div>
        <button onClick={onClose} className="p-2 text-text-sec hover:bg-gray-100 rounded-full transition-colors">
          <Icons.X size={20} />
        </button>
      </div>

      {/* Visualizer Area (Connecting Phase) */}
      {phase === 'connecting' && (
        <div className="flex-1 flex flex-col items-center justify-center relative p-8">
             <div className="relative">
                 {/* My Aura Node */}
                 <div className="absolute -left-24 top-0 transition-all duration-1000 animate-float">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-coral to-coral-light p-1 shadow-glow">
                       <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                           <span className="text-2xl">⚡</span>
                       </div>
                    </div>
                    <p className="text-center text-xs font-bold mt-2 text-coral">{myProfileName}</p>
                 </div>

                 {/* Connection Waves */}
                 <div className="w-48 h-20 flex items-center justify-center">
                    <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    </div>
                 </div>

                 {/* Their Aura Node */}
                 <div className="absolute -right-24 top-0 transition-all duration-1000 animate-float [animation-delay:0.5s]">
                     <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-400 to-cyan-300 p-1 shadow-lg">
                       <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                           <img src={theirProfile.photos[0]} className="w-full h-full object-cover" />
                       </div>
                    </div>
                    <p className="text-center text-xs font-bold mt-2 text-blue-500">{theirProfile.name}</p>
                 </div>
             </div>
             <p className="mt-12 text-sm text-text-muted font-medium animate-pulse">Syncing personalities...</p>
        </div>
      )}

      {/* Chat Area (Talking Phase) */}
      {phase !== 'connecting' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-warm-white scroll-smooth" ref={scrollRef}>
             {/* Info Banner */}
             <div className="flex justify-center mb-6">
                <div className="bg-white border border-warm-gray px-4 py-2 rounded-full shadow-sm text-[10px] font-bold text-text-muted uppercase tracking-wider">
                    AI Digital Twin Simulation
                </div>
             </div>

             {messages.map((msg, i) => {
                 const isMe = msg.from === 'auraA';
                 return (
                     <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-500`}>
                         <div className={`max-w-[80%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                             <span className={`text-[10px] font-bold mb-1 ${isMe ? 'text-coral mr-2' : 'text-blue-500 ml-2'}`}>
                                 {msg.senderName} (AI)
                             </span>
                             <div className={`px-4 py-3 rounded-2xl text-sm shadow-sm ${
                                 isMe 
                                 ? 'bg-coral text-white rounded-tr-sm' 
                                 : 'bg-white border border-warm-gray text-text-main rounded-tl-sm'
                             }`}>
                                 {msg.text}
                             </div>
                         </div>
                     </div>
                 )
             })}
             
             {phase === 'talking' && (
                 <div className="flex gap-2 items-center text-text-muted text-xs ml-4 animate-pulse">
                     <span>{theirProfile.name} is typing...</span>
                 </div>
             )}
          </div>
      )}

      {/* Actions (Decision Phase) */}
      <div className="p-5 border-t border-warm-gray bg-white z-20">
         {phase === 'decision' ? (
             <div className="space-y-3 animate-in slide-in-from-bottom-4">
                 <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100 mb-2">
                     <div className="flex items-center gap-2 mb-1 text-green-700">
                        <Icons.Sparkles size={16} />
                        <h3 className="text-sm font-bold uppercase tracking-wide">Aura Consensus</h3>
                     </div>
                     <p className="text-sm text-green-900 leading-relaxed">
                        We both think this is a solid match. The conversation flowed naturally and values aligned on "taking it slow".
                     </p>
                 </div>
                 
                 <button 
                    onClick={onMatch}
                    className="w-full py-4 bg-text-main text-white font-bold rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-lg"
                 >
                    <Icons.MessageCircle size={18} /> Take Over Conversation
                 </button>
                 <button onClick={onClose} className="w-full py-3 text-text-sec hover:text-text-main transition-colors text-xs font-bold uppercase tracking-widest">
                    Dismiss
                 </button>
             </div>
         ) : (
             <div className="text-center py-4">
                 <button onClick={onClose} className="text-red-400 hover:text-red-500 text-xs font-bold uppercase tracking-widest px-6 py-2 rounded-lg hover:bg-red-50 transition-colors">
                    Stop Simulation
                 </button>
             </div>
         )}
      </div>
    </div>
  );
};

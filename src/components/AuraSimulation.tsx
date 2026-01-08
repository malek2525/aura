import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { UserProfile } from '../types';

interface AuraSimulationProps {
  myProfileName: string;
  theirProfile: UserProfile;
  onClose: () => void;
  onMatch: () => void;
}

export const AuraSimulation: React.FC<AuraSimulationProps> = ({ myProfileName, theirProfile, onClose, onMatch }) => {
  const [messages, setMessages] = useState<{sender: string, text: string}[]>([]);
  const [step, setStep] = useState(0);

  // Scripted simulation
  const script = [
    { sender: 'My Aura', text: `Hi! ${myProfileName} is really into ${theirProfile.interests[0]} too.` },
    { sender: `Her Aura`, text: `Oh really? ${theirProfile.name} spends every Sunday doing that.` },
    { sender: 'My Aura', text: `That's a match. ${myProfileName} is looking for something serious.` },
    { sender: `Her Aura`, text: `Same here. They would vibe on their shared love for ${theirProfile.interests[1]}.` },
  ];

  useEffect(() => {
    if (step < script.length) {
      const timer = setTimeout(() => {
        setMessages(prev => [...prev, script[step]]);
        setStep(prev => prev + 1);
      }, 1500); // Delay between messages
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-xl flex flex-col p-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-lg font-bold text-coral flex items-center gap-2">
          <Icons.Sparkles size={20} className="fill-coral animate-pulse" />
          Aura Check
        </h2>
        <button onClick={onClose} className="p-2 bg-warm-white rounded-full hover:bg-warm-gray">
          <Icons.X size={24} className="text-text-sec" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-8">
        {messages.map((msg, i) => {
          const isMe = msg.sender === 'My Aura';
          return (
            <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-500`}>
              <span className="text-[10px] text-text-muted mb-1">{msg.sender}</span>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${isMe ? 'bg-coral text-white rounded-tr-none' : 'bg-warm-white text-text-main border border-warm-gray rounded-tl-none'}`}>
                {msg.text}
              </div>
            </div>
          )
        })}
        {step < script.length && (
           <div className="flex gap-1 justify-center py-4">
             <div className="w-2 h-2 bg-coral/40 rounded-full animate-bounce"></div>
             <div className="w-2 h-2 bg-coral/40 rounded-full animate-bounce delay-100"></div>
             <div className="w-2 h-2 bg-coral/40 rounded-full animate-bounce delay-200"></div>
           </div>
        )}
      </div>

      <div className="mt-auto">
        {step >= script.length ? (
          <div className="space-y-3 animate-in slide-in-from-bottom-4 fade-in">
             <div className="text-center mb-4">
               <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">
                 High Compatibility
               </span>
             </div>
             <button onClick={onMatch} className="w-full py-4 bg-coral text-white font-bold rounded-2xl shadow-lg shadow-coral/30 hover:scale-[1.02] transition-transform">
               Continue & Match
             </button>
             <button onClick={onClose} className="w-full py-4 bg-white text-text-sec font-bold rounded-2xl border border-warm-gray hover:bg-warm-white transition-colors">
               Not interested
             </button>
          </div>
        ) : (
          <div className="text-center text-text-muted text-sm pb-8">
            Analyzing compatibility...
          </div>
        )}
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { UserProfile } from '../types';

interface AuraSimulationProps {
  myProfileName: string;
  theirProfile: UserProfile;
  onClose: () => void;
  onMatch: () => void;
}

export const AuraSimulation: React.FC<AuraSimulationProps> = ({ 
  myProfileName, 
  theirProfile, 
  onClose, 
  onMatch 
}) => {
  const [messages, setMessages] = useState<{sender: string, text: string}[]>([]);
  const [step, setStep] = useState(0);
  const [compatibility, setCompatibility] = useState<'high' | 'medium' | 'low' | null>(null);

  // Simulated AI conversation script
  const script = [
    { 
      sender: 'Your Aura', 
      text: `Hi! ${myProfileName} is really into ${theirProfile.interests[0] || 'creative things'} too.` 
    },
    { 
      sender: `${theirProfile.name}'s Aura`, 
      text: `Oh really? ${theirProfile.name} spends every weekend doing that!` 
    },
    { 
      sender: 'Your Aura', 
      text: `That's great! ${myProfileName} is looking for something meaningful.` 
    },
    { 
      sender: `${theirProfile.name}'s Aura`, 
      text: `Same here. They would definitely vibe on their shared love for ${theirProfile.interests[1] || 'good conversations'}.` 
    },
  ];

  useEffect(() => {
    if (step < script.length) {
      const timer = setTimeout(() => {
        setMessages(prev => [...prev, script[step]]);
        setStep(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else if (step === script.length) {
      // Calculate fake compatibility after conversation
      setTimeout(() => {
        setCompatibility(theirProfile.verificationScore > 70 ? 'high' : 'medium');
      }, 500);
    }
  }, [step, script.length, theirProfile.verificationScore]);

  return (
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-xl flex flex-col p-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-lg font-bold text-coral flex items-center gap-2">
          <Icons.Sparkles size={20} className="fill-coral animate-pulse" />
          Aura Check
        </h2>
        <button 
          onClick={onClose} 
          className="p-2 bg-warm-white rounded-full hover:bg-warm-gray transition-colors"
        >
          <Icons.X size={24} className="text-text-sec" />
        </button>
      </div>

      {/* Profiles Header */}
      <div className="flex justify-center items-center gap-4 mb-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-coral-light flex items-center justify-center mb-1">
            <Icons.Sparkles size={20} className="text-coral" />
          </div>
          <span className="text-xs text-text-sec">Your Aura</span>
        </div>
        <div className="flex-1 h-[1px] bg-warm-gray max-w-[60px]" />
        <Icons.MessageCircle size={20} className="text-text-muted" />
        <div className="flex-1 h-[1px] bg-warm-gray max-w-[60px]" />
        <div className="text-center">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-warm-gray mb-1">
            <img 
              src={theirProfile.photos[0]} 
              className="w-full h-full object-cover" 
              alt={theirProfile.name} 
            />
          </div>
          <span className="text-xs text-text-sec">{theirProfile.name}'s</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-8">
        {messages.map((msg, i) => {
          const isMe = msg.sender === 'Your Aura';
          return (
            <div 
              key={i} 
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-slide-up`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <span className="text-[10px] text-text-muted mb-1">{msg.sender}</span>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                isMe 
                  ? 'bg-coral text-white rounded-tr-none' 
                  : 'bg-warm-white text-text-main border border-warm-gray rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          );
        })}
        
        {/* Loading dots */}
        {step < script.length && (
          <div className="flex gap-1 justify-center py-4">
            <div className="w-2 h-2 bg-coral/40 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-coral/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-coral/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mt-auto">
        {compatibility ? (
          <div className="space-y-3 animate-slide-up">
            {/* Compatibility Badge */}
            <div className="text-center mb-4">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold border ${
                compatibility === 'high' 
                  ? 'bg-green-100 text-green-700 border-green-200'
                  : compatibility === 'medium'
                  ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                  : 'bg-red-100 text-red-700 border-red-200'
              }`}>
                {compatibility === 'high' ? '💚 High Compatibility' : 
                 compatibility === 'medium' ? '💛 Good Potential' : 
                 '❤️ Worth Exploring'}
              </span>
            </div>
            
            <button 
              onClick={onMatch} 
              className="w-full py-4 bg-coral text-white font-bold rounded-2xl shadow-lg shadow-coral/30 hover:scale-[1.02] transition-transform"
            >
              Continue & Match
            </button>
            
            <button 
              onClick={onClose} 
              className="w-full py-4 bg-white text-text-sec font-bold rounded-2xl border border-warm-gray hover:bg-warm-white transition-colors"
            >
              Not interested
            </button>
          </div>
        ) : (
          <div className="text-center text-text-muted text-sm pb-8">
            <Icons.Sparkles size={16} className="inline animate-pulse mr-2" />
            Analyzing compatibility...
          </div>
        )}
      </div>
    </div>
  );
};

export default AuraSimulation;

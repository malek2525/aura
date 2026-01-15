
import React, { useState } from 'react';
import { Icons } from '../components/Icons';

interface SettingsProps {
  onBack: () => void;
  onOpenIcons?: () => void;
  onOpenCodeMerger?: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onBack, onOpenIcons, onOpenCodeMerger }) => {
  const [minMatchScore, setMinMatchScore] = useState(80);
  const [strictDealbreakers, setStrictDealbreakers] = useState(true);
  
  // Discovery Preferences State
  const [showGender, setShowGender] = useState<'women' | 'men' | 'everyone'>('women');
  // Changed default start age to 18
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 26]);
  const [distance, setDistance] = useState(25);
  const [expandDistance, setExpandDistance] = useState(true);

  const Toggle = ({ value, onChange }: { value: boolean, onChange: (v: boolean) => void }) => (
      <div 
        onClick={() => onChange(!value)}
        className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${value ? 'bg-coral' : 'bg-gray-300'}`}
      >
        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${value ? 'right-1' : 'left-1'}`}></div>
      </div>
  );

  // Dual Slider Handler
  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
    const val = parseInt(e.target.value);
    const newRange = [...ageRange] as [number, number];
    newRange[index] = val;
    // Prevent crossover
    if (index === 0 && val >= ageRange[1]) newRange[0] = ageRange[1] - 1;
    if (index === 1 && val <= ageRange[0]) newRange[1] = ageRange[0] + 1;
    setAgeRange(newRange);
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* CSS Hack for Dual Range Slider Pointers */}
      <style>{`
        .dual-range-input::-webkit-slider-thumb {
          pointer-events: auto;
          width: 24px;
          height: 24px;
          -webkit-appearance: none; 
          cursor: pointer;
        }
        .dual-range-input {
          pointer-events: none;
        }
      `}</style>

      <div className="bg-white px-4 py-4 flex items-center border-b border-warm-gray sticky top-0 z-10">
        <button onClick={onBack} className="p-2 -ml-2 text-text-sec hover:bg-warm-white rounded-full">
          <Icons.ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-text-main mr-8">Settings</h1>
      </div>

      <div className="overflow-y-auto p-4 pb-24 space-y-8">
        
        {/* Aura Agent Criteria */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Icons.Bot size={16} className="text-coral" />
            <h2 className="text-xs font-bold text-coral uppercase tracking-wider">Aura Agent Criteria</h2>
          </div>
          <div className="bg-warm-white rounded-2xl border border-warm-gray overflow-hidden p-4 space-y-6">
             
             {/* Match Score Slider */}
             <div>
               <div className="flex justify-between items-end mb-2">
                 <span className="text-sm font-bold text-text-main">Minimum Match Score</span>
                 <span className="text-xl font-black text-coral">{minMatchScore}%</span>
               </div>
               <input 
                  type="range" 
                  min="60" max="99" 
                  value={minMatchScore} 
                  onChange={(e) => setMinMatchScore(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-coral" 
               />
               <p className="text-xs text-text-muted mt-2">
                 Your Aura will only talk to other Auras if the compatibility probability is above {minMatchScore}%.
               </p>
             </div>

             <div className="h-px bg-gray-200 w-full"></div>

             {/* Strictness */}
             <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm font-bold text-text-main block">Strict Dealbreakers</span>
                  <span className="text-xs text-text-sec">Never match if red flags are detected</span>
                </div>
                <Toggle value={strictDealbreakers} onChange={setStrictDealbreakers} />
             </div>

          </div>
        </section>

        {/* Discovery Preferences */}
        <section>
          <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Discovery Preferences</h2>
          <div className="bg-warm-white rounded-2xl border border-warm-gray overflow-hidden p-4 space-y-6">
             
             {/* Gender Preference */}
             <div>
                <span className="text-sm font-bold text-text-main block mb-3">Show me</span>
                <div className="flex bg-white border border-warm-gray rounded-xl p-1">
                    <button 
                        onClick={() => setShowGender('women')} 
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${showGender === 'women' ? 'bg-text-main text-white shadow-sm' : 'text-text-sec hover:bg-gray-50'}`}
                    >
                        Women
                    </button>
                    <button 
                        onClick={() => setShowGender('men')} 
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${showGender === 'men' ? 'bg-text-main text-white shadow-sm' : 'text-text-sec hover:bg-gray-50'}`}
                    >
                        Men
                    </button>
                    <button 
                        onClick={() => setShowGender('everyone')} 
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${showGender === 'everyone' ? 'bg-text-main text-white shadow-sm' : 'text-text-sec hover:bg-gray-50'}`}
                    >
                        Everyone
                    </button>
                </div>
             </div>

             <div className="h-px bg-gray-200 w-full"></div>

             {/* Age Range Slider */}
             <div>
               <div className="flex justify-between items-end mb-4">
                 <span className="text-sm font-bold text-text-main">Age Range</span>
                 <span className="text-sm font-bold text-text-main">{ageRange[0]} - {ageRange[1]}</span>
               </div>
               
               <div className="relative h-6 mb-2">
                   <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full -translate-y-1/2"></div>
                   {/* Active Track */}
                   <div 
                      className="absolute top-1/2 h-1 bg-coral rounded-full -translate-y-1/2"
                      style={{ 
                          left: `${((ageRange[0] - 18) / (99 - 18)) * 100}%`, 
                          right: `${100 - ((ageRange[1] - 18) / (99 - 18)) * 100}%` 
                      }}
                   ></div>

                   {/* Invisible Inputs with Pointer Events Fix */}
                   <input 
                      type="range" 
                      min="18" max="99" 
                      value={ageRange[0]} 
                      onChange={(e) => handleAgeChange(e, 0)}
                      className="absolute inset-0 w-full h-full opacity-0 z-20 dual-range-input" 
                   />
                   <input 
                      type="range" 
                      min="18" max="99" 
                      value={ageRange[1]} 
                      onChange={(e) => handleAgeChange(e, 1)}
                      className="absolute inset-0 w-full h-full opacity-0 z-20 dual-range-input" 
                   />
                   
                   {/* Visual Thumbs */}
                   <div 
                     className="absolute top-1/2 w-6 h-6 bg-white border-2 border-coral rounded-full shadow-md -translate-y-1/2 pointer-events-none z-10 transition-transform"
                     style={{ left: `calc(${((ageRange[0] - 18) / (99 - 18)) * 100}% - 12px)` }}
                   ></div>
                   <div 
                     className="absolute top-1/2 w-6 h-6 bg-white border-2 border-coral rounded-full shadow-md -translate-y-1/2 pointer-events-none z-10 transition-transform"
                     style={{ left: `calc(${((ageRange[1] - 18) / (99 - 18)) * 100}% - 12px)` }}
                   ></div>
               </div>
             </div>

             <div className="h-px bg-gray-200 w-full"></div>

             {/* Distance Slider */}
             <div>
               <div className="flex justify-between items-end mb-2">
                 <span className="text-sm font-bold text-text-main">Distance Preference</span>
                 <span className="text-sm font-bold text-text-main">{distance}km</span>
               </div>
               <input 
                  type="range" 
                  min="2" max="160" 
                  value={distance} 
                  onChange={(e) => setDistance(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-coral mb-4" 
               />
               <div className="flex justify-between items-center">
                  <span className="text-xs text-text-sec">Show people slightly further away if I run out</span>
                  <Toggle value={expandDistance} onChange={setExpandDistance} />
               </div>
             </div>

          </div>
        </section>

        {/* Account */}
        <section>
           <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Account</h2>
           <div className="bg-warm-white rounded-2xl border border-warm-gray overflow-hidden">
             
             {/* App Icon Selector */}
             <div 
               onClick={onOpenIcons}
               className="flex items-center p-4 border-b border-warm-gray hover:bg-white cursor-pointer transition-colors"
             >
               <Icons.ImagePlus size={18} className="text-text-muted mr-3" />
               <span className="text-sm font-medium text-text-main flex-1">App Icon</span>
               <div className="flex items-center gap-2 mr-2">
                 <div className="w-6 h-6 rounded-md bg-gradient-to-br from-coral to-coral-dark flex items-center justify-center">
                    <Icons.Sparkles className="text-white w-3 h-3" />
                 </div>
               </div>
               <Icons.ChevronRight size={16} className="text-text-muted" />
             </div>

             {[
               { label: 'Notifications', icon: Icons.Bell },
               { label: 'Privacy & Security', icon: Icons.ShieldCheck },
               { label: 'Help & Support', icon: Icons.MessageCircle },
             ].map((item, i) => (
               <div key={i} className="flex items-center p-4 border-b border-warm-gray last:border-0 hover:bg-white cursor-pointer transition-colors">
                 <item.icon size={18} className="text-text-muted mr-3" />
                 <span className="text-sm font-medium text-text-main flex-1">{item.label}</span>
                 <Icons.ChevronRight size={16} className="text-text-muted" />
               </div>
             ))}
           </div>
        </section>
        
        {/* Developer Mode */}
        <div className="pt-4 flex justify-center">
           <button 
             onClick={onOpenCodeMerger}
             className="text-[10px] text-text-muted uppercase tracking-widest font-bold hover:text-coral transition-colors flex items-center gap-1"
           >
             <Icons.Zap size={10} /> Developer Mode
           </button>
        </div>

        <button className="w-full py-3 rounded-xl border border-warm-gray bg-white text-text-main font-medium text-sm hover:bg-warm-white transition-colors">
          Log Out
        </button>
        <button className="w-full py-3 rounded-xl text-text-muted font-medium text-xs hover:text-red-500 transition-colors">
          Delete account
        </button>

      </div>
    </div>
  );
};

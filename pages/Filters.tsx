
import React, { useState } from 'react';
import { Icons } from '../components/Icons';

interface FiltersProps {
  onClose: () => void;
}

export const Filters: React.FC<FiltersProps> = ({ onClose }) => {
  const [gender, setGender] = useState<'women'|'men'|'everyone'>('women');
  // Fixed start range to 18
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 26]);
  const [distance, setDistance] = useState(25);
  const [expandAge, setExpandAge] = useState(true);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const interestsList = ['Gym', 'Art', 'Music', 'Tech', 'Travel', 'Foodie', 'Gaming', 'Outdoors'];
  const languagesList = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic', 'Russian', 'Portuguese', 'Hindi'];

  const toggleSelection = (item: string, list: string[], setList: (l: string[]) => void) => {
      if (list.includes(item)) {
          setList(list.filter(i => i !== item));
      } else {
          setList([...list, item]);
      }
  };

  // Simple dual slider logic
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
    <div className="h-full bg-slate-50 flex flex-col">
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

       <div className="bg-white px-4 py-4 flex items-center shadow-sm justify-between sticky top-0 z-10">
        <button onClick={onClose} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full">
          <Icons.X size={24} />
        </button>
        <h1 className="text-lg font-bold text-dark">Filters</h1>
        <button onClick={onClose} className="text-coral font-medium text-sm">Apply</button>
      </div>

      <div className="p-4 pb-24 overflow-y-auto space-y-6 no-scrollbar">
        
        {/* Gender */}
        <section className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-dark mb-4">Who would you like to date?</h3>
          <div className="flex bg-slate-100 p-1 rounded-xl">
             <button onClick={() => setGender('women')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${gender === 'women' ? 'bg-white shadow-sm text-dark' : 'text-slate-500'}`}>Women</button>
             <button onClick={() => setGender('men')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${gender === 'men' ? 'bg-white shadow-sm text-dark' : 'text-slate-500'}`}>Men</button>
             <button onClick={() => setGender('everyone')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${gender === 'everyone' ? 'bg-white shadow-sm text-dark' : 'text-slate-500'}`}>Everyone</button>
          </div>
        </section>

        {/* Age Range - Dual Slider Simulation */}
        <section className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
           <div className="flex justify-between mb-4">
             <span className="text-sm font-bold text-dark">Age Range</span>
             <span className="text-sm text-slate-500">{ageRange[0]} - {ageRange[1]}</span>
           </div>
           
           <div className="relative h-8 mb-4">
               <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 rounded-full"></div>
               {/* Active track */}
               <div 
                  className="absolute top-1/2 h-1 bg-coral rounded-full"
                  style={{ 
                      left: `${((ageRange[0] - 18) / (60 - 18)) * 100}%`, 
                      right: `${100 - ((ageRange[1] - 18) / (60 - 18)) * 100}%` 
                  }}
               ></div>

               <input 
                  type="range" 
                  min="18" max="60" 
                  value={ageRange[0]} 
                  onChange={(e) => handleAgeChange(e, 0)}
                  className="absolute inset-0 w-full h-full opacity-0 z-20 dual-range-input" 
               />
               <input 
                  type="range" 
                  min="18" max="60" 
                  value={ageRange[1]} 
                  onChange={(e) => handleAgeChange(e, 1)}
                  className="absolute inset-0 w-full h-full opacity-0 z-20 dual-range-input" 
               />
               
               {/* Visual Thumbs */}
               <div 
                 className="absolute top-1/2 w-6 h-6 bg-white border-2 border-coral rounded-full shadow-sm -mt-3 pointer-events-none z-10"
                 style={{ left: `calc(${((ageRange[0] - 18) / (60 - 18)) * 100}% - 12px)` }}
               ></div>
               <div 
                 className="absolute top-1/2 w-6 h-6 bg-white border-2 border-coral rounded-full shadow-sm -mt-3 pointer-events-none z-10"
                 style={{ left: `calc(${((ageRange[1] - 18) / (60 - 18)) * 100}% - 12px)` }}
               ></div>
           </div>
           
           <div className="flex justify-between items-center border-t border-slate-50 pt-4">
              <span className="text-xs text-slate-500">See people 2 years either side if I run out</span>
              <div 
                onClick={() => setExpandAge(!expandAge)}
                className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${expandAge ? 'bg-coral' : 'bg-slate-200'}`}
              >
                 <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${expandAge ? 'right-1' : 'left-1'}`}></div>
              </div>
           </div>
        </section>

        {/* Distance */}
        <section className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
           <div className="flex justify-between mb-4">
             <span className="text-sm font-bold text-dark">Maximum Distance</span>
             <span className="text-sm text-slate-500">{distance} km</span>
           </div>
           <input 
              type="range" 
              min="5" max="100" 
              value={distance} 
              onChange={(e) => setDistance(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-coral" 
            />
        </section>

        {/* Interests Filter */}
        <section className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
           <h3 className="text-sm font-bold text-dark mb-4">Filter by interest</h3>
           <div className="flex flex-wrap gap-2">
             {interestsList.map((tag) => {
               const isSelected = selectedInterests.includes(tag);
               return (
                <button 
                    key={tag} 
                    onClick={() => toggleSelection(tag, selectedInterests, setSelectedInterests)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1 transition-colors ${isSelected ? 'bg-coral text-white border-coral' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                    {tag} {isSelected ? <Icons.Check size={12} /> : <Icons.Plus size={12} />}
                </button>
               )
             })}
           </div>
        </section>

        {/* Language Filter */}
        <section className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
           <h3 className="text-sm font-bold text-dark mb-4">Filter by Language</h3>
           <div className="flex flex-wrap gap-2">
             {languagesList.map((lang) => {
               const isSelected = selectedLanguages.includes(lang);
               return (
                <button 
                    key={lang} 
                    onClick={() => toggleSelection(lang, selectedLanguages, setSelectedLanguages)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1 transition-colors ${isSelected ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                    {lang} {isSelected ? <Icons.Check size={12} /> : <Icons.Plus size={12} />}
                </button>
               )
             })}
           </div>
        </section>

        {/* Advanced Filters (Premium) */}
         <section className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-100">
           <div className="flex items-center gap-2 mb-4">
             <Icons.Star size={16} className="text-amber-500 fill-amber-500" />
             <h3 className="text-sm font-bold text-amber-900">Advanced Filters</h3>
           </div>
           
           <div className="space-y-1">
             {['Education', 'Height', 'Family Plans', 'Religion'].map((f, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-amber-100/50 last:border-0 cursor-pointer">
                  <span className="text-sm text-slate-700">{f}</span>
                  <Icons.Lock size={14} className="text-amber-500" />
                </div>
             ))}
           </div>
           
           <button className="mt-4 w-full py-2 bg-amber-400 text-amber-950 font-bold text-sm rounded-xl hover:bg-amber-500 transition-colors">
             Upgrade to Unlock
           </button>
        </section>

      </div>
    </div>
  );
};

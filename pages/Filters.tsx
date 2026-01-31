
import React, { useState } from 'react';
import { Icons } from '../components/Icons';

interface FiltersProps {
  onClose: () => void;
  onShowMatches?: () => void;
}

export const Filters: React.FC<FiltersProps> = ({ onClose, onShowMatches }) => {
  const [gender, setGender] = useState<'women'|'men'|'everyone'>('women');
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(35);
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

  const handleMinAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (val < maxAge) {
      setMinAge(val);
    }
  };

  const handleMaxAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (val > minAge) {
      setMaxAge(val);
    }
  };

  const handleApply = () => {
    onClose();
  };

  const handleApplyAndShowMatches = () => {
    onClose();
    if (onShowMatches) {
      onShowMatches();
    }
  };

  return (
    <div className="h-full bg-bg-light flex flex-col">
       <div className="bg-white px-4 py-4 flex items-center shadow-sm justify-between sticky top-0 z-10">
        <button onClick={onClose} className="p-2 -ml-2 text-text-sec hover:bg-warm-gray rounded-full">
          <Icons.X size={24} />
        </button>
        <h1 className="text-lg font-bold text-text-main">Filters</h1>
        <button onClick={handleApply} className="text-primary font-bold text-sm">Apply</button>
      </div>

      <div className="p-4 pb-32 overflow-y-auto space-y-6 no-scrollbar">
        
        {/* Gender */}
        <section className="bg-white p-4 rounded-2xl shadow-sm border border-warm-gray">
          <h3 className="text-sm font-bold text-text-main mb-4">Who would you like to date?</h3>
          <div className="flex bg-warm-gray p-1 rounded-xl">
             <button onClick={() => setGender('women')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${gender === 'women' ? 'bg-white shadow-sm text-text-main' : 'text-text-sec'}`}>Women</button>
             <button onClick={() => setGender('men')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${gender === 'men' ? 'bg-white shadow-sm text-text-main' : 'text-text-sec'}`}>Men</button>
             <button onClick={() => setGender('everyone')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${gender === 'everyone' ? 'bg-white shadow-sm text-text-main' : 'text-text-sec'}`}>Everyone</button>
          </div>
        </section>

        {/* Age Range - Separate Min/Max */}
        <section className="bg-white p-4 rounded-2xl shadow-sm border border-warm-gray">
           <div className="flex justify-between mb-4">
             <span className="text-sm font-bold text-text-main">Age Range</span>
             <span className="text-sm text-text-sec font-medium">{minAge} - {maxAge}</span>
           </div>
           
           {/* Minimum Age */}
           <div className="mb-4">
             <div className="flex justify-between items-center mb-2">
               <label className="text-xs font-bold text-text-sec uppercase tracking-wide">Minimum Age</label>
               <span className="text-sm font-bold text-primary">{minAge}</span>
             </div>
             <input 
                type="range" 
                min="18" 
                max="59" 
                value={minAge} 
                onChange={handleMinAgeChange}
                className="w-full h-2 bg-warm-gray rounded-lg appearance-none cursor-pointer accent-primary" 
             />
           </div>

           {/* Maximum Age */}
           <div className="mb-4">
             <div className="flex justify-between items-center mb-2">
               <label className="text-xs font-bold text-text-sec uppercase tracking-wide">Maximum Age</label>
               <span className="text-sm font-bold text-primary">{maxAge}</span>
             </div>
             <input 
                type="range" 
                min="19" 
                max="60" 
                value={maxAge} 
                onChange={handleMaxAgeChange}
                className="w-full h-2 bg-warm-gray rounded-lg appearance-none cursor-pointer accent-primary" 
             />
           </div>
           
           <div className="flex justify-between items-center border-t border-warm-gray pt-4">
              <span className="text-xs text-text-sec">See people 2 years either side if I run out</span>
              <div 
                onClick={() => setExpandAge(!expandAge)}
                className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${expandAge ? 'bg-primary' : 'bg-warm-gray'}`}
              >
                 <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${expandAge ? 'right-1' : 'left-1'}`}></div>
              </div>
           </div>
        </section>

        {/* Distance */}
        <section className="bg-white p-4 rounded-2xl shadow-sm border border-warm-gray">
           <div className="flex justify-between mb-4">
             <span className="text-sm font-bold text-text-main">Maximum Distance</span>
             <span className="text-sm text-text-sec">{distance} km</span>
           </div>
           <input 
              type="range" 
              min="5" max="100" 
              value={distance} 
              onChange={(e) => setDistance(parseInt(e.target.value))}
              className="w-full h-2 bg-warm-gray rounded-lg appearance-none cursor-pointer accent-primary" 
            />
        </section>

        {/* Interests Filter */}
        <section className="bg-white p-4 rounded-2xl shadow-sm border border-warm-gray">
           <h3 className="text-sm font-bold text-text-main mb-4">Filter by interest</h3>
           <div className="flex flex-wrap gap-2">
             {interestsList.map((tag) => {
               const isSelected = selectedInterests.includes(tag);
               return (
                <button 
                    key={tag} 
                    onClick={() => toggleSelection(tag, selectedInterests, setSelectedInterests)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1 transition-colors ${isSelected ? 'bg-primary text-white border-primary' : 'bg-white border-warm-gray text-text-sec hover:border-text-sec'}`}
                >
                    {tag} {isSelected ? <Icons.Check size={12} /> : <Icons.Plus size={12} />}
                </button>
               )
             })}
           </div>
        </section>

        {/* Language Filter */}
        <section className="bg-white p-4 rounded-2xl shadow-sm border border-warm-gray">
           <h3 className="text-sm font-bold text-text-main mb-4">Filter by Language</h3>
           <div className="flex flex-wrap gap-2">
             {languagesList.map((lang) => {
               const isSelected = selectedLanguages.includes(lang);
               return (
                <button 
                    key={lang} 
                    onClick={() => toggleSelection(lang, selectedLanguages, setSelectedLanguages)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1 transition-colors ${isSelected ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-warm-gray text-text-sec hover:border-text-sec'}`}
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
                  <span className="text-sm text-text-main">{f}</span>
                  <Icons.Lock size={14} className="text-amber-500" />
                </div>
             ))}
           </div>
           
           <button className="mt-4 w-full py-2 bg-amber-400 text-amber-950 font-bold text-sm rounded-xl hover:bg-amber-500 transition-colors">
             Upgrade to Unlock
           </button>
        </section>

      </div>

      {/* Bottom Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-warm-gray flex gap-3">
        <button 
          onClick={handleApply}
          className="flex-1 py-3 bg-primary text-white font-bold text-sm rounded-xl"
        >
          Apply Filters
        </button>
        {onShowMatches && (
          <button 
            onClick={handleApplyAndShowMatches}
            className="flex-1 py-3 bg-primary/10 text-primary font-bold text-sm rounded-xl border border-primary"
          >
            Show Matches
          </button>
        )}
      </div>
    </div>
  );
};

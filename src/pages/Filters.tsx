import React from 'react';
import { Icons } from '../components/Icons';

interface FiltersProps {
  onClose: () => void;
  onApply?: () => void;
}

export const Filters: React.FC<FiltersProps> = ({ onClose, onApply }) => {
  return (
    <div className="h-full bg-warm-white flex flex-col">
      <div className="bg-white px-4 py-4 flex items-center shadow-sm justify-between sticky top-0 z-10">
        <button 
          onClick={onClose} 
          className="p-2 -ml-2 text-text-sec hover:bg-warm-white rounded-full"
        >
          <Icons.X size={24} />
        </button>
        <h1 className="text-lg font-bold text-text-main">Filters</h1>
        <button 
          onClick={onApply || onClose} 
          className="text-coral font-medium text-sm"
        >
          Apply
        </button>
      </div>

      <div className="p-4 pb-24 overflow-y-auto space-y-6">
        
        {/* Gender */}
        <section className="bg-white p-4 rounded-2xl shadow-sm border border-warm-gray">
          <h3 className="text-sm font-bold text-text-main mb-4">Who would you like to date?</h3>
          <div className="flex bg-warm-white p-1 rounded-xl">
            <button className="flex-1 py-2 text-sm font-medium rounded-lg bg-white shadow-sm text-text-main transition-all">
              Women
            </button>
            <button className="flex-1 py-2 text-sm font-medium rounded-lg text-text-sec hover:text-text-main transition-all">
              Men
            </button>
            <button className="flex-1 py-2 text-sm font-medium rounded-lg text-text-sec hover:text-text-main transition-all">
              Everyone
            </button>
          </div>
        </section>

        {/* Age & Distance */}
        <section className="bg-white p-4 rounded-2xl shadow-sm border border-warm-gray">
          <div className="flex justify-between mb-6">
            <span className="text-sm font-bold text-text-main">Age Range</span>
            <span className="text-sm text-text-sec">18 - 28</span>
          </div>
          {/* Slider placeholder */}
          <div className="h-1 bg-warm-gray rounded-full w-full relative mb-8">
            <div className="absolute left-[10%] right-[60%] top-0 h-full bg-coral rounded-full" />
            <div className="absolute left-[10%] top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-warm-gray shadow-md rounded-full" />
            <div className="absolute right-[60%] top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-warm-gray shadow-md rounded-full" />
          </div>
          
          <div className="flex justify-between items-center border-t border-warm-gray pt-4">
            <span className="text-xs text-text-sec">See people 2 years either side if I run out</span>
            <div className="w-10 h-5 bg-warm-gray rounded-full relative cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm" />
            </div>
          </div>
        </section>

        {/* Interests */}
        <section className="bg-white p-4 rounded-2xl shadow-sm border border-warm-gray">
          <h3 className="text-sm font-bold text-text-main mb-4">Filter by interest</h3>
          <div className="flex flex-wrap gap-2">
            {['Gym', 'Art', 'Music', 'Tech'].map((tag, i) => (
              <button 
                key={i} 
                className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1 transition-colors ${
                  i === 0 
                    ? 'bg-coral/10 border-coral text-coral' 
                    : 'bg-white border-warm-gray text-text-sec hover:border-text-muted'
                }`}
              >
                {tag} {i === 0 ? <Icons.X size={12} /> : <Icons.Plus size={12} />}
              </button>
            ))}
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
              <div 
                key={i} 
                className="flex items-center justify-between py-3 border-b border-amber-100/50 last:border-0 cursor-pointer"
              >
                <span className="text-sm text-text-sec">{f}</span>
                <Icons.Plus size={16} className="text-amber-500" />
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

export default Filters;

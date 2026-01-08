import React from 'react';
import { Icons } from '../components/Icons';

interface FiltersProps {
  onClose: () => void;
}

export const Filters: React.FC<FiltersProps> = ({ onClose }) => {
  return (
    <div className="h-full bg-slate-50 flex flex-col">
       <div className="bg-white px-4 py-4 flex items-center shadow-sm justify-between sticky top-0 z-10">
        <button onClick={onClose} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full">
          <Icons.X size={24} />
        </button>
        <h1 className="text-lg font-bold text-dark">Filters</h1>
        <button onClick={onClose} className="text-primary font-medium text-sm">Apply</button>
      </div>

      <div className="p-4 pb-24 overflow-y-auto space-y-6">
        
        {/* Gender */}
        <section className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-dark mb-4">Who would you like to date?</h3>
          <div className="flex bg-slate-100 p-1 rounded-xl">
             <button className="flex-1 py-2 text-sm font-medium rounded-lg bg-white shadow-sm text-dark transition-all">Women</button>
             <button className="flex-1 py-2 text-sm font-medium rounded-lg text-slate-500 hover:text-dark transition-all">Men</button>
             <button className="flex-1 py-2 text-sm font-medium rounded-lg text-slate-500 hover:text-dark transition-all">Everyone</button>
          </div>
        </section>

        {/* Sliders */}
        <section className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
           <div className="flex justify-between mb-6">
             <span className="text-sm font-bold text-dark">Age Range</span>
             <span className="text-sm text-slate-500">18 - 28</span>
           </div>
           {/* Fake Double Slider */}
           <div className="h-1 bg-slate-200 rounded-full w-full relative mb-8">
               <div className="absolute left-[10%] right-[60%] top-0 h-full bg-primary rounded-full"></div>
               <div className="absolute left-[10%] top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-slate-200 shadow-md rounded-full"></div>
               <div className="absolute right-[60%] top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-slate-200 shadow-md rounded-full"></div>
           </div>
           
           <div className="flex justify-between items-center border-t border-slate-50 pt-4">
              <span className="text-xs text-slate-500">See people 2 years either side if I run out</span>
              <div className="w-10 h-5 bg-slate-200 rounded-full relative cursor-pointer">
                 <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm"></div>
              </div>
           </div>
        </section>

        {/* Interests Filter */}
        <section className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
           <h3 className="text-sm font-bold text-dark mb-4">Filter by interest</h3>
           <div className="flex flex-wrap gap-2">
             {['Gym', 'Art', 'Music', 'Tech'].map((tag, i) => (
               <button key={i} className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1 transition-colors ${i === 0 ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>
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
                <div key={i} className="flex items-center justify-between py-3 border-b border-amber-100/50 last:border-0 cursor-pointer">
                  <span className="text-sm text-slate-700">{f}</span>
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
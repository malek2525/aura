import React from 'react';
import { Icons } from '../components/Icons';

export const Likes: React.FC = () => {
  return (
    <div className="h-full bg-white flex flex-col pt-4 pb-24 px-4">
      <div className="flex justify-between items-center mb-6 px-2">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Likes</h1>
          <p className="text-xs text-text-sec">They're into you!</p>
        </div>
        <button className="text-text-sec">
          <Icons.SlidersHorizontal size={20} />
        </button>
      </div>

      {/* Upgrade Banner */}
      <div className="bg-text-main rounded-2xl p-5 mb-6 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-white font-bold text-lg">See who likes you</h3>
          <p className="text-text-muted text-xs mb-3">Upgrade to Aura+ to reveal 12 profiles.</p>
          <button className="bg-gold text-text-main px-4 py-2 rounded-full text-xs font-bold hover:bg-white transition-colors">
            Try Free for 3 days
          </button>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-coral/20 blur-3xl rounded-full"></div>
      </div>

      {/* Matches Section */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-text-main mb-3 px-1">Your Matches (2)</h2>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {[1, 2].map((i) => (
             <div key={i} className="flex flex-col items-center gap-1 min-w-[70px]">
               <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-coral to-gold">
                 <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
                    <img src={`https://picsum.photos/100/100?random=${i+50}`} className="w-full h-full object-cover" />
                 </div>
               </div>
               <span className="text-xs font-medium text-text-main">Sarah</span>
             </div>
           ))}
        </div>
      </div>

      {/* Likes Grid */}
      <div>
        <h2 className="text-sm font-bold text-text-main mb-3 px-1">People Who Liked You</h2>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-warm-white border border-warm-gray">
              {/* Image with Blur */}
              <img 
                src={`https://picsum.photos/300/400?random=${i+20}`} 
                className="w-full h-full object-cover blur-xl scale-110 opacity-60" 
                alt="Hidden User" 
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-8 h-8 bg-coral/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2">
                   <Icons.Heart size={14} className="text-coral fill-coral" />
                </div>
              </div>
               
              {/* Fake Name Tag */}
              <div className="absolute bottom-3 left-3 right-3">
                   <div className="h-2 w-16 bg-text-sec/10 rounded-full mb-1"></div>
                   <div className="h-2 w-8 bg-text-sec/10 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
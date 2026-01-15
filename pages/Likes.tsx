
import React from 'react';
import { Icons } from '../components/Icons';
import { UserProfile } from '../types';
import { getProfileById } from '../services/matchService';

interface LikesProps {
    onProfileClick: (profile: UserProfile) => void;
}

export const Likes: React.FC<LikesProps> = ({ onProfileClick }) => {
  // Use mock data from service to get real profile objects for the interaction
  const mockLikedUser = getProfileById('demo_sarah');

  return (
    <div className="h-full bg-warm-white flex flex-col pt-4 pb-24 px-4 overflow-y-auto no-scrollbar">
      <div className="flex justify-between items-center mb-6 px-2">
        <div>
          <h1 className="text-2xl font-extrabold text-text-main tracking-tight">Likes</h1>
          <p className="text-xs text-text-sec font-medium">People who vibed with you</p>
        </div>
        <button className="text-text-sec hover:bg-white p-2 rounded-full transition-colors">
          <Icons.SlidersHorizontal size={20} />
        </button>
      </div>

      {/* Upgrade Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-black rounded-3xl p-6 mb-8 relative overflow-hidden shadow-xl shadow-black/10 group cursor-pointer">
        <div className="relative z-10 flex flex-col items-start gap-4">
          <div>
              <div className="flex items-center gap-2 mb-1">
                 <Icons.Crown size={18} className="text-gold fill-gold animate-pulse-slow" />
                 <span className="text-gold text-[10px] font-bold uppercase tracking-widest">Aura Gold</span>
              </div>
              <h3 className="text-white font-extrabold text-xl leading-tight">See who likes you</h3>
              <p className="text-white/60 text-xs font-medium">Unlock 12+ admirers waiting for you.</p>
          </div>
          <button className="bg-white text-black px-5 py-2.5 rounded-full text-xs font-bold hover:scale-105 transition-transform shadow-lg">
            Unlock Now
          </button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-gold/30 to-coral/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 blur-2xl rounded-full translate-y-1/2 -translate-x-1/4"></div>
      </div>

      {/* Matches Section */}
      <div className="mb-8">
        <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4 px-1">Your Matches</h2>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
           {/* Sarah Match */}
             <div className="flex flex-col items-center gap-2 min-w-[76px] cursor-pointer group" onClick={() => mockLikedUser && onProfileClick(mockLikedUser)}>
               <div className="w-[76px] h-[76px] rounded-full p-[3px] bg-gradient-to-tr from-coral to-gold shadow-sm group-hover:scale-105 transition-transform">
                 <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
                    <img src={mockLikedUser?.photos[0] || 'https://ui-avatars.com/api/?name=S'} className="w-full h-full object-cover" />
                 </div>
               </div>
               <span className="text-xs font-bold text-text-main">Sarah</span>
             </div>
             
             {/* Placeholder for empty state if needed */}
             {/* <div className="flex flex-col items-center gap-2 min-w-[76px] opacity-40">
                <div className="w-[76px] h-[76px] rounded-full bg-gray-200 border-2 border-white"></div>
                <div className="w-12 h-3 bg-gray-200 rounded-full"></div>
             </div> */}
        </div>
      </div>

      {/* Likes Grid */}
      <div>
        <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4 px-1">12 People Like You</h2>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-warm-gray border-4 border-white shadow-sm group cursor-pointer">
              {/* Image with Blur */}
              <img 
                src={`https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&q=60`} 
                className="w-full h-full object-cover blur-md scale-110 opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-60" 
                alt="Hidden User" 
              />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-2 border border-white/40 shadow-lg group-hover:scale-110 transition-transform">
                   <Icons.Heart size={20} className="text-white fill-white drop-shadow-md" />
                </div>
                <span className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">
                    Nearby
                </span>
              </div>
            </div>
          ))}
          
          {/* More placeholder */}
          <div className="aspect-[3/4] rounded-3xl bg-gray-100 flex flex-col items-center justify-center border-4 border-white border-dashed text-text-muted">
              <span className="text-2xl font-black opacity-20">+6</span>
              <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

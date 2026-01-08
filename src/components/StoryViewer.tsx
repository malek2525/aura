import React, { useEffect, useState } from 'react';
import { Icons } from './Icons';
import { UserProfile } from '../types';

interface StoryViewerProps {
  user: UserProfile;
  onClose: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({ user, onClose }) => {
  const [progress, setProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const currentStory = user.stories[currentIndex];

  useEffect(() => {
    if (!currentStory) {
      onClose();
      return;
    }

    const timer = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) {
          if (currentIndex < user.stories.length - 1) {
            setCurrentIndex(prev => prev + 1);
            return 0;
          } else {
            clearInterval(timer);
            onClose();
            return 100;
          }
        }
        return old + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [currentIndex, user.stories.length, onClose, currentStory]);

  const handleNext = () => {
    if (currentIndex < user.stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
    }
  };

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Progress Bars */}
      <div className="absolute top-0 left-0 right-0 p-2 z-30 flex gap-1 pointer-events-none">
        {user.stories.map((story, idx) => (
          <div key={story.id} className="h-1 bg-white/30 flex-1 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{ 
                width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%' 
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-4 left-0 right-0 p-4 z-30 flex justify-between items-center text-white mt-4 pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-white">
            <img src={user.photos[0]} className="w-full h-full object-cover" alt={user.name} />
          </div>
          <span className="font-bold text-sm">{user.name}</span>
          <span className="text-white/60 text-xs">{currentStory.timestamp}</span>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 rounded-full hover:bg-white/20 transition-colors"
        >
          <Icons.X size={24} />
        </button>
      </div>

      {/* Story Content */}
      <div className="flex-1 relative bg-gray-900 flex items-center justify-center">
        <img 
          src={currentStory.imageUrl} 
          className="w-full h-full object-cover" 
          alt="Story" 
        />
        
        {/* Tap Areas */}
        <div className="absolute inset-0 flex z-10">
          <div className="w-1/3 h-full" onClick={handlePrev} />
          <div className="w-2/3 h-full" onClick={handleNext} />
        </div>
      </div>
      
      {/* Reply Input */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-30 pb-8 bg-gradient-to-t from-black/80 to-transparent pointer-events-auto">
        <div className="flex items-center gap-4">
          <input 
            type="text" 
            placeholder="Send message..." 
            className="flex-1 bg-transparent border border-white/50 rounded-full px-4 py-2 text-white placeholder-white/70 text-sm focus:border-white outline-none"
          />
          <button className="text-white hover:text-coral transition-colors">
            <Icons.Heart size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;

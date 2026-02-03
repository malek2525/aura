import React, { useState } from "react";
import { Icons } from "../components/Icons";

interface FiltersProps {
  onClose: () => void;
  onShowMatches?: () => void;
}

export const Filters: React.FC<FiltersProps> = ({ onClose, onShowMatches }) => {
  const [gender, setGender] = useState<"women" | "men" | "everyone">("women");
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(35);
  const [distance, setDistance] = useState(50);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const interestsList = [
    "Gym",
    "Art",
    "Music",
    "Tech",
    "Travel",
    "Foodie",
    "Gaming",
    "Outdoors",
  ];

  const handleMinAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinAge(Math.min(Number(e.target.value), maxAge - 1));
  };

  const handleMaxAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxAge(Math.max(Number(e.target.value), minAge + 1));
  };

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="bg-white px-4 py-4 flex items-center shadow-sm justify-between sticky top-0 z-10">
        <button
          onClick={onClose}
          className="p-2 -ml-2 text-text-sec hover:bg-warm-gray rounded-full"
        >
          <Icons.X size={24} />
        </button>
        <h1 className="text-lg font-bold text-text-main">Filters</h1>
        <button onClick={onClose} className="text-coral font-bold text-sm">
          Apply
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-8 no-scrollbar">
        {/* Gender */}
        <section>
          <h3 className="text-xs font-black text-text-muted uppercase tracking-widest mb-4">
            Show me
          </h3>
          <div className="flex bg-warm-white p-1 rounded-2xl border border-warm-gray">
            {["women", "men", "everyone"].map((opt) => (
              <button
                key={opt}
                onClick={() => setGender(opt as any)}
                className={`flex-1 py-3 text-sm font-bold rounded-xl capitalize transition-all ${gender === opt ? "bg-white shadow-sm text-text-main" : "text-text-sec"}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </section>

        {/* Dual Age Slider */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <span className="text-xs font-black text-text-muted uppercase tracking-widest">
              Age Range
            </span>
            <span className="text-coral font-black text-xl">
              {minAge} — {maxAge}
            </span>
          </div>
          <div className="relative h-10 flex items-center px-2">
            <div className="absolute h-1.5 w-full bg-warm-gray rounded-full" />
            <div
              className="absolute h-1.5 bg-coral rounded-full"
              style={{
                left: `${((minAge - 18) / 42) * 100}%`,
                right: `${100 - ((maxAge - 18) / 42) * 100}%`,
              }}
            />
            <input
              type="range"
              min="18"
              max="60"
              value={minAge}
              onChange={handleMinAgeChange}
              className="absolute w-full appearance-none bg-transparent pointer-events-none z-10 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-coral [&::-webkit-slider-thumb]:appearance-none"
            />
            <input
              type="range"
              min="18"
              max="60"
              value={maxAge}
              onChange={handleMaxAgeChange}
              className="absolute w-full appearance-none bg-transparent pointer-events-none z-10 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-coral [&::-webkit-slider-thumb]:appearance-none"
            />
          </div>
        </section>

        {/* Distance (Max 1000) */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <span className="text-xs font-black text-text-muted uppercase tracking-widest">
              Distance
            </span>
            <span className="text-coral font-black text-xl">{distance} km</span>
          </div>
          <input
            type="range"
            min="1"
            max="1000"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full h-1.5 bg-warm-gray rounded-full appearance-none accent-coral cursor-pointer"
          />
        </section>

        {/* Interests */}
        <section>
          <h3 className="text-xs font-black text-text-muted uppercase tracking-widest mb-4">
            Interests
          </h3>
          <div className="flex flex-wrap gap-2">
            {interestsList.map((tag) => (
              <button
                key={tag}
                onClick={() =>
                  setSelectedInterests((prev) =>
                    prev.includes(tag)
                      ? prev.filter((i) => i !== tag)
                      : [...prev, tag],
                  )
                }
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${selectedInterests.includes(tag) ? "bg-coral text-white border-coral" : "bg-white border-warm-gray text-text-sec"}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        {/* Advanced Filters (Premium) */}
        <section className="bg-gradient-to-br from-coral-light/5 to-gold/5 p-5 rounded-3xl border border-coral/10">
          <div className="flex items-center gap-2 mb-4">
            <Icons.Sparkles size={16} className="text-coral" />
            <h3 className="text-sm font-bold text-text-main">
              Aura Premium Filters
            </h3>
          </div>
          <div className="space-y-4">
            {["Education", "Looking For", "Lifestyle"].map((f) => (
              <div
                key={f}
                className="flex items-center justify-between py-1 opacity-60"
              >
                <span className="text-sm font-medium">{f}</span>
                <Icons.Lock size={14} />
              </div>
            ))}
          </div>
          <button className="mt-6 w-full py-3 bg-text-main text-white font-bold text-xs rounded-xl">
            Unlock All Filters
          </button>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-warm-gray flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-4 bg-coral text-white font-bold rounded-2xl shadow-lg shadow-coral/30"
        >
          Apply Filters
        </button>
        {onShowMatches && (
          <button
            onClick={() => {
              onClose();
              onShowMatches();
            }}
            className="flex-1 py-4 bg-warm-white text-text-main font-bold rounded-2xl border border-warm-gray"
          >
            Show Matches
          </button>
        )}
      </div>
    </div>
  );
};

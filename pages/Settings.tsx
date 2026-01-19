import React, { useState } from "react";
import { Icons } from "../components/Icons";

interface SettingsProps {
  onBack: () => void;
  onOpenIcons?: () => void;
  onOpenCodeMerger?: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  onBack,
  onOpenIcons,
  onOpenCodeMerger,
}) => {
  const [minMatchScore, setMinMatchScore] = useState(80);
  const [strictDealbreakers, setStrictDealbreakers] = useState(true);
  const [ghostMode, setGhostMode] = useState(false);

  // Discovery Preferences State
  const [showGender, setShowGender] = useState<"women" | "men" | "everyone">(
    "women",
  );
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 26]);
  const [distance, setDistance] = useState(25);
  const [expandDistance, setExpandDistance] = useState(true);

  const Toggle = ({
    value,
    onChange,
  }: {
    value: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <div
      onClick={() => onChange(!value)}
      className={`w-12 h-7 rounded-full relative cursor-pointer transition-colors ${value ? "bg-coral" : "bg-gray-300"}`}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow-sm ${value ? "right-1" : "left-1"}`}
      />
    </div>
  );

  const handleAgeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: 0 | 1,
  ) => {
    const val = parseInt(e.target.value);
    const newRange = [...ageRange] as [number, number];
    newRange[index] = val;
    if (index === 0 && val >= ageRange[1]) newRange[0] = ageRange[1] - 1;
    if (index === 1 && val <= ageRange[0]) newRange[1] = ageRange[0] + 1;
    setAgeRange(newRange);
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center border-b border-gray-100 sticky top-0 z-10">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full"
        >
          <Icons.ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-text-main mr-8">
          Settings
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-6">
        {/* Ghost Mode - NEW */}
        <section>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icons.Eye size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Ghost Mode</h3>
                  <p className="text-white/70 text-xs">Browse invisibly</p>
                </div>
              </div>
              <Toggle value={ghostMode} onChange={setGhostMode} />
            </div>
          </div>
        </section>

        {/* Aura Agent Criteria */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Icons.Sparkles size={16} className="text-coral" />
            <h2 className="text-xs font-bold text-coral uppercase tracking-wider">
              Aura Agent Criteria
            </h2>
          </div>
          <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden p-4 space-y-6">
            {/* Match Score Slider */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-text-main">
                  Minimum Match Score
                </span>
                <span className="text-xl font-black text-coral">
                  {minMatchScore}%
                </span>
              </div>
              <input
                type="range"
                min="60"
                max="99"
                value={minMatchScore}
                onChange={(e) => setMinMatchScore(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-coral"
              />
              <p className="text-xs text-gray-500 mt-2">
                Your Aura will only talk to other Auras if compatibility is
                above {minMatchScore}%.
              </p>
            </div>

            <div className="h-px bg-gray-200 w-full" />

            {/* Strictness */}
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm font-bold text-text-main block">
                  Strict Dealbreakers
                </span>
                <span className="text-xs text-gray-500">
                  Never match if red flags detected
                </span>
              </div>
              <Toggle
                value={strictDealbreakers}
                onChange={setStrictDealbreakers}
              />
            </div>
          </div>
        </section>

        {/* Discovery Preferences */}
        <section>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Discovery Preferences
          </h2>
          <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden p-4 space-y-6">
            {/* Gender Preference */}
            <div>
              <span className="text-sm font-bold text-text-main block mb-3">
                Show me
              </span>
              <div className="flex bg-white border border-gray-200 rounded-xl p-1">
                <button
                  onClick={() => setShowGender("women")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${showGender === "women" ? "bg-text-main text-white shadow-sm" : "text-gray-500 hover:bg-gray-50"}`}
                >
                  Women
                </button>
                <button
                  onClick={() => setShowGender("men")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${showGender === "men" ? "bg-text-main text-white shadow-sm" : "text-gray-500 hover:bg-gray-50"}`}
                >
                  Men
                </button>
                <button
                  onClick={() => setShowGender("everyone")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${showGender === "everyone" ? "bg-text-main text-white shadow-sm" : "text-gray-500 hover:bg-gray-50"}`}
                >
                  Everyone
                </button>
              </div>
            </div>

            <div className="h-px bg-gray-200 w-full" />

            {/* Age Range */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <span className="text-sm font-bold text-text-main">
                  Age Range
                </span>
                <span className="text-sm font-bold text-text-main">
                  {ageRange[0]} - {ageRange[1]}
                </span>
              </div>
              <input
                type="range"
                min="18"
                max="60"
                value={ageRange[1]}
                onChange={(e) => handleAgeChange(e, 1)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-coral"
              />
            </div>

            <div className="h-px bg-gray-200 w-full" />

            {/* Distance Slider */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-text-main">
                  Distance
                </span>
                <span className="text-sm font-bold text-text-main">
                  {distance}km
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="160"
                value={distance}
                onChange={(e) => setDistance(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-coral mb-4"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Expand if I run out
                </span>
                <Toggle value={expandDistance} onChange={setExpandDistance} />
              </div>
            </div>
          </div>
        </section>

        {/* Account */}
        <section>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Account
          </h2>
          <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
            {/* App Icon Selector */}
            {onOpenIcons && (
              <div
                onClick={onOpenIcons}
                className="flex items-center p-4 border-b border-gray-100 hover:bg-white cursor-pointer transition-colors"
              >
                <Icons.Palette size={18} className="text-gray-500 mr-3" />
                <span className="text-sm font-medium text-text-main flex-1">
                  App Icon
                </span>
                <Icons.ChevronRight size={16} className="text-gray-400" />
              </div>
            )}

            <div className="flex items-center p-4 border-b border-gray-100 hover:bg-white cursor-pointer transition-colors">
              <Icons.Bell size={18} className="text-gray-500 mr-3" />
              <span className="text-sm font-medium text-text-main flex-1">
                Notifications
              </span>
              <Icons.ChevronRight size={16} className="text-gray-400" />
            </div>

            <div className="flex items-center p-4 border-b border-gray-100 hover:bg-white cursor-pointer transition-colors">
              <Icons.ShieldCheck size={18} className="text-gray-500 mr-3" />
              <span className="text-sm font-medium text-text-main flex-1">
                Privacy & Security
              </span>
              <Icons.ChevronRight size={16} className="text-gray-400" />
            </div>

            <div className="flex items-center p-4 hover:bg-white cursor-pointer transition-colors">
              <Icons.MessageCircle size={18} className="text-gray-500 mr-3" />
              <span className="text-sm font-medium text-text-main flex-1">
                Help & Support
              </span>
              <Icons.ChevronRight size={16} className="text-gray-400" />
            </div>
          </div>
        </section>

        {/* Logout & Delete */}
        <div className="space-y-3 pt-4">
          <button className="w-full py-3 rounded-xl border border-gray-200 bg-white text-text-main font-medium text-sm hover:bg-gray-50 transition-colors">
            Log Out
          </button>
          <button className="w-full py-3 rounded-xl text-gray-400 font-medium text-xs hover:text-red-500 transition-colors">
            Delete account
          </button>
        </div>

        {/* Version */}
        <p className="text-center text-gray-400 text-xs pt-4">
          Aura Twin v2.4.0
        </p>
      </div>
    </div>
  );
};

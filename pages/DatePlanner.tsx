import React, { useState } from "react";
import { Icons } from "../components/Icons";

interface DatePlannerProps {
  onBack: () => void;
  matchName?: string;
}

interface DateCategory {
  id: string;
  name: string;
  icon: string;
}

interface DateSuggestion {
  id: number;
  title: string;
  category: string;
  compatibility: number;
  price: string;
  duration: string;
  location: string;
  description: string;
  features: string[];
  estimatedCost: string;
  whyMatched: string;
}

export const DatePlanner: React.FC<DatePlannerProps> = ({ onBack, matchName = "your match" }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [savedDates, setSavedDates] = useState<number[]>([]);

  const categories: DateCategory[] = [
    { id: "all", name: "All", icon: "🎯" },
    { id: "food", name: "Food & Dining", icon: "🍽️" },
    { id: "activities", name: "Activities", icon: "🎨" },
    { id: "outdoor", name: "Outdoor", icon: "🌳" },
    { id: "entertainment", name: "Entertainment", icon: "🎭" },
    { id: "cultural", name: "Cultural", icon: "🏛️" },
  ];

  const dateSuggestions: DateSuggestion[] = [
    {
      id: 1,
      title: "Sunset Picnic at the Park",
      category: "outdoor",
      compatibility: 95,
      price: "$$",
      duration: "2-3 hours",
      location: "Central Park",
      description: "Based on both your love for nature and photography. Perfect golden hour lighting!",
      features: ["Pet-friendly", "Photo opportunity", "Romantic"],
      estimatedCost: "$30-50",
      whyMatched: "Matches your shared interests: Photography, Nature, Outdoor activities",
    },
    {
      id: 2,
      title: "Cooking Class: Italian Cuisine",
      category: "food",
      compatibility: 88,
      price: "$$$",
      duration: "3 hours",
      location: "Local Culinary Center",
      description: "You both mentioned loving Italian food. Learn to make pasta from scratch together!",
      features: ["Interactive", "Learn together", "Take-home recipes"],
      estimatedCost: "$120-150 for two",
      whyMatched: "Matches your shared interests: Italian food, Cooking, Trying new things",
    },
    {
      id: 3,
      title: "Jazz Night at Local Club",
      category: "entertainment",
      compatibility: 82,
      price: "$$",
      duration: "2 hours",
      location: "Downtown Jazz Club",
      description: "Both mentioned enjoying live music. Intimate setting with world-class jazz.",
      features: ["Live music", "Dinner available", "Intimate atmosphere"],
      estimatedCost: "$60-80",
      whyMatched: "Matches your shared interests: Live music, Jazz, Evening dates",
    },
    {
      id: 4,
      title: "Museum & Coffee",
      category: "cultural",
      compatibility: 90,
      price: "$",
      duration: "2-4 hours",
      location: "Art Museum + nearby café",
      description: "You both love art and meaningful conversations. Explore modern art, then discuss over coffee.",
      features: ["Indoor", "Conversation starter", "Flexible timing"],
      estimatedCost: "$40-60",
      whyMatched: "Matches your shared interests: Art, Museums, Coffee, Deep conversations",
    },
    {
      id: 5,
      title: "Pottery Workshop",
      category: "activities",
      compatibility: 85,
      price: "$$",
      duration: "2 hours",
      location: "Creative Arts Studio",
      description: "Get creative together! Make matching mugs or a special keepsake.",
      features: ["Hands-on", "Creative", "Take home your creation"],
      estimatedCost: "$50-75",
      whyMatched: "Matches your shared interests: Art, Crafts, Trying new things",
    },
  ];

  const filteredSuggestions = dateSuggestions.filter(
    (date) =>
      (selectedCategory === "all" || date.category === selectedCategory) &&
      (locationFilter === "" || date.location.toLowerCase().includes(locationFilter.toLowerCase()))
  );

  const toggleSave = (id: number) => {
    setSavedDates((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto px-4 py-6 pb-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white border border-warm-gray flex items-center justify-center"
          >
            <Icons.ChevronLeft className="w-5 h-5 text-text-main" />
          </button>
          <h1 className="text-2xl font-bold text-text-main">AI Date Planner</h1>
        </div>

        {/* Subtitle */}
        <p className="text-text-sec text-center mb-6">
          Personalized suggestions based on your shared interests with {matchName}
        </p>

        {/* Compatibility Score */}
        <div className="bg-primary/10 rounded-2xl p-5 mb-6 text-center">
          <p className="text-sm font-semibold text-text-sec mb-1">Overall Compatibility</p>
          <p className="text-4xl font-bold text-primary mb-1">89%</p>
          <p className="text-sm text-text-sec">
            You have 12 shared interests including: Music, Travel, Food, Art
          </p>
        </div>

        {/* Location Filter */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Filter by location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full px-4 py-3 bg-white rounded-xl border border-warm-gray text-text-main placeholder-text-sec focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-1 px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-colors ${
                selectedCategory === category.id
                  ? "bg-primary text-white"
                  : "bg-white border border-warm-gray text-text-sec"
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Date Suggestions */}
        <div className="mb-6">
          <h2 className="font-bold text-text-main text-lg mb-4">
            {filteredSuggestions.length} Perfect Dates for You
          </h2>

          <div className="space-y-4">
            {filteredSuggestions.map((date) => (
              <div
                key={date.id}
                className="bg-white rounded-2xl p-5 border border-warm-gray relative"
              >
                {/* Compatibility Badge */}
                <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-2 py-1 rounded-lg">
                  {date.compatibility}% Match
                </div>

                <h3 className="font-bold text-text-main text-lg mb-2 pr-20">{date.title}</h3>
                <p className="text-sm text-text-sec mb-4">{date.description}</p>

                {/* Date Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span>📍</span>
                    <span className="text-text-main">{date.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span>⏱️</span>
                    <span className="text-text-main">{date.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span>💰</span>
                    <span className="text-text-main">{date.estimatedCost}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {date.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-cream rounded-lg text-xs font-semibold text-text-sec"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Why Matched */}
                <div className="bg-primary/5 rounded-xl p-3 mb-4">
                  <p className="text-xs font-bold text-primary mb-1">Why this is perfect:</p>
                  <p className="text-sm text-text-main">{date.whyMatched}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleSave(date.id)}
                    className={`flex-1 py-3 rounded-xl font-semibold text-sm border-2 ${
                      savedDates.includes(date.id)
                        ? "bg-primary/10 border-primary text-primary"
                        : "border-warm-gray text-text-sec"
                    }`}
                  >
                    {savedDates.includes(date.id) ? "Saved" : "Save"}
                  </button>
                  <button className="flex-[2] py-3 bg-primary text-white font-semibold rounded-xl text-sm">
                    Book Now
                  </button>
                  <button className="flex-1 py-3 border-2 border-warm-gray text-text-sec font-semibold rounded-xl text-sm">
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Date Request */}
        <div className="bg-white rounded-2xl p-6 text-center border border-warm-gray">
          <h3 className="font-bold text-text-main text-lg mb-2">Can't find the perfect date?</h3>
          <p className="text-sm text-text-sec mb-4">
            Tell our AI what you're looking for and we'll create custom suggestions!
          </p>
          <button className="px-6 py-3 bg-primary text-white font-bold rounded-xl">
            Request Custom Date Ideas
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatePlanner;

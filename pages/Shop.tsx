import React, { useState } from "react";
import { Icons } from "../components/Icons";

interface ShopProps {
  onBack: () => void;
  onViewPlans: () => void;
}

interface ShopCategory {
  id: string;
  name: string;
}

interface ShopItem {
  id: number;
  category: string;
  name: string;
  icon: string;
  price: number;
  originalPrice?: number;
  description: string;
  popular?: boolean;
}

export const Shop: React.FC<ShopProps> = ({ onBack, onViewPlans }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [purchasedItems, setPurchasedItems] = useState<number[]>([]);

  const categories: ShopCategory[] = [
    { id: "all", name: "All Items" },
    { id: "boosters", name: "Boosters" },
    { id: "gifts", name: "Virtual Gifts" },
    { id: "features", name: "Premium Features" },
    { id: "packs", name: "Value Packs" },
  ];

  const shopItems: ShopItem[] = [
    {
      id: 1,
      category: "boosters",
      name: "Aura Boost",
      icon: "⚡",
      price: 4.99,
      description: "Get 3x more matches for 24 hours",
      popular: true,
    },
    {
      id: 2,
      category: "boosters",
      name: "Super Boost",
      icon: "🚀",
      price: 9.99,
      description: "48-hour boost + featured profile",
    },
    {
      id: 3,
      category: "gifts",
      name: "Digital Rose",
      icon: "🌹",
      price: 1.99,
      description: "Send a rose to someone special",
    },
    {
      id: 4,
      category: "gifts",
      name: "Coffee Date",
      icon: "☕",
      price: 2.99,
      description: "Virtual coffee invitation",
    },
    {
      id: 5,
      category: "gifts",
      name: "Champagne Toast",
      icon: "🍾",
      price: 4.99,
      description: "Celebrate a special moment",
    },
    {
      id: 6,
      category: "features",
      name: "See Who Liked You",
      icon: "👀",
      price: 3.99,
      description: "Unlock for 7 days",
      popular: true,
    },
    {
      id: 7,
      category: "features",
      name: "Rewind Pack",
      icon: "⏮️",
      price: 4.99,
      description: "Undo up to 10 swipes",
    },
    {
      id: 8,
      category: "features",
      name: "Premium Games",
      icon: "🎮",
      price: 2.99,
      description: "Unlock all in-chat games",
    },
    {
      id: 9,
      category: "features",
      name: "Read Receipts",
      icon: "✓✓",
      price: 1.99,
      description: "See when messages are read",
    },
    {
      id: 10,
      category: "packs",
      name: "Starter Pack",
      icon: "📦",
      price: 14.99,
      originalPrice: 20.97,
      description: "1 Boost + 5 Super Likes + 1 Rewind",
      popular: true,
    },
    {
      id: 11,
      category: "packs",
      name: "Date Night Bundle",
      icon: "💝",
      price: 24.99,
      originalPrice: 35.96,
      description: "Super Boost + 5 Roses + Premium Games",
    },
  ];

  const filteredItems =
    selectedCategory === "all"
      ? shopItems
      : shopItems.filter((item) => item.category === selectedCategory);

  const handlePurchase = (id: number) => {
    setPurchasedItems((prev) => [...prev, id]);
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
          <h1 className="text-2xl font-bold text-text-main">Aura Shop</h1>
        </div>

        {/* Subtitle */}
        <p className="text-text-sec text-center mb-6">
          Enhance your dating experience
        </p>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-colors ${
                selectedCategory === category.id
                  ? "bg-primary text-white"
                  : "bg-white border border-warm-gray text-text-sec"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Shop Items Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-4 border border-warm-gray relative"
            >
              {/* Popular Badge */}
              {item.popular && (
                <div className="absolute top-2 right-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  POPULAR
                </div>
              )}

              {/* Icon */}
              <div className="text-4xl text-center mb-3">{item.icon}</div>

              {/* Name */}
              <h3 className="font-bold text-text-main text-center text-sm mb-1">
                {item.name}
              </h3>

              {/* Description */}
              <p className="text-xs text-text-sec text-center mb-3 line-clamp-2">
                {item.description}
              </p>

              {/* Price */}
              <div className="flex justify-center items-center gap-2 mb-3">
                {item.originalPrice && (
                  <span className="text-xs text-text-sec line-through">
                    ${item.originalPrice}
                  </span>
                )}
                <span className="text-lg font-bold text-primary">${item.price}</span>
              </div>

              {/* Buy Button */}
              <button
                onClick={() => handlePurchase(item.id)}
                disabled={purchasedItems.includes(item.id)}
                className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                  purchasedItems.includes(item.id)
                    ? "bg-green-100 text-green-600"
                    : "bg-primary text-white"
                }`}
              >
                {purchasedItems.includes(item.id) ? "Purchased" : "Buy Now"}
              </button>
            </div>
          ))}
        </div>

        {/* Subscription Upsell */}
        <div className="bg-primary/10 rounded-2xl p-6 text-center">
          <span className="text-4xl mb-3 block">👑</span>
          <h3 className="font-bold text-text-main text-lg mb-2">Get More with Premium</h3>
          <p className="text-sm text-text-sec mb-4">
            Subscribe to Aura Plus and get unlimited boosts, see who liked you, and more!
          </p>
          <button
            onClick={onViewPlans}
            className="px-8 py-3 bg-primary text-white font-bold rounded-xl"
          >
            View Plans
          </button>
        </div>
      </div>
    </div>
  );
};

export default Shop;

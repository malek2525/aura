import React from "react";
import { Icons } from "./Icons";
import { ViewState } from "../types";

interface NavigationProps {
  currentView: ViewState;
  onChange: (view: ViewState) => void;
  unreadChats?: number;
  newLikes?: number;
  newMoments?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onChange,
  unreadChats = 0,
  newLikes = 0,
  newMoments = 0,
}) => {
  const navItems: {
    id: ViewState;
    icon: any;
    label: string;
    badge?: number;
  }[] = [
    { id: "aura", icon: Icons.User, label: "Me" },
    { id: "discover", icon: Icons.Compass, label: "Discover" },
    {
      id: "likes",
      icon: Icons.Heart,
      label: "Likes",
      badge: newLikes > 0 ? newLikes : undefined,
    },
    {
      id: "chat",
      icon: Icons.MessageCircle,
      label: "Chats",
      badge: unreadChats > 0 ? unreadChats : undefined,
    },
    {
      id: "moments",
      icon: Icons.Camera,
      label: "Moments",
      badge: newMoments > 0 ? newMoments : undefined,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto px-4 py-2 pb-6">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className="flex flex-col items-center justify-center py-1 px-3 outline-none"
            >
              <div className="relative">
                <Icon
                  size={24}
                  className={`transition-colors ${
                    isActive ? "text-coral" : "text-gray-400"
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                  fill={
                    isActive && item.id === "likes" ? "currentColor" : "none"
                  }
                />

                {/* Small badge - only shows if badge > 0 */}
                {item.badge && item.badge > 0 && (
                  <div className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-coral rounded-full flex items-center justify-center">
                    <span className="text-[9px] font-bold text-white">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  </div>
                )}
              </div>

              <span
                className={`text-[10px] mt-1 ${
                  isActive ? "text-coral font-semibold" : "text-gray-400"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

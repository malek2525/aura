import React from "react";

type ChipTone = "primary" | "intent" | "soft" | "danger" | "secondary";

interface ProfileChipsProps {
  items: string[];
  tone?: ChipTone;
  max?: number;
}

export const ProfileChips: React.FC<ProfileChipsProps> = ({
  items,
  tone = "primary",
  max,
}) => {
  if (!items || items.length === 0) return null;

  const visibleItems = typeof max === "number" ? items.slice(0, max) : items;
  const hasMore = typeof max === "number" && items.length > max;

  const baseChip =
    "inline-flex items-center gap-1 rounded-full border text-[10px] font-bold px-2.5 py-1.5 " +
    "whitespace-nowrap transition-colors";

  const toneClasses = (() => {
    switch (tone) {
      case "intent":
        return "border-pink-200 text-pink-600 bg-pink-50";
      case "danger":
        return "border-red-200 text-red-600 bg-red-50";
      case "soft":
        return "border-warm-gray text-text-sec bg-warm-white";
      case "secondary":
        return "border-sage-light text-sage-dark bg-sage-light/30";
      case "primary":
      default:
        return "border-coral/20 text-coral bg-coral-light/40";
    }
  })();

  return (
    <div className="flex flex-wrap gap-1.5 mt-0.5">
      {visibleItems.map((item, idx) => (
        <span key={`${item}-${idx}`} className={`${baseChip} ${toneClasses}`}>
          <span className="truncate max-w-[130px]">{item}</span>
        </span>
      ))}

      {hasMore && (
        <span className={`${baseChip} border-warm-gray text-text-muted bg-white`}>
          +{items.length - (max ?? 0)}
        </span>
      )}
    </div>
  );
};

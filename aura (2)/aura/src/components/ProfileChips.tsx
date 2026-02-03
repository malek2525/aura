// src/components/ProfileChips.tsx
import React from "react";

type ChipTone = "primary" | "intent" | "soft" | "danger";

interface ProfileChipsProps {
  items: string[];
  tone?: ChipTone;
  max?: number; // optional: limit number of chips shown
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
    "inline-flex items-center gap-1 rounded-full border text-[10px] font-medium px-2.5 py-1 " +
    "backdrop-blur-md whitespace-nowrap";

  const toneClasses = (() => {
    switch (tone) {
      case "intent":
        return (
          "border-pink-400/40 text-pink-50 " +
          "bg-gradient-to-r from-pink-500/15 via-violet-500/10 to-sky-500/15 " +
          "shadow-[0_0_18px_rgba(244,114,182,0.45)]"
        );
      case "danger":
        return (
          "border-rose-400/50 text-rose-50 " +
          "bg-gradient-to-r from-rose-500/15 via-orange-500/10 to-amber-500/10 " +
          "shadow-[0_0_16px_rgba(248,113,113,0.5)]"
        );
      case "soft":
        return (
          "border-white/15 text-slate-100 " +
          "bg-slate-900/50 shadow-[0_0_14px_rgba(15,23,42,0.7)]"
        );
      case "primary":
      default:
        return (
          "border-violet-400/50 text-slate-50 " +
          "bg-gradient-to-r from-violet-500/15 via-indigo-500/10 to-sky-500/15 " +
          "shadow-[0_0_18px_rgba(129,140,248,0.7)]"
        );
    }
  })();

  const containerClasses = "flex flex-wrap gap-1.5 mt-0.5 -mb-0.5 max-w-full";

  return (
    <div className={containerClasses}>
      {visibleItems.map((item, idx) => (
        <span key={`${item}-${idx}`} className={baseChip + " " + toneClasses}>
          <span className="truncate max-w-[130px]">{item}</span>
        </span>
      ))}

      {hasMore && (
        <span
          className={
            baseChip +
            " " +
            "border-white/15 text-slate-200 bg-slate-900/60 shadow-[0_0_12px_rgba(15,23,42,0.8)]"
          }
        >
          +{items.length - (max ?? 0)}
        </span>
      )}
    </div>
  );
};

export default ProfileChips;

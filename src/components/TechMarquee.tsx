"use client";

import { getTechIcon } from "@/lib/techStackIcons";

interface TechMarqueeProps {
  skills: string[];
}

export default function TechMarquee({ skills }: TechMarqueeProps) {
  if (!skills || skills.length === 0) return null;

  // Filter out any duplicates and map to their icon paths
  const uniqueSkills = Array.from(new Set(skills)).map((skill) => ({
    name: skill,
    icon: getTechIcon(skill),
  }));

  // Duplicate the items array to ensure a seamless infinite scrolling loop
  const marqueeItems = [...uniqueSkills, ...uniqueSkills, ...uniqueSkills];

  return (
    <div className="relative w-full overflow-hidden py-3 border-y border-neutral-100 dark:border-neutral-900 bg-neutral-50/20 dark:bg-neutral-950/20 rounded-2xl">
      {/* Premium left & right gradient fade overlays */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-black dark:via-black/80 z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-black dark:via-black/80 z-10 pointer-events-none" />

      {/* Infinite Scrolling Track */}
      <div className="flex w-max animate-marquee gap-8 items-center">
        {marqueeItems.map((item, idx) => (
          <div
            key={`${item.name}-${idx}`}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700 transition-all hover:scale-105 duration-200 cursor-default"
          >
            {item.icon && (
              <img
                src={item.icon}
                alt={item.name}
                className="w-5 h-5 object-contain"
                onError={(e) => {
                  // Fallback in case image fails to load
                  (e.target as HTMLImageElement).src = "/tech-stack/Devicon.png";
                }}
              />
            )}
            <span className="text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

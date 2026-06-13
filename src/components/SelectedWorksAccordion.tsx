"use client";

import { useState } from "react";

type WorkItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  tech?: string[];
  url?: string;
  image?: string;
  year: string;
  order?: number;
};

interface SelectedWorksAccordionProps {
  works: WorkItem[];
}

export default function SelectedWorksAccordion({ works }: SelectedWorksAccordionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-5">
      {works.map((work) => {
        const isExpanded = expandedId === work.id;

        return (
          <div
            key={work.id ?? work.title}
            className="border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl bg-neutral-50/20 dark:bg-neutral-900/10 overflow-hidden transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-700"
          >
            {/* Header / Trigger Row */}
            <div
              onClick={() => toggleExpand(work.id)}
              className="w-full flex flex-row gap-4 sm:gap-5 items-center p-4 sm:p-5 text-left cursor-pointer hover:bg-neutral-100/30 dark:hover:bg-neutral-900/30 transition-colors select-none"
            >
              {/* Thumbnail Image */}
              {work.image && (
                <div className="w-20 sm:w-28 aspect-[16/10] rounded-xl overflow-hidden shrink-0 border border-neutral-200/50 dark:border-neutral-800/50 bg-neutral-50 dark:bg-neutral-900/50 shadow-sm relative">
                  <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Title & Metadata Block */}
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm sm:text-base tracking-tight">
                      {work.title}
                    </span>
                    <span className="text-xs text-neutral-450 dark:text-neutral-555 font-mono">
                      ({work.category})
                    </span>
                    {work.url && (
                      <a
                        href={work.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()} // Prevent toggling when clicking the link
                        className="text-xs text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300 font-mono transition-colors inline-flex items-center gap-0.5 ml-1 hover:underline"
                      >
                        • visit ↗
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs sm:text-sm font-mono text-neutral-400 dark:text-neutral-500 tabular-nums">
                      {work.year}
                    </span>
                    {/* Accordion Toggle Chevron */}
                    <div className="p-1 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-all shrink-0">
                      <svg
                        className={`w-3.5 h-3.5 transform transition-transform duration-300 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Collapsible Details Panel */}
            <div
              className={`transition-all duration-300 ease-in-out ${
                isExpanded ? "max-h-[500px] border-t border-neutral-200/40 dark:border-neutral-800/40" : "max-h-0"
              } overflow-hidden`}
            >
              <div className="p-4 sm:p-5 space-y-3 bg-white/50 dark:bg-neutral-950/20 ml-[96px] sm:ml-[132px]">
                <p className="text-sm text-neutral-650 dark:text-neutral-350 leading-relaxed font-light">
                  {work.description}
                </p>
                {Array.isArray(work.tech) && work.tech.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {work.tech.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-150/50 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 border border-neutral-200/20 dark:border-neutral-800/20"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

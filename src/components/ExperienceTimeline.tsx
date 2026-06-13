"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ExperienceItem {
    title: string;
    project: string;
    type: string;
    period: string;
    description: string[];
    url?: string;
}

interface ExperienceTimelineProps {
    experiences: ExperienceItem[];
}

export default function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const toggleRow = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <div className="w-full border-t border-neutral-200 dark:border-neutral-800">
            {experiences.map((exp, idx) => {
                const isExpanded = expandedIndex === idx;

                return (
                    <div
                        key={idx}
                        className="border-b border-neutral-200 dark:border-neutral-800"
                    >
                        {/* Header Row */}
                        <button
                            onClick={() => toggleRow(idx)}
                            className="w-full py-5 flex items-center justify-between text-left cursor-pointer hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-colors px-2 rounded-lg"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-8 flex-1">
                                {/* Period */}
                                <span className="text-sm font-mono text-neutral-400 dark:text-neutral-500 min-w-[120px] tabular-nums">
                                    {exp.period}
                                </span>
                                {/* Title and Project */}
                                <div className="flex flex-wrap items-baseline gap-2">
                                    <span className="font-medium text-neutral-900 dark:text-neutral-100">
                                        {exp.title}
                                    </span>
                                    <span className="text-neutral-400 dark:text-neutral-600 font-normal">
                                        at
                                    </span>
                                    <span className="font-serif italic text-neutral-700 dark:text-neutral-300">
                                        {exp.project}
                                    </span>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 font-mono">
                                        {exp.type}
                                    </span>
                                </div>
                            </div>

                            {/* Arrow icon */}
                            <motion.span
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="text-neutral-400 dark:text-neutral-600 ml-4 flex-shrink-0"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </motion.span>
                        </button>

                        {/* Expandable Details */}
                        <AnimatePresence initial={false}>
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <div className="pb-6 pt-2 pl-2 pr-4 sm:pl-[152px]">
                                        <ul className="space-y-2 text-neutral-600 dark:text-neutral-400 text-sm list-disc pl-4 marker:text-neutral-300 dark:marker:text-neutral-750">
                                            {exp.description.map((desc, dIdx) => (
                                                <li key={dIdx} className="leading-relaxed">
                                                    {desc}
                                                </li>
                                            ))}
                                        </ul>
                                        {exp.url && (
                                            <div className="mt-4">
                                                <a
                                                    href={exp.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs text-neutral-900 dark:text-neutral-100 hover:underline underline-offset-4 font-mono font-medium"
                                                >
                                                    Visit {exp.project}
                                                    <svg
                                                        className="w-3.5 h-3.5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                        />
                                                    </svg>
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}

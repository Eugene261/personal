"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDate } from "@/app/blog/formatDate";

type Post = {
  slug: string;
  metadata: {
    title: string;
    publishedAt: string;
    summary: string;
    image?: string;
  };
  content: string;
};

interface BlogPostAccordionProps {
  posts: Post[];
}

export default function BlogPostAccordion({ posts }: BlogPostAccordionProps) {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const toggleExpand = (slug: string) => {
    setExpandedSlug(expandedSlug === slug ? null : slug);
  };

  // Helper to extract a text-only preview of the post
  const getPreviewText = (content: string) => {
    if (!content) return "";
    return content
      .replace(/---[\s\S]*?---/g, "") // remove frontmatter
      .replace(/```[\s\S]*?```/g, "") // remove code blocks
      .replace(/<[^>]*>/g, "") // remove HTML markup if any
      .replace(/[#*`_\[\]()]/g, "") // remove MD symbols
      .trim()
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .slice(0, 3) // take first 3 paragraphs
      .join("\n\n");
  };

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const isExpanded = expandedSlug === post.slug;
        const preview = getPreviewText(post.content);

        return (
          <div
            key={post.slug}
            className="border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl bg-neutral-50/20 dark:bg-neutral-900/10 overflow-hidden transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-700"
          >
            {/* Accordion Trigger Panel */}
            <button
              onClick={() => toggleExpand(post.slug)}
              className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-neutral-100/30 dark:hover:bg-neutral-900/30 focus:outline-none"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 flex-1">
                <span className="text-neutral-500 dark:text-neutral-400 text-xs font-mono w-[110px] shrink-0">
                  {formatDate(post.metadata.publishedAt, false)}
                </span>
                <span className="text-neutral-900 dark:text-neutral-100 font-medium tracking-tight text-base sm:text-lg hover:underline underline-offset-4 decoration-neutral-300 dark:decoration-neutral-700">
                  {post.metadata.title}
                </span>
              </div>
              
              {/* Accordion Toggle Icon */}
              <div className="ml-4 p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-all">
                <svg
                  className={`w-4 h-4 transform transition-transform duration-300 ${
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
            </button>

            {/* Accordion Content Panel */}
            <div
              className={`transition-all duration-300 ease-in-out ${
                isExpanded ? "max-h-[1000px] border-t border-neutral-200/40 dark:border-neutral-800/40" : "max-h-0"
              } overflow-hidden`}
            >
              <div className="p-5 space-y-4 bg-white/50 dark:bg-neutral-950/20">
                {post.metadata.summary && (
                  <p className="font-medium text-neutral-800 dark:text-neutral-200 text-sm leading-relaxed border-l-2 border-emerald-500 pl-3">
                    {post.metadata.summary}
                  </p>
                )}
                
                {preview && (
                  <div className="text-neutral-650 dark:text-neutral-400 text-sm leading-relaxed whitespace-pre-line font-light">
                    {preview}
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border border-neutral-200 dark:border-neutral-800 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-850 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-all shadow-sm active:scale-95"
                  >
                    <span>Read full article ↗</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface QuoteModalProps {
    linkText?: string;
    quoteText?: string;
}

export default function QuoteModal({
    linkText = "steer even in the storm",
    quoteText = "Those who achieve great things, those who lead, create and inspire do not depend on calm seas  they learn to steer even in the storm. When they face loss or rejection they do not crumble, they adjust their sails. When they encounter betrayal or disappointment, they do not lash out  they learn, grow, and they move forward with greater strength."
}: QuoteModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    // Track mounted state to avoid SSR / hydration issues with portals
    useEffect(() => {
        setMounted(true);
    }, []);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden"; // Prevent body scroll
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="font-serif italic underline decoration-neutral-300 dark:decoration-neutral-700 underline-offset-4 hover:decoration-neutral-900 dark:hover:decoration-neutral-100 cursor-pointer transition-colors duration-200 text-neutral-900 dark:text-neutral-100"
            >
                {linkText}
            </button>

            {mounted && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsOpen(false)}
                                className="absolute inset-0 bg-neutral-950/40 dark:bg-neutral-950/60 backdrop-blur-md"
                            />

                            {/* Modal Container */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
                                ref={modalRef}
                                className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 p-8 md:p-12 shadow-2xl border border-neutral-150 dark:border-neutral-800"
                            >
                                {/* Close button */}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="absolute top-6 right-6 p-2 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                                    aria-label="Close modal"
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
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>

                                {/* Quote Content */}
                                <div className="flex flex-col gap-6 mt-4">
                                    <p className="text-lg md:text-xl text-neutral-800 dark:text-neutral-100 leading-relaxed font-normal tracking-wide">
                                        {quoteText}
                                    </p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="w-6 h-[1px] bg-neutral-200 dark:bg-neutral-800" />
                                        <span className="text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-mono">
                                            School of hard knocks
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}


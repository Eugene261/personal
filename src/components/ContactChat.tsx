"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
    id: string;
    sender: "visitor" | "eugene";
    type: "text" | "email" | "form" | "socials";
    text?: string;
};

const TypingIndicator = () => (
    <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-900 px-4 py-3 rounded-2xl w-fit shadow-sm">
        <span className="w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
);

export default function ContactChat() {
    const emailAddress = "eugeneopoku74@gmail.com";
    const [renderedMessages, setRenderedMessages] = useState<Message[]>([]);
    const [typingSender, setTypingSender] = useState<"visitor" | "eugene" | null>(null);
    const [copied, setCopied] = useState(false);
    
    // Form states
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const chatEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [timelineStarted, setTimelineStarted] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Wait for client mount to avoid hydration mismatches with framer-motion
    useEffect(() => {
        setMounted(true);
    }, []);

    // Auto-scroll to bottom only after the form is submitted
    useEffect(() => {
        if (formSubmitted) {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [renderedMessages, typingSender, formSubmitted]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(emailAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Staggered chat timeline helper
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const addMessage = (msg: Message) => {
        setRenderedMessages((prev) => {
            if (prev.some((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
        });
    };

    // Trigger timeline only when scrolled into view
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimelineStarted(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!timelineStarted) return;
        let active = true;

        async function runTimeline() {
            const wait = async (ms: number) => {
                await new Promise((resolve) => setTimeout(resolve, ms));
            };

            // Step 1: Visitor starts typing
            if (!active) return;
            setTypingSender("visitor");
            await wait(1200);
            
            // Visitor first message
            if (!active) return;
            addMessage({ id: "v1", sender: "visitor", type: "text", text: "you're def cracked or smth" });
            setTypingSender(null);
            await wait(500);

            // Visitor second message
            if (!active) return;
            setTypingSender("visitor");
            await wait(1400);
            if (!active) return;
            addMessage({ id: "v2", sender: "visitor", type: "text", text: "how do i actually reach you?" });
            setTypingSender(null);
            await wait(1000);

            // Step 2: Eugene responds
            if (!active) return;
            setTypingSender("eugene");
            await wait(1500);
            if (!active) return;
            addMessage({ id: "e1", sender: "eugene", type: "text", text: "haha appreciate it" });
            setTypingSender(null);
            await wait(500);

            // Eugene second message
            if (!active) return;
            setTypingSender("eugene");
            await wait(1800);
            if (!active) return;
            addMessage({ id: "e2", sender: "eugene", type: "text", text: "fastest way is to email me. keep it short, don't write me an essay." });
            setTypingSender(null);
            await wait(600);

            // Eugene email bubble
            if (!active) return;
            setTypingSender("eugene");
            await wait(1200);
            if (!active) return;
            addMessage({ id: "e3", sender: "eugene", type: "email" });
            setTypingSender(null);
            await wait(1200);

            // Step 3: Visitor replies
            if (!active) return;
            setTypingSender("visitor");
            await wait(1400);
            if (!active) return;
            addMessage({ id: "v3", sender: "visitor", type: "text", text: "hmm too lazy to email tho" });
            setTypingSender(null);
            await wait(1000);

            // Step 4: Eugene offers the contact form
            if (!active) return;
            setTypingSender("eugene");
            await wait(1600);
            if (!active) return;
            addMessage({ id: "e4", sender: "eugene", type: "text", text: "fair. just use the form below, lands in the same inbox, less work for you." });
            setTypingSender(null);
            await wait(400);

            // Render form
            if (!active) return;
            addMessage({ id: "e5", sender: "eugene", type: "form" });
        }

        runTimeline();

        return () => {
            active = false;
        };
    }, [timelineStarted]);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !message) return;

        setSubmitting(true);
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message }),
            });

            if (response.ok) {
                setFormSubmitted(true);
                // Trigger post-submit conversation flow
                runPostSubmitFlow();
            } else {
                alert("Failed to send message. Please try again.");
            }
        } catch (error) {
            console.error(error);
            alert("Error sending message.");
        } finally {
            setSubmitting(false);
        }
    };

    const runPostSubmitFlow = async () => {
        await delay(800);
        
        // Visitor says thanks
        addMessage({ id: "v4", sender: "visitor", type: "text", text: "awesome thanks" });
        await delay(500);

        // Visitor asks where else online
        setTypingSender("visitor");
        await delay(1500);
        addMessage({ id: "v5", sender: "visitor", type: "text", text: "also where else are you online?" });
        setTypingSender(null);
        await delay(1000);

        // Eugene answers
        setTypingSender("eugene");
        await delay(1800);
        addMessage({ id: "e6", sender: "eugene", type: "text", text: "i mostly hang on X and LinkedIn. if you're building something fun, we can even hop on a quick call." });
        setTypingSender(null);
        await delay(500);

        // Show socials buttons
        addMessage({ id: "e7", sender: "eugene", type: "socials" });
        await delay(1000);

        // Visitor says they'll connect
        setTypingSender("visitor");
        await delay(1400);
        addMessage({ id: "v6", sender: "visitor", type: "text", text: "nice. i'll connect." });
        setTypingSender(null);
        await delay(1000);

        // Eugene wrap up
        setTypingSender("eugene");
        await delay(1800);
        addMessage({ id: "e8", sender: "eugene", type: "text", text: "perfect. don't overthink it - just say hi. always down to chat, swap ideas, or hear what you're building." });
        setTypingSender(null);
        await delay(600);

        setTypingSender("eugene");
        await delay(1000);
        addMessage({ id: "e9", sender: "eugene", type: "text", text: "peace ;)" });
        setTypingSender(null);
    };

    return (
        <div ref={containerRef} className="flex flex-col gap-4 w-full max-w-lg mx-auto py-4">
            <div className="flex flex-col gap-3.5 overflow-y-auto pr-1">
                {mounted && (
                <AnimatePresence initial={false}>
                    {renderedMessages.map((msg) => {
                        const isEugene = msg.sender === "eugene";
                        
                        return (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ type: "spring", stiffness: 350, damping: 26 }}
                                className={`flex flex-col max-w-[85%] sm:max-w-[80%] ${isEugene ? "self-start" : "self-end"}`}
                            >
                                {/* TEXT MESSAGE */}
                                {msg.type === "text" && (
                                    <div className={`px-4 py-2.5 rounded-2xl shadow-sm text-[15px] leading-relaxed break-words ${
                                        isEugene 
                                            ? "bg-neutral-100 dark:bg-neutral-900 text-neutral-850 dark:text-neutral-150 rounded-tl-sm border border-neutral-200/40 dark:border-neutral-800/40" 
                                            : "bg-blue-600 text-white rounded-tr-sm"
                                    }`}>
                                        {msg.text}
                                    </div>
                                )}

                                {/* EMAIL COPY BUBBLE */}
                                {msg.type === "email" && (
                                    <div className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/40 dark:border-neutral-800/40 p-4 rounded-2xl rounded-tl-sm shadow-sm flex flex-col gap-3 w-64">
                                        <div className="font-mono text-sm text-neutral-850 dark:text-neutral-150 break-all select-all">
                                            {emailAddress}
                                        </div>
                                        <button
                                            onClick={copyToClipboard}
                                            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors"
                                        >
                                            {copied ? (
                                                <span className="text-emerald-500 font-bold">Copied!</span>
                                            ) : (
                                                <>
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0A2.25 2.25 0 0113.5 5.25h-3a2.25 2.25 0 01-2.166-1.638m7.332 0v.07a2.5 2.5 0 01-2.5 2.5h-3a2.5 2.5 0 01-2.5-2.5v-.07m12 1.892V18.75a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V5.25a2.25 2.25 0 012.25-2.25h1.372c.514 0 .997.225 1.328.617l.088.102c.312.36.764.576 1.248.576h1.954" />
                                                    </svg>
                                                    Copy Address
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}

                                {/* CONTACT FORM BUBBLE */}
                                {msg.type === "form" && (
                                    <div className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/40 dark:border-neutral-800/40 p-5 rounded-2xl rounded-tl-sm shadow-sm w-full max-w-sm">
                                        {formSubmitted ? (
                                            <div className="text-center py-4 flex flex-col items-center justify-center gap-2">
                                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center animate-bounce">
                                                    ✓
                                                </div>
                                                <p className="text-sm font-semibold text-neutral-850 dark:text-neutral-150">Message Sent!</p>
                                                <p className="text-xs text-neutral-500">I&apos;ll get back to you shortly.</p>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleFormSubmit} className="space-y-3">
                                                <div>
                                                    <input
                                                        type="text"
                                                        required
                                                        disabled={submitting}
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        placeholder="Your Name"
                                                        className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-lg px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-450 focus:outline-none focus:border-blue-500 transition-colors"
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="email"
                                                        required
                                                        disabled={submitting}
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        placeholder="Your Email"
                                                        className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-lg px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-450 focus:outline-none focus:border-blue-500 transition-colors"
                                                    />
                                                </div>
                                                <div>
                                                    <textarea
                                                        required
                                                        rows={3}
                                                        disabled={submitting}
                                                        value={message}
                                                        maxLength={300}
                                                        onChange={(e) => setMessage(e.target.value)}
                                                        placeholder="Enter your message (max 300 chars)"
                                                        className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-lg px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-450 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                                    />
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={submitting}
                                                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-2 rounded-lg text-sm transition-all shadow-sm flex items-center justify-center gap-1.5"
                                                >
                                                    {submitting ? (
                                                        <>
                                                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                            Sending...
                                                        </>
                                                    ) : (
                                                        "Submit"
                                                    )}
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                )}

                                {/* SOCIALS BUBBLE */}
                                {msg.type === "socials" && (
                                    <div className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/40 dark:border-neutral-800/40 p-4 rounded-2xl rounded-tl-sm shadow-sm flex flex-col gap-2 w-64">
                                        <a
                                            href="https://x.com/YGene_"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold bg-white dark:bg-neutral-950 text-neutral-850 dark:text-neutral-150 border border-neutral-250 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors shadow-sm"
                                        >
                                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                            </svg>
                                            DM me on X
                                        </a>
                                        <a
                                            href="https://www.linkedin.com/in/eugene-opoku-243601392"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold bg-white dark:bg-neutral-950 text-neutral-850 dark:text-neutral-150 border border-neutral-250 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors shadow-sm"
                                        >
                                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                            </svg>
                                            Connect on LinkedIn
                                        </a>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
                )}

                {/* Bouncing Typing Dots */}
                {mounted && typingSender && (
                    <div className={`flex flex-col w-fit ${typingSender === "eugene" ? "self-start" : "self-end"}`}>
                        <TypingIndicator />
                    </div>
                )}

                <div ref={chatEndRef} />
            </div>
        </div>
    );
}

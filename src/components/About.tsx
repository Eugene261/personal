"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function About({ data }: { data?: any }) {
    const highlights = data?.highlights || [
        { label: "Projects Shipped", value: "20+" },
        { label: "Technologies", value: "15+" },
        { label: "AI Integrations", value: "10+" },
    ];

    const body = data?.body || "Self-taught Full-Stack Engineer with a BSc in Education. I design, build, and ship complete products solo — leveraging AI to move at the speed of a team.";
    const bodySecondary = data?.bodySecondary || "From social commerce platforms to real-time mobile apps, I take ideas from zero to production with a deep focus on quality, performance, and user experience.";
    const quote = data?.quote || "The best code is invisible — it just makes things work beautifully.";
    const tagline = data?.tagline || "I BUILD THINGS THAT MATTER.";
    return (
        <section id="about" className="relative py-32 md:py-40 bg-white text-[#0c2320] overflow-hidden">
            {/* Giant ghost watermark */}
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[28vw] font-black text-black/[0.015] pointer-events-none uppercase select-none whitespace-nowrap leading-none">
                ABOUT
            </span>

            <div className="relative max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">

                    {/* Left Column — Typographic anchor */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <p className="text-black/25 text-xs font-bold tracking-[0.4em] uppercase mb-6">
                            ── About Me
                        </p>
                        <h2 className="text-[clamp(3rem,8vw,6rem)] font-extrabold tracking-tighter leading-[0.85] uppercase">
                            I BUILD<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-teal-500">
                                THINGS
                            </span><br />
                            THAT<br />MATTER.
                        </h2>

                        {/* Mini stat row */}
                        <div className="flex gap-10 mt-12 pt-10 border-t border-black/5">
                            {highlights.map((stat: any, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                >
                                    <span className="block text-3xl md:text-4xl font-black tracking-tighter">{stat.value}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 mt-1 block">{stat.label}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Column — Narrative snippet + CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        className="flex flex-col justify-between md:pt-8"
                    >
                        <div className="space-y-6">
                            <div>
                                <span className="text-xs font-bold text-emerald-800 tracking-[0.2em]">{tagline}</span>
                            </div>

                            <p className="text-2xl md:text-3xl text-[#0c2320] font-semibold leading-snug tracking-tight">
                                {body}
                            </p>

                            <p className="text-lg text-neutral-600 leading-relaxed font-medium">
                                {bodySecondary}
                            </p>
                            <p className="text-base text-[#0c2320]/40 italic leading-relaxed border-l-2 border-emerald-800/10 pl-6">
                                {quote}
                            </p>
                        </div>

                        <Link
                            href="/about"
                            className="inline-flex items-center gap-4 mt-12 px-8 py-4 rounded-full bg-[#0c2320] text-white font-bold uppercase tracking-[0.15em] text-xs hover:gap-6 hover:bg-emerald-900 transition-all duration-300 group w-fit"
                        >
                            View Full Resume
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="group-hover:translate-x-1 transition-transform duration-300">
                                <path d="M4.167 10H15.833" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M10.833 5L15.833 10L10.833 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

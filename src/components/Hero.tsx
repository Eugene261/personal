"use client";

import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export default function Hero({ data }: { data?: any }) {
    const headline: string = data?.headline || "Engineering software solutions that drive real impact.";
    const characters: string[] = Array.from(headline);
    const subtitle: string = data?.subtitle || "Self-taught Full-Stack Engineer building production-grade web and mobile applications, powered by AI-driven development.";

    const containerVars = {
        initial: { opacity: 1 },
        animate: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08, // Increased from 0.04 for slower typing
                delayChildren: 0.5,
            },
        },
    };

    const charVars = {
        initial: {
            opacity: 0,
            display: "none"
        },
        animate: {
            opacity: 1,
            display: "inline",
            transition: {
                duration: 0,
            },
        },
    };

    const cursorVars = {
        animate: {
            opacity: [0, 0, 1, 1],
            transition: {
                duration: 0.8,
                repeat: Infinity,
                times: [0, 0.5, 0.5, 1]
            }
        }
    };

    return (
        <section id="home" className="relative pt-32 pb-20 px-6 sm:px-12 md:px-16 min-h-[80vh] flex flex-col justify-center overflow-hidden bg-transparent">
            <div className="relative w-full">
                <div className="mb-8 flex flex-col gap-4 md:gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex items-end gap-2"
                    >
                        <span className="text-lg text-neutral-500 font-medium whitespace-nowrap mb-1">Hi, I&apos;m</span>
                        <span className="text-4xl md:text-5xl font-serif italic text-[#0c2320] font-normal leading-none" style={{ fontFamily: 'var(--font-instrument)' }}>
                            Eugene
                        </span>
                        <span className="text-lg text-neutral-500 font-medium mb-1">.</span>
                    </motion.div>

                    <motion.h1
                        variants={containerVars}
                        initial="initial"
                        animate="animate"
                        className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#0c2320] max-w-5xl"
                    >
                        {characters.map((char: string, i: number) => (
                            <motion.span
                                key={i}
                                variants={charVars}
                                className={char === " " ? "inline whitespace-pre" : "inline-block"}
                            >
                                {char}
                            </motion.span>
                        ))}
                        <motion.span
                            variants={cursorVars}
                            animate="animate"
                            className="inline-block w-[4px] h-[0.8em] bg-[#0c2320] ml-2 translate-y-[0.1em]"
                        />
                    </motion.h1>
                </div>

                <motion.p
                    id="about"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 5.5, ease: "easeOut" }}
                    className="text-lg md:text-xl text-neutral-600 max-w-2xl mb-12 leading-relaxed"
                >
                    {subtitle}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 5.7, ease: "easeOut" }}
                    className="flex flex-wrap gap-4"
                >
                    <a
                        href="#work"
                        className="group flex items-center gap-2 bg-neutral-900 text-white px-8 py-4 rounded-full font-medium hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        View Portfolio
                        <ArrowUpRightIcon className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                    <a
                        href="#contact"
                        className="flex items-center gap-2 bg-white border border-neutral-200 px-8 py-4 rounded-full font-medium hover:bg-neutral-50 transition-all hover:-translate-y-0.5"
                    >
                        Contact Me
                    </a>
                </motion.div>
            </div>
        </section>
    );
}

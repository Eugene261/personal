"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { getTechIcon } from "@/lib/techStackIcons";

export default function Projects({ data }: { data?: any[] }) {
    const displayProjects = data || [];
    const [isInView, setIsInView] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsInView(entry.isIntersecting),
            { threshold: 0.25 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const total = Math.min(displayProjects.length, 5);

    return (
        <section id="work" className="relative py-24 px-6 bg-white overflow-hidden">
            {/* Background Pattern */}
            <div
                className="absolute inset-0 pointer-events-none select-none opacity-[0.01]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='350' height='70' viewBox='0 0 350 70' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' font-family='sans-serif' font-weight='900' font-size='12' fill='%230c2320' style='text-transform: uppercase; letter-spacing: 0.15em;'%3EYOU CAN JUST BUILD THINGS%3C/text%3E%3C/svg%3E")`,
                    backgroundSize: '350px 70px'
                }}
            />

            <div className="relative max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-[-0.04em] text-[#0c2320]">
                        Works
                    </h2>
                    <p className="text-neutral-500 max-w-xl text-lg mt-4">
                        A selection of projects demonstrating expertise across web, mobile, and system design.
                    </p>
                </div>

                {/* Observed container */}
                <div ref={sectionRef}>
                    <AnimatePresence mode="wait">
                        {!isInView ? (
                            /* ── STACKED STATE ── */
                            <motion.div
                                key="stacked"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                className="relative h-[380px] sm:h-[420px] flex items-center justify-center"
                            >
                                {displayProjects.slice(0, 5).map((project, index) => {
                                    const offset = index - Math.floor(total / 2);
                                    return (
                                        <motion.div
                                            key={project.title}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                rotate: offset * 5,
                                                x: offset * 28,
                                                scale: 1 - Math.abs(offset) * 0.04,
                                            }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 200,
                                                damping: 25,
                                                delay: index * 0.05,
                                            }}
                                            className="absolute w-[260px] sm:w-[340px] bg-white rounded-3xl overflow-hidden border border-neutral-100 shadow-xl"
                                            style={{ zIndex: total - Math.abs(offset) }}
                                        >
                                            <div className="aspect-[16/10] overflow-hidden bg-neutral-100">
                                                <img
                                                    src={project.image}
                                                    alt={project.title}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                            <div className="p-4 sm:p-5">
                                                <h3 className="text-sm sm:text-base font-bold tracking-tight text-[#0c2320]">{project.title}</h3>
                                                <p className="text-[11px] text-neutral-400 mt-1">{project.category} · {project.year}</p>
                                            </div>
                                        </motion.div>
                                    );
                                })}

                                <p className="absolute bottom-4 text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-300 animate-pulse z-10">
                                    Scroll to explore
                                </p>
                            </motion.div>
                        ) : (
                            /* ── EXPANDED STATE ── */
                            <motion.div
                                key="expanded"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                            >
                                {/* Desktop list */}
                                <div className="hidden md:block border-t border-black/5">
                                    {displayProjects.map((project, index) => (
                                        <motion.div
                                            key={project.title}
                                            initial={{ opacity: 0, y: 50 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.5,
                                                delay: index * 0.08,
                                                ease: [0.25, 0.46, 0.45, 0.94],
                                            }}
                                            className="group grid grid-cols-[280px_1fr] gap-8 py-10 border-b border-black/5 hover:bg-neutral-50/50 transition-colors px-4 -mx-4 rounded-2xl cursor-pointer"
                                            onClick={() => project.url && window.open(project.url, "_blank", "noopener,noreferrer")}
                                        >
                                            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-neutral-100">
                                                <img
                                                    src={project.image}
                                                    alt={project.title}
                                                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-neutral-900/5 group-hover:bg-neutral-900/10 transition-colors" />
                                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md p-2 rounded-full opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                                    <ArrowUpRightIcon className="w-4 h-4 text-neutral-900" />
                                                </div>
                                            </div>

                                            <div className="flex flex-col justify-between">
                                                <div>
                                                    <div className="flex items-baseline justify-between mb-3">
                                                        <h3 className="text-2xl font-bold tracking-tight text-[#0c2320] group-hover:text-emerald-800 transition-colors">{project.title}</h3>
                                                        <span className="text-xs font-mono font-bold text-black/20 uppercase tracking-widest">{project.year}</span>
                                                    </div>
                                                    <p className="text-neutral-500 text-sm leading-relaxed mb-6 max-w-lg">
                                                        {project.description}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex flex-wrap gap-2">
                                                        {project.tech.map((t: string) => {
                                                            const icon = getTechIcon(t);
                                                            return (
                                                                <span key={t} className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-neutral-200 text-neutral-500 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
                                                                    {icon && (
                                                                        <img
                                                                            src={icon}
                                                                            alt={t}
                                                                            className="w-3 h-3 object-contain"
                                                                            onError={(e) => {
                                                                                (e.target as HTMLImageElement).src = "/tech-stack/Devicon.png";
                                                                            }}
                                                                        />
                                                                    )}
                                                                    {t}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/25">
                                                        {project.category}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Mobile cards */}
                                <div className="md:hidden space-y-5">
                                    {displayProjects.map((project, index) => (
                                        <motion.div
                                            key={project.title + "-mobile"}
                                            initial={{ opacity: 0, y: 40 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.5,
                                                delay: index * 0.08,
                                                ease: [0.25, 0.46, 0.45, 0.94],
                                            }}
                                            className="group border border-neutral-100 bg-neutral-50/30 rounded-3xl p-4 overflow-hidden cursor-pointer"
                                            onClick={() => project.url && window.open(project.url, "_blank", "noopener,noreferrer")}
                                        >
                                            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-neutral-100 mb-4">
                                                <img src={project.image} alt={project.title} className="object-cover w-full h-full" />
                                            </div>
                                            <h3 className="text-lg font-bold tracking-tight text-[#0c2320]">{project.title}</h3>
                                            <p className="text-neutral-500 text-xs leading-relaxed mt-2 line-clamp-2">{project.description}</p>
                                            <div className="flex flex-wrap gap-1.5 mt-3 overflow-hidden h-6">
                                                {project.tech.slice(0, 3).map((t: string) => {
                                                    const icon = getTechIcon(t);
                                                    return (
                                                        <span key={t} className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border border-neutral-200 text-neutral-400 whitespace-nowrap">
                                                            {icon && (
                                                                <img
                                                                    src={icon}
                                                                    alt={t}
                                                                    className="w-2.5 h-2.5 object-contain"
                                                                    onError={(e) => {
                                                                        (e.target as HTMLImageElement).src = "/tech-stack/Devicon.png";
                                                                    }}
                                                                />
                                                            )}
                                                            {t}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}

"use client";

import { EnvelopeIcon, CalendarIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

export default function Contact() {
    return (
        <section id="contact" className="relative py-20 px-6 overflow-hidden">
            {/* Repeating Background Pattern */}
            <div
                className="absolute inset-0 pointer-events-none select-none opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='80' viewBox='0 0 400 80' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' font-family='sans-serif' font-weight='900' font-size='14' fill='%23ffffff' style='text-transform: uppercase; letter-spacing: 0.15em;'%3EYOU CAN JUST BUILD THINGS%3C/text%3E%3C/svg%3E")`,
                    backgroundSize: '400px 80px'
                }}
            />
            <div className="relative max-w-6xl mx-auto">
                <div className="bg-[#0c2320] rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 md:p-16 text-center relative overflow-hidden text-white">
                    {/* Paper Plane SVG */}
                    <div className="mb-8 flex justify-center">
                        <svg width="100" height="70" viewBox="0 0 180 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/60">
                            <path d="M20 100L160 20L80 110L70 80L140 40L60 90L20 100Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            <path d="M80 110V120" stroke="currentColor" strokeWidth="2" />
                            <circle cx="25" cy="105" r="1.5" fill="currentColor" />
                            <circle cx="35" cy="85" r="1" fill="currentColor" />
                            <circle cx="50" cy="115" r="1" fill="currentColor" />
                        </svg>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.05em] mb-4 text-white">
                        Get in touch
                    </h2>

                    <p className="text-base sm:text-lg text-white/60 max-w-xl mx-auto mb-8 font-medium leading-relaxed">
                        I'm open to new project inquiries and collaborations. Let's talk.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
                        <a
                            href="mailto:eugeneopoku74@gmail.com"
                            className="w-full sm:w-auto px-6 py-3 bg-white rounded-full text-[#0c2320] font-bold text-sm hover:bg-neutral-100 transition-colors shadow-sm"
                        >
                            eugeneopoku74@gmail.com
                        </a>
                        <a
                            href="#"
                            className="w-full sm:w-auto px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white font-bold text-sm hover:bg-white/20 transition-colors shadow-sm border border-white/10 flex items-center justify-center gap-2"
                        >
                            Book a 20min <span className="text-base opacity-40">●</span> call
                        </a>
                    </div>

                    {/* Stamp Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto mb-8">
                        <div className="bg-white text-[#0c2320] p-5 sm:p-6 rounded-xl relative shadow-xl transform -rotate-1 hover:rotate-0 transition-transform cursor-pointer group col-span-2 md:col-span-1">
                            <h3 className="text-lg font-bold mb-4 text-left tracking-tight">Learn more</h3>
                            <div className="space-y-2">
                                <a href="#about" className="flex items-center justify-between text-xs font-bold opacity-70 group-hover:opacity-100 transition-opacity">
                                    About me <ArrowRightIcon className="w-3 h-3" />
                                </a>
                                <a href="#" className="flex items-center justify-between text-xs font-bold opacity-70 group-hover:opacity-100 transition-opacity">
                                    My Résumé <ArrowRightIcon className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md text-white p-5 sm:p-6 rounded-xl relative shadow-xl transform rotate-2 hover:rotate-0 transition-transform border border-white/10">
                            <h3 className="text-lg font-bold mb-6 text-left tracking-tight">Photos</h3>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 text-left">Coming soon</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md text-white p-5 sm:p-6 rounded-xl relative shadow-xl transform -rotate-2 hover:rotate-0 transition-transform border border-white/10">
                            <h3 className="text-lg font-bold mb-6 text-left tracking-tight">Work archive</h3>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 text-left">Coming soon</p>
                        </div>
                    </div>

                    <div className="flex justify-center gap-5 mb-6">
                        {['LinkedIn', 'Twitter', 'GitHub', 'Instagram'].map(social => (
                            <a key={social} href="#" className="text-white/30 hover:text-white transition-colors">
                                <span className="sr-only">{social}</span>
                                <div className="w-5 h-5 bg-current rounded-sm"></div>
                            </a>
                        ))}
                    </div>

                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/15 mb-2">
                        Portfolio spruced with illustrations and love <span className="text-white/10">×</span> 2026
                    </p>
                    <p className="text-xs font-bold text-white/30">
                        © 2026 Portfolio
                    </p>
                </div>
            </div>
        </section>
    );
}

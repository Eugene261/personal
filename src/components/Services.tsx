"use client";

import {
    CodeBracketIcon,
    SparklesIcon,
    DevicePhoneMobileIcon,
    CpuChipIcon,
    ArrowRightIcon
} from "@heroicons/react/24/outline";
import * as Icons from "@heroicons/react/24/outline"; // Import all icons as Icons object

import { getTechIcon } from "@/lib/techStackIcons";

export default function Services({ data }: { data?: any }) {
    const services = data?.services || [
        {
            title: "Full-Stack Web Development",
            description: "Building production-grade web applications from the ground up — frontend to backend, database to deployment.",
            icon: "CodeBracketIcon",
            tags: ["React", "Next.js", "Node.js"]
        },
        {
            title: "AI-Powered Products",
            description: "Integrating LLMs, intelligent automation, and AI-driven features to build smarter, faster applications.",
            icon: "SparklesIcon",
            tags: ["OpenAI", "LLMs", "Automation"]
        },
        {
            title: "Mobile Development",
            description: "Cross-platform mobile applications with native performance, intuitive UX, and real-time capabilities.",
            icon: "DevicePhoneMobileIcon",
            tags: ["React Native", "Expo", "Firebase"]
        },
        {
            title: "System Architecture",
            description: "Designing scalable backend systems, APIs, and cloud infrastructure built for reliability and growth.",
            icon: "CpuChipIcon",
            tags: ["PostgreSQL", "AWS", "REST / GraphQL"]
        }
    ];

    const approach = data?.approach || [
        { number: "01", title: "Identify the Problem", description: "Researching the space, understanding user pain points, and validating the idea before writing a single line." },
        { number: "02", title: "Design & Prototype", description: "Rapid UI prototyping with a focus on clarity, flow, and aesthetics that match the product vision." },
        { number: "03", title: "Build & Ship", description: "Clean, modular code with AI-assisted development — moving fast without cutting corners." },
        { number: "04", title: "Iterate & Scale", description: "Monitoring real usage, gathering feedback, and continuously improving based on data." }
    ];

    const techStack = data?.techStack || [
        "Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js",
        "PostgreSQL", "Python", "Scikit-Learn", "OpenAI API", "Framer Motion", "Vercel", "Git"
    ];

    const heading = data?.heading || "Services & Expertise";
    const subtitle = data?.subtitle || "I design, build, and ship complete products — from idea to deployment. Every project is a solo effort, powered by modern tooling and AI.";
    return (
        <section id="services" className="relative py-24 px-6 bg-white overflow-hidden">
            {/* Background Pattern */}
            <div
                className="absolute inset-0 pointer-events-none select-none opacity-[0.01]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='350' height='70' viewBox='0 0 350 70' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' font-family='sans-serif' font-weight='900' font-size='12' fill='%230c2320' style='text-transform: uppercase; letter-spacing: 0.15em;'%3EYOU CAN JUST BUILD THINGS%3C/text%3E%3C/svg%3E")`,
                    backgroundSize: '350px 70px'
                }}
            />
            <div className="relative max-w-6xl mx-auto">
                <div className="mb-20">
                    <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-[#0c2320] mb-6 leading-none">
                        {heading}
                    </h2>
                    <p className="text-lg text-neutral-500 max-w-xl leading-relaxed mb-10">
                        {subtitle}
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-16 items-start">
                    {/* Left: Services Grid */}
                    <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
                        {services.map((service: any) => {
                            const IconComponent = (Icons as any)[service.icon] || Icons.CodeBracketIcon;
                            return (
                                <div key={service.title} className="p-8 rounded-2xl border border-neutral-100 hover:border-neutral-200 hover:shadow-sm transition-all group bg-neutral-50/50">
                                    <IconComponent className="w-10 h-10 text-[#0c2320] mb-6 group-hover:scale-110 transition-transform duration-300" />
                                    <h3 className="text-xl font-bold mb-3 tracking-tight text-[#0c2320]">{service.title}</h3>
                                    <p className="text-neutral-500 text-sm leading-relaxed mb-6">
                                        {service.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {service.tags.map((tag: string) => (
                                            <span key={tag} className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 bg-white px-2 py-1 rounded border border-neutral-100">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right: The Approach Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#0c2320] p-8 rounded-3xl text-white sticky top-24">
                            <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                                My Approach
                                <span className="text-xs font-normal uppercase tracking-[0.2em] opacity-50 ml-auto">How I Build</span>
                            </h3>
                            <div className="space-y-4">
                                {approach.map((step: any, index: number) => (
                                    <div key={step.number} className="flex gap-4 p-5 rounded-2xl border border-transparent hover:border-neutral-100 transition-colors group">
                                        <span className="text-[10px] font-bold text-neutral-400 flex-shrink-0 mt-1">
                                            {step.number}
                                        </span>
                                        <div>
                                            <h4 className="text-lg font-bold mb-1 tracking-tight">{step.title}</h4>
                                            <p className="text-sm text-neutral-400 leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-12 pt-8 border-t border-white/10">
                                <a href="#contact" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white hover:gap-4 transition-all group">
                                    Work With Me
                                    <ArrowRightIcon className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tech Stack Footer */}
                <div className="mt-24 pt-16 border-t border-neutral-100">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-8 text-center lg:text-left">
                        Tools & Technologies
                    </p>
                    <div className="flex flex-wrap justify-center gap-y-4 gap-x-2 md:gap-x-3">
                        {techStack.map((tech: string) => {
                            const icon = getTechIcon(tech);
                            return (
                                <span key={tech} className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-neutral-200/60 bg-white text-sm font-semibold text-neutral-600 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                                    {icon && (
                                        <img
                                            src={icon}
                                            alt={tech}
                                            className="w-5 h-5 object-contain"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "/tech-stack/Devicon.png";
                                            }}
                                        />
                                    )}
                                    {tech}
                                </span>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

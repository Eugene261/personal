"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Props = {
  basics: {
    name: string;
    label: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    github: string;
    linkedin: string;
  };
  experiences: any[];
  projects: any[];
  education: any[];
  skills: {
    primary: string[];
    datascience: string[];
    secondary: string[];
  };
};

export default function ResumeClientView({ basics, experiences, projects, education, skills }: Props) {
  const [printTheme, setPrintTheme] = useState<"light" | "dark">("light");
  const [printing, setPrinting] = useState(false);

  // Apply print theme class to document body to handle page background when printing
  useEffect(() => {
    if (printTheme === "dark") {
      document.documentElement.classList.add("print-dark");
      document.body.classList.add("print-dark");
    } else {
      document.documentElement.classList.remove("print-dark");
      document.body.classList.remove("print-dark");
    }
    return () => {
      document.documentElement.classList.remove("print-dark");
      document.body.classList.remove("print-dark");
    };
  }, [printTheme]);

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 150);
  };

  const getCleanUrlDisplay = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname + (parsed.pathname !== "/" ? parsed.pathname : "");
    } catch {
      return url.replace("https://", "").replace("http://", "");
    }
  };

  // Color schemas based on theme selection
  const themeClasses = {
    light: {
      card: "bg-white text-black border-neutral-100",
      name: "text-neutral-900",
      subtitle: "text-emerald-700",
      contactText: "text-neutral-600",
      contactIcon: "text-neutral-400",
      secHeading: "text-neutral-900 border-neutral-100",
      itemTitle: "text-neutral-900",
      itemSubtitle: "text-emerald-700",
      itemPeriod: "text-neutral-500",
      itemDetails: "text-neutral-700",
      bulletText: "text-neutral-800",
    },
    dark: {
      card: "bg-neutral-950 text-neutral-100 border-neutral-900 print:bg-neutral-950 print:text-neutral-100 print:border-neutral-900",
      name: "text-white print:text-white",
      subtitle: "text-emerald-450 print:text-emerald-450",
      contactText: "text-neutral-400 print:text-neutral-400",
      contactIcon: "text-neutral-500 print:text-neutral-500",
      secHeading: "text-white border-neutral-800 print:text-white print:border-neutral-800",
      itemTitle: "text-white print:text-white",
      itemSubtitle: "text-emerald-450 print:text-emerald-450",
      itemPeriod: "text-neutral-400 print:text-neutral-400",
      itemDetails: "text-neutral-300 print:text-neutral-300",
      bulletText: "text-neutral-300 print:text-neutral-300",
    },
  }[printTheme];

  return (
    <div className="mx-auto w-full max-w-3xl pb-16 pt-4 px-4 sm:px-6">
      {/* Settings Panel & Navigation */}
      <div className="no-print mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          href="/"
          className="group inline-flex items-center gap-1 text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
        >
          <span className="inline-block transition-transform group-hover:-translate-x-0.5">←</span>
          <span>Back to Home</span>
        </Link>
        
        {/* Print Configuration Controls */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 border border-neutral-200 dark:border-neutral-800 rounded-lg p-1">
            <span className="text-neutral-400 px-1 font-mono">Print Theme:</span>
            <button
              onClick={() => setPrintTheme("light")}
              className={`px-2 py-1 rounded font-medium transition-all ${
                printTheme === "light"
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
            >
              Light
            </button>
            <button
              onClick={() => setPrintTheme("dark")}
              className={`px-2 py-1 rounded font-medium transition-all ${
                printTheme === "dark"
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
            >
              Dark
            </button>
          </div>
          <span className="text-neutral-400 font-mono hidden md:inline">PDF Optimized</span>
        </div>
      </div>

      {/* Main Resume Sheet */}
      <article className={`p-6 sm:p-10 rounded-2xl border shadow-sm transition-colors duration-300 print:border-0 print:p-0 print:shadow-none print:bg-transparent ${themeClasses.card}`}>
        {/* HEADER SECTION */}
        <header className={`border-b pb-5 ${printTheme === "dark" ? "border-neutral-900" : "border-neutral-100"}`}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2">
            <div>
              <h1 className={`text-3xl font-extrabold tracking-tight ${themeClasses.name}`}>
                {basics.name}
              </h1>
              <p className={`text-sm font-semibold tracking-wider uppercase mt-1 ${themeClasses.subtitle}`}>
                {basics.label}
              </p>
            </div>
          </div>

          {/* Contact Details 2-Column Grid */}
          <div className={`mt-5 grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6 text-xs font-mono ${themeClasses.contactText}`}>
            {basics.location && (
              <div className="flex items-center gap-1.5">
                <svg className={`w-3.5 h-3.5 shrink-0 ${themeClasses.contactIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{basics.location}</span>
              </div>
            )}
            {basics.phone && (
              <div className="flex items-center gap-1.5">
                <svg className={`w-3.5 h-3.5 shrink-0 ${themeClasses.contactIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${basics.phone}`} className="hover:underline">
                  {basics.phone}
                </a>
              </div>
            )}
            {basics.email && (
              <div className="flex items-center gap-1.5">
                <svg className={`w-3.5 h-3.5 shrink-0 ${themeClasses.contactIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${basics.email}`} className="hover:underline">
                  {basics.email}
                </a>
              </div>
            )}
            {basics.website && (
              <div className="flex items-center gap-1.5">
                <svg className={`w-3.5 h-3.5 shrink-0 ${themeClasses.contactIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <a href={basics.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {getCleanUrlDisplay(basics.website)}
                </a>
              </div>
            )}
            {basics.github && (
              <div className="flex items-center gap-1.5">
                <svg className={`w-3.5 h-3.5 shrink-0 fill-current ${themeClasses.contactIcon}`} viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
                <a href={basics.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {getCleanUrlDisplay(basics.github)}
                </a>
              </div>
            )}
            {basics.linkedin && (
              <div className="flex items-center gap-1.5">
                <svg className={`w-3.5 h-3.5 shrink-0 fill-current ${themeClasses.contactIcon}`} viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <a href={basics.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  linkedin.com/in/{basics.linkedin.split("/in/")[1] || "eugene"}
                </a>
              </div>
            )}
          </div>
        </header>

        {/* EXPERIENCE SECTION */}
        {experiences.length > 0 && (
          <section className="mt-7">
            <h2 className={`text-xs font-bold tracking-widest uppercase border-b pb-1 mb-3.5 ${themeClasses.secHeading}`}>
              Work Experience
            </h2>
            <div className="space-y-5">
              {experiences.map((exp: any) => (
                <div key={exp.id} className="print-avoid-break">
                  <div className="flex justify-between items-baseline">
                    <h3 className={`text-[13px] font-bold ${themeClasses.itemTitle}`}>
                      {exp.title}
                    </h3>
                    <span className={`text-[11px] font-mono ${themeClasses.itemPeriod}`}>
                      {exp.period}
                    </span>
                  </div>
                  <div className={`text-xs font-semibold italic mt-0.5 ${themeClasses.itemSubtitle}`}>
                    {exp.project} {exp.type ? `• ${exp.type}` : ""}
                  </div>
                  
                  {Array.isArray(exp.description) && exp.description.length > 0 && (
                    <ul className={`mt-2 list-disc pl-4 space-y-1 text-xs leading-relaxed ${themeClasses.bulletText}`}>
                      {exp.description.map((bullet: string, i: number) => (
                        <li key={i}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS SECTION */}
        {projects.length > 0 && (
          <section className="mt-7">
            <h2 className={`text-xs font-bold tracking-widest uppercase border-b pb-1 mb-3.5 ${themeClasses.secHeading}`}>
              Key Projects
            </h2>
            <div className="space-y-4">
              {projects.map((proj: any) => (
                <div key={proj.id} className="print-avoid-break">
                  <div className="flex justify-between items-baseline">
                    <h3 className={`text-[13px] font-bold ${themeClasses.itemTitle}`}>
                      {proj.title}
                    </h3>
                    {proj.year && (
                      <span className={`text-[11px] font-mono ${themeClasses.itemPeriod}`}>
                        {proj.year}
                      </span>
                    )}
                  </div>
                  <div className={`text-[11px] font-medium mt-0.5 ${themeClasses.itemPeriod}`}>
                    {proj.role} {proj.tech && proj.tech.length > 0 ? `| ${proj.tech.join(", ")}` : ""}
                  </div>
                  <p className={`text-xs mt-1.5 leading-relaxed ${themeClasses.itemDetails}`}>
                    {proj.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS SECTION */}
        <section className="mt-7">
          <h2 className={`text-xs font-bold tracking-widest uppercase border-b pb-1 mb-3 ${themeClasses.secHeading}`}>
            Technical Toolkit
          </h2>
          <div className={`text-xs space-y-1.5 ${themeClasses.bulletText}`}>
            {skills.primary && skills.primary.length > 0 && (
              <div className="print-avoid-break">
                <strong className={`font-semibold ${themeClasses.itemTitle}`}>Languages & Frameworks:</strong>{" "}
                {skills.primary.join(", ")}
              </div>
            )}
            {skills.datascience && skills.datascience.length > 0 && (
              <div className="print-avoid-break">
                <strong className={`font-semibold ${themeClasses.itemTitle}`}>Data Science & Machine Learning:</strong>{" "}
                {skills.datascience.join(", ")}
              </div>
            )}
            {skills.secondary && skills.secondary.length > 0 && (
              <div className="print-avoid-break">
                <strong className={`font-semibold ${themeClasses.itemTitle}`}>Databases, Tools & Infrastructure:</strong>{" "}
                {skills.secondary.join(", ")}
              </div>
            )}
          </div>
        </section>

        {/* EDUCATION SECTION */}
        {education.length > 0 && (
          <section className="mt-7">
            <h2 className={`text-xs font-bold tracking-widest uppercase border-b pb-1 mb-3.5 ${themeClasses.secHeading}`}>
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu: any) => (
                <div key={edu.id} className="print-avoid-break">
                  <div className="flex justify-between items-baseline">
                    <h3 className={`text-[13px] font-bold ${themeClasses.itemTitle}`}>
                      {edu.degree}
                    </h3>
                    <span className={`text-[11px] font-mono ${themeClasses.itemPeriod}`}>
                      {edu.period}
                    </span>
                  </div>
                  <div className={`text-xs font-medium mt-0.5 ${themeClasses.itemSubtitle}`}>
                    {edu.school}
                  </div>
                  {edu.details && (
                    <p className={`text-xs mt-1 leading-relaxed ${themeClasses.itemDetails}`}>
                      {edu.details}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </article>

      {/* Floating Action Button (Print) */}
      <div className="no-print fixed bottom-8 right-8 z-50">
        <button
          onClick={handlePrint}
          disabled={printing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <span>{printing ? "Preparing PDF..." : "Print / Save PDF"}</span>
        </button>
      </div>
    </div>
  );
}

import { getDocument, getCollection } from "@/lib/firebaseData";
import aboutDataLocal from "@/data/about.json";
import worksDataLocal from "@/data/works.json";
import resumeDataLocal from "@/data/resume.json";
import PrintButton from "@/components/PrintButton";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Resume | Eugene",
  description: "Eugene's professional resume. Curated achievements and technical toolkits.",
};

export default async function ResumePage() {
  const [aboutData, worksData, resumeData] = await Promise.all([
    getDocument<any>("content", "about"),
    getCollection<any>("works"),
    getDocument<any>("content", "resume"),
  ]);

  const safeAbout = aboutData || aboutDataLocal || {};
  const safeWorks = Array.isArray(worksData) && worksData.length > 0 ? worksData : worksDataLocal;
  const safeResume = resumeData || resumeDataLocal || {};

  // 1. Merge Basics
  const basics = {
    name: safeResume?.basics?.name || safeAbout?.hero?.name || "Eugene",
    label: safeResume?.basics?.label || safeAbout?.hero?.role || "Founder & Full-Stack Engineer",
    email: safeResume?.basics?.email || "eugeneopoku74@gmail.com",
    phone: safeResume?.basics?.phone || "",
    location: safeResume?.basics?.location || safeAbout?.quickFacts?.find((f: any) => f.label === "Location")?.value || "Accra, Ghana",
    website: safeResume?.basics?.website || "https://704-labz.vercel.app",
    github: safeResume?.basics?.github || "https://github.com/Eugene261",
    linkedin: safeResume?.basics?.linkedin || "https://www.linkedin.com/in/eugene-opoku-243601392",
    summary: safeResume?.basics?.summary || safeAbout?.hero?.bio || "",
  };

  // 2. Merge Experiences
  const experiences = (safeAbout.experiences || [])
    .map((exp: any) => {
      const override = safeResume.experiences?.[exp.id];
      if (override) {
        return {
          ...exp,
          included: override.included !== false,
          title: override.title || exp.title,
          project: override.project || exp.project,
          period: override.period || exp.period,
          description: Array.isArray(override.description) && override.description.length > 0 
            ? override.description.filter(Boolean)
            : exp.description,
        };
      }
      return { ...exp, included: true };
    })
    .filter((exp: any) => exp.included);

  // 3. Merge Projects (Works)
  const sortedWorks = [...safeWorks].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    const yearDiff = parseInt(b.year || "0") - parseInt(a.year || "0");
    if (yearDiff !== 0) return yearDiff;
    return parseInt(b.id || "0") - parseInt(a.id || "0");
  });

  const projects = sortedWorks
    .map((proj: any) => {
      const override = safeResume.projects?.[proj.id];
      if (override) {
        return {
          ...proj,
          included: override.included !== false,
          title: override.title || proj.title,
          role: override.role || "Founder & Full-Stack Engineer",
          description: override.description || proj.description,
          tech: Array.isArray(override.tech) && override.tech.length > 0 ? override.tech : proj.tech,
          url: override.url || proj.url,
        };
      }
      return { ...proj, included: true, role: "Founder & Full-Stack Engineer" };
    })
    .filter((proj: any) => proj.included);

  // 4. Merge Education
  const education = (safeAbout.education || [])
    .map((edu: any) => {
      const override = safeResume.education?.[edu.id];
      if (override) {
        return {
          ...edu,
          included: override.included !== false,
          degree: override.degree || edu.degree,
          school: override.school || edu.school,
          period: override.period || edu.period,
          details: override.details || edu.details,
        };
      }
      return { ...edu, included: true };
    })
    .filter((edu: any) => edu.included);

  // 5. Merge Skills
  const skills = {
    primary: safeResume.skills?.primary || safeAbout.skills?.primary || [],
    datascience: safeResume.skills?.datascience || safeAbout.skills?.datascience || [],
    secondary: safeResume.skills?.secondary || safeAbout.skills?.secondary || [],
  };

  const getCleanUrlDisplay = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname + (parsed.pathname !== "/" ? parsed.pathname : "");
    } catch {
      return url.replace("https://", "").replace("http://", "");
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl pb-16 pt-4 px-4 sm:px-6">
      {/* Navigation header for browser viewing */}
      <div className="no-print mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="group inline-flex items-center gap-1 text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
        >
          <span className="inline-block transition-transform group-hover:-translate-x-0.5">←</span>
          <span>Back to Home</span>
        </Link>
        <span className="text-xs font-mono text-neutral-400">PDF Optimized</span>
      </div>

      {/* Main Resume Sheet */}
      <article className="bg-white text-black p-6 sm:p-10 rounded-2xl border border-neutral-100 shadow-sm dark:bg-neutral-950 dark:text-neutral-100 dark:border-neutral-900 print:border-0 print:p-0 print:shadow-none print:bg-white print:text-black">
        {/* HEADER SECTION */}
        <header className="border-b border-neutral-100 dark:border-neutral-800 print:border-neutral-200 pb-5">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white print:text-black">
                {basics.name}
              </h1>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-450 print:text-neutral-800 tracking-wider uppercase mt-1">
                {basics.label}
              </p>
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400 print:text-neutral-700 font-mono space-y-1 sm:text-right">
              {basics.location && <div className="print:text-neutral-800">{basics.location}</div>}
              {basics.phone && (
                <div>
                  <a href={`tel:${basics.phone}`} className="hover:underline">
                    {basics.phone}
                  </a>
                </div>
              )}
              <div>
                <a href={`mailto:${basics.email}`} className="hover:underline">
                  {basics.email}
                </a>
              </div>
            </div>
          </div>

          {/* Socials / Links row */}
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-neutral-500 dark:text-neutral-400 print:text-neutral-700 font-mono">
            {basics.website && (
              <a href={basics.website} target="_blank" rel="noopener noreferrer" className="hover:underline inline-flex items-center gap-1">
                <span>🌐</span> <span>{getCleanUrlDisplay(basics.website)}</span>
              </a>
            )}
            {basics.github && (
              <a href={basics.github} target="_blank" rel="noopener noreferrer" className="hover:underline inline-flex items-center gap-1">
                <span>💻</span> <span>{getCleanUrlDisplay(basics.github)}</span>
              </a>
            )}
            {basics.linkedin && (
              <a href={basics.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline inline-flex items-center gap-1">
                <span>🔗</span> <span>linkedin.com/in/{basics.linkedin.split("/in/")[1] || "eugene"}</span>
              </a>
            )}
          </div>
        </header>

        {/* SUMMARY SECTION */}
        {basics.summary && (
          <section className="mt-6">
            <h2 className="text-xs font-bold tracking-widest text-neutral-900 dark:text-white print:text-black uppercase border-b border-neutral-100 dark:border-neutral-800 print:border-neutral-200 pb-1 mb-2.5">
              Profile Summary
            </h2>
            <p className="text-[12.5px] leading-relaxed text-neutral-800 dark:text-neutral-250 print:text-neutral-850">
              {basics.summary}
            </p>
          </section>
        )}

        {/* EXPERIENCE SECTION */}
        {experiences.length > 0 && (
          <section className="mt-7">
            <h2 className="text-xs font-bold tracking-widest text-neutral-900 dark:text-white print:text-black uppercase border-b border-neutral-100 dark:border-neutral-800 print:border-neutral-200 pb-1 mb-3.5">
              Work Experience
            </h2>
            <div className="space-y-5">
              {experiences.map((exp: any) => (
                <div key={exp.id} className="print-avoid-break">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[13px] font-bold text-neutral-900 dark:text-white print:text-black">
                      {exp.title}
                    </h3>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 print:text-neutral-700 font-mono">
                      {exp.period}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-450 print:text-neutral-700 italic mt-0.5">
                    {exp.project} {exp.type ? `• ${exp.type}` : ""}
                  </div>
                  
                  {Array.isArray(exp.description) && exp.description.length > 0 && (
                    <ul className="mt-2 list-disc pl-4 space-y-1 text-xs text-neutral-800 dark:text-neutral-300 print:text-neutral-850 leading-relaxed">
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
            <h2 className="text-xs font-bold tracking-widest text-neutral-900 dark:text-white print:text-black uppercase border-b border-neutral-100 dark:border-neutral-800 print:border-neutral-200 pb-1 mb-3.5">
              Key Projects
            </h2>
            <div className="space-y-4">
              {projects.map((proj: any) => (
                <div key={proj.id} className="print-avoid-break">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[13px] font-bold text-neutral-900 dark:text-white print:text-black">
                      {proj.title}
                    </h3>
                    {proj.year && (
                      <span className="text-[11px] text-neutral-400 dark:text-neutral-500 print:text-neutral-700 font-mono">
                        {proj.year}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-medium text-neutral-500 dark:text-neutral-450 print:text-neutral-600 mt-0.5">
                    {proj.role} {proj.tech && proj.tech.length > 0 ? `| ${proj.tech.join(", ")}` : ""}
                  </div>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 print:text-neutral-800 mt-1.5 leading-relaxed">
                    {proj.description}{" "}
                    {proj.url && (
                      <a
                        href={proj.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 dark:text-emerald-450 print:text-black hover:underline font-mono text-[10px] ml-1 no-print"
                      >
                        [Link ↗]
                      </a>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS SECTION */}
        <section className="mt-7">
          <h2 className="text-xs font-bold tracking-widest text-neutral-900 dark:text-white print:text-black uppercase border-b border-neutral-100 dark:border-neutral-800 print:border-neutral-200 pb-1 mb-3">
            Technical Toolkit
          </h2>
          <div className="text-xs space-y-1.5 text-neutral-800 dark:text-neutral-300 print:text-neutral-850">
            {skills.primary && skills.primary.length > 0 && (
              <div className="print-avoid-break">
                <strong className="text-neutral-900 dark:text-white print:text-black font-semibold">Languages & Frameworks:</strong>{" "}
                {skills.primary.join(", ")}
              </div>
            )}
            {skills.datascience && skills.datascience.length > 0 && (
              <div className="print-avoid-break">
                <strong className="text-neutral-900 dark:text-white print:text-black font-semibold">Data Science & Machine Learning:</strong>{" "}
                {skills.datascience.join(", ")}
              </div>
            )}
            {skills.secondary && skills.secondary.length > 0 && (
              <div className="print-avoid-break">
                <strong className="text-neutral-900 dark:text-white print:text-black font-semibold">Databases, Tools & Infrastructure:</strong>{" "}
                {skills.secondary.join(", ")}
              </div>
            )}
          </div>
        </section>

        {/* EDUCATION SECTION */}
        {education.length > 0 && (
          <section className="mt-7">
            <h2 className="text-xs font-bold tracking-widest text-neutral-900 dark:text-white print:text-black uppercase border-b border-neutral-100 dark:border-neutral-800 print:border-neutral-200 pb-1 mb-3.5">
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu: any) => (
                <div key={edu.id} className="print-avoid-break">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[13px] font-bold text-neutral-900 dark:text-white print:text-black">
                      {edu.degree}
                    </h3>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 print:text-neutral-700 font-mono">
                      {edu.period}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-emerald-600 dark:text-emerald-450 print:text-neutral-700 mt-0.5">
                    {edu.school}
                  </div>
                  {edu.details && (
                    <p className="text-xs text-neutral-700 dark:text-neutral-350 print:text-neutral-800 mt-1 leading-relaxed">
                      {edu.details}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </article>

      {/* Floating print widget */}
      <PrintButton />
    </div>
  );
}

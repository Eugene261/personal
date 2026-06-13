import { getDocument, getCollection } from "@/lib/firebaseData";
import { BlogPosts } from "@/app/components/posts";
import QuoteModal from "@/components/QuoteModal";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import ProfileImages from "@/components/ProfileImages";
import ContactChat from "@/components/ContactChat";
import TechMarquee from "@/components/TechMarquee";
import aboutDataLocal from "@/data/about.json";
import worksDataLocal from "@/data/works.json";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [aboutData, worksData] = await Promise.all([
    getDocument<any>("content", "about"),
    getCollection<any>("works"),
  ]);

  const safeAbout = aboutData || aboutDataLocal || {};
  const safeWorks = Array.isArray(worksData) && worksData.length > 0 ? worksData : worksDataLocal;

  // Sort works by custom order index if defined, fallback to year descending then id descending
  const sortedWorks = [...safeWorks].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    const yearDiff = parseInt(b.year || "0") - parseInt(a.year || "0");
    if (yearDiff !== 0) return yearDiff;
    return parseInt(b.id || "0") - parseInt(a.id || "0");
  });

  const experiences = safeAbout.experiences || aboutDataLocal.experiences || [];

  // Render bio text replacing "steer even in the storm" with QuoteModal component, splitting by lines
  const renderBioWithQuote = (bioText: string) => {
    if (!bioText) return null;
    const lines = bioText.split("\n").map(l => l.trim()).filter(Boolean);
    const target = "steer even in the storm";
    
    return (
      <div className="space-y-5">
        {lines.map((line, idx) => {
          const lowerText = line.toLowerCase();
          const targetIndex = lowerText.indexOf(target);
          
          if (targetIndex === -1) {
            return (
              <p key={idx} className="text-neutral-800 dark:text-neutral-200 leading-relaxed text-base">
                {line}
              </p>
            );
          }
          
          const part1 = line.slice(0, targetIndex);
          const exactTarget = line.slice(targetIndex, targetIndex + target.length);
          const part2 = line.slice(targetIndex + target.length);
          
          return (
            <p key={idx} className="text-neutral-850 dark:text-neutral-200 leading-relaxed text-base">
              {part1}
              <QuoteModal linkText={exactTarget} />
              {part2}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-14">
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          {/* Profile images with hover fan-out */}
          <ProfileImages
            images={safeAbout.profileImages || (safeAbout.profileImage ? [safeAbout.profileImage] : [])}
            name={safeAbout.hero?.name || "Eugene"}
          />

          {/* Social Links right under the profile image */}
          <div className="flex gap-3 text-xs font-mono mt-1">
            <a
              href="https://x.com/YGene_"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 hover:bg-neutral-100 dark:bg-neutral-900/50 dark:hover:bg-neutral-800 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-all shadow-sm active:scale-95"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>x.com ↗</span>
            </a>
            <a
              href="https://www.linkedin.com/in/eugene-opoku-243601392"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 hover:bg-neutral-100 dark:bg-neutral-900/50 dark:hover:bg-neutral-800 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-all shadow-sm active:scale-95"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span>linkedin ↗</span>
            </a>
          </div>
        </div>

        {/* Dynamic short bio */}
        <div className="mt-1">
          {renderBioWithQuote(safeAbout.hero?.bio || "")}
        </div>
      </section>

      {/* Tech Stack Infinite Carousel */}
      <TechMarquee
        skills={[
          ...(safeAbout.skills?.primary || []),
          ...(safeAbout.skills?.secondary || []),
          ...(safeAbout.skills?.datascience || []),
        ]}
      />

      {/* Selected Work Section */}
      <section>
        <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-6">
          Selected Work
        </h2>
        <div className="space-y-8">
          {sortedWorks.map((work) => (
            <div key={work.id ?? work.title} className="flex flex-row gap-4 sm:gap-5 items-start">
              {work.image && (
                work.url ? (
                  <a
                    href={work.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-24 sm:w-36 aspect-[16/10] sm:h-[90px] rounded-xl overflow-hidden shrink-0 border border-neutral-200/50 dark:border-neutral-800/50 bg-neutral-50 dark:bg-neutral-900/50 shadow-sm relative group block"
                  >
                    <img
                      src={work.image}
                      alt={work.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </a>
                ) : (
                  <div className="w-24 sm:w-36 aspect-[16/10] sm:h-[90px] rounded-xl overflow-hidden shrink-0 border border-neutral-200/50 dark:border-neutral-800/50 bg-neutral-50 dark:bg-neutral-900/50 shadow-sm relative group">
                    <img
                      src={work.image}
                      alt={work.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )
              )}
              <div className="flex-1 min-w-0 w-full flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    {work.url ? (
                      <a
                        href={work.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-neutral-900 dark:text-neutral-100 hover:underline underline-offset-4 decoration-neutral-300 dark:decoration-neutral-700 transition-all"
                      >
                        {work.title}
                      </a>
                    ) : (
                      <span className="font-medium text-neutral-900 dark:text-neutral-100">
                        {work.title}
                      </span>
                    )}
                    <span className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">
                      ({work.category})
                    </span>
                    {work.url && (
                      <a
                        href={work.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 font-mono transition-colors inline-flex items-center gap-0.5 ml-1"
                      >
                        • visit ↗
                      </a>
                    )}
                  </div>
                  <span className="text-sm font-mono text-neutral-400 dark:text-neutral-500 tabular-nums">
                    {work.year}
                  </span>
                </div>
                <p className="text-sm text-neutral-650 dark:text-neutral-350 leading-relaxed">
                  {work.description}
                </p>
                {Array.isArray(work.tech) && (
                  <div className="flex flex-wrap gap-1.5 mt-0.5">
                    {work.tech.map((t: string) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section>
        <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-6">
          Experience
        </h2>
        <ExperienceTimeline experiences={experiences} />
      </section>

      {/* Writing Section */}
      <section>
        <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-6">
          Writing
        </h2>
        <BlogPosts />
      </section>

      {/* Contact Section */}
      <section className="mb-8">
        <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-6">
          contact
        </h2>
        <ContactChat />
      </section>
    </div>
  );
}

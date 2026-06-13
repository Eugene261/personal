import { getDocument, getCollection } from "@/lib/firebaseData";
import { BlogPosts } from "@/app/components/posts";
import QuoteModal from "@/components/QuoteModal";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import ProfileImages from "@/components/ProfileImages";
import ContactChat from "@/components/ContactChat";
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
      {/* Editorial Profile Header (steijn.com style) */}
      <section className="flex flex-col gap-6">
        {/* Profile images with hover fan-out */}
        <ProfileImages
          images={safeAbout.profileImages || (safeAbout.profileImage ? [safeAbout.profileImage] : [])}
          name={safeAbout.hero?.name || "Eugene"}
        />

        {/* Dynamic short bio */}
        <div className="mt-1">
          {renderBioWithQuote(safeAbout.hero?.bio || "")}
        </div>
      </section>


      {/* Selected Work Section */}
      <section>
        <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-6">
          Selected Work
        </h2>
        <div className="space-y-8">
          {sortedWorks.map((work) => (
            <div key={work.id ?? work.title} className="flex flex-col sm:flex-row gap-5 items-start">
              {work.image && (
                work.url ? (
                  <a
                    href={work.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-36 aspect-[16/10] sm:h-[90px] rounded-xl overflow-hidden shrink-0 border border-neutral-200/50 dark:border-neutral-800/50 bg-neutral-50 dark:bg-neutral-900/50 shadow-sm relative group block"
                  >
                    <img
                      src={work.image}
                      alt={work.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </a>
                ) : (
                  <div className="w-full sm:w-36 aspect-[16/10] sm:h-[90px] rounded-xl overflow-hidden shrink-0 border border-neutral-200/50 dark:border-neutral-800/50 bg-neutral-50 dark:bg-neutral-900/50 shadow-sm relative group">
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

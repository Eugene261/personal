import { getDocument, getCollection } from "@/lib/firebaseData";
import { BlogPosts } from "@/app/components/posts";
import QuoteModal from "@/components/QuoteModal";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import ProfileImages from "@/components/ProfileImages";
import ContactChat from "@/components/ContactChat";
import TechMarquee from "@/components/TechMarquee";
import SelectedWorksAccordion from "@/components/SelectedWorksAccordion";
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
            <a
              href="https://github.com/Eugene261"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 hover:bg-neutral-100 dark:bg-neutral-900/50 dark:hover:bg-neutral-800 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-all shadow-sm active:scale-95"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              <span>github ↗</span>
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
        <SelectedWorksAccordion works={sortedWorks} />
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

import { getCollection } from "@/lib/firebaseData";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Work",
  description: "Selected projects and case studies.",
};

export default async function WorkPage() {
  const works = await getCollection<any>("works");
  const safeWorks: any[] = Array.isArray(works) ? works : [];
  const sortedWorks = [...safeWorks].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    const yearDiff = parseInt(b.year || "0") - parseInt(a.year || "0");
    if (yearDiff !== 0) return yearDiff;
    return parseInt(b.id || "0") - parseInt(a.id || "0");
  });

  return (
    <section>
      <h1 className="title text-2xl font-semibold tracking-tighter">Work</h1>
      <p className="mt-4 text-neutral-700 dark:text-neutral-300">
        A selection of projects across web, mobile, and systems.
      </p>

      <div className="mt-8 space-y-7">
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
            <div className="flex-1 min-w-0 w-full flex flex-col gap-1">
              <div className="flex items-baseline justify-between gap-4">
                {work.url ? (
                  <a
                    href={work.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-neutral-900 dark:text-neutral-100 hover:underline underline-offset-4 decoration-neutral-300 dark:decoration-neutral-700 transition-all tracking-tight"
                  >
                    {work.title}
                  </a>
                ) : (
                  <p className="font-medium text-neutral-900 dark:text-neutral-100 tracking-tight">
                    {work.title}
                  </p>
                )}
                <p className="text-sm text-neutral-600 dark:text-neutral-400 tabular-nums">
                  {work.year}
                </p>
              </div>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-500 flex items-center gap-1.5 font-mono">
                <span>{work.category}</span>
                {work.url && (
                  <a
                    href={work.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors inline-flex items-center gap-0.5 ml-1"
                  >
                    • visit ↗
                  </a>
                )}
              </p>
              <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">{work.description}</p>
              {Array.isArray(work.tech) && work.tech.length > 0 ? (
                <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                  {work.tech.join(" · ")}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


import { getCollection } from "@/lib/firebaseData";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Work",
  description: "Selected projects and case studies.",
};

export default async function WorkPage() {
  const works = await getCollection<any>("works");
  const safeWorks: any[] = Array.isArray(works) ? works : [];

  return (
    <section>
      <h1 className="title text-2xl font-semibold tracking-tighter">Work</h1>
      <p className="mt-4 text-neutral-700 dark:text-neutral-300">
        A selection of projects across web, mobile, and systems.
      </p>

      <div className="mt-8 space-y-7">
        {safeWorks.map((work) => (
          <div key={work.id ?? work.title}>
            <div className="flex items-baseline justify-between gap-4">
              <p className="font-medium text-neutral-900 dark:text-neutral-100 tracking-tight">
                {work.title}
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 tabular-nums">
                {work.year}
              </p>
            </div>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{work.category}</p>
            <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">{work.description}</p>
            {Array.isArray(work.tech) && work.tech.length > 0 ? (
              <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
                {work.tech.join(" · ")}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}


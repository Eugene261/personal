import { getDocument, getCollection } from "@/lib/firebaseData";
import { BlogPosts } from "@/app/components/posts";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [aboutData, servicesData, worksData] = await Promise.all([
    getDocument<any>("content", "about"),
    getDocument<any>("content", "services"),
    getCollection<any>("works"),
  ]);

  const safeAbout = aboutData || {};
  const safeServices = servicesData || {};
  const safeWorks: any[] = Array.isArray(worksData) ? worksData : [];
  const hero = safeAbout?.hero || {};

  return (
    <section>
      <section className="mb-12">
        <h1 className="title text-2xl font-semibold tracking-tighter">
          {hero?.name ? `${hero.greeting ?? "Hi, I'm"} ${hero.name}.` : "Portfolio"}
        </h1>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">
          {hero?.headline ?? "Engineering software solutions that drive real impact."}
        </p>
        <p className="mt-3 text-neutral-600 dark:text-neutral-400">
          {hero?.subtitle ?? "Self-taught Full-Stack Engineer building production-grade applications."}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/work"
            className="rounded-md bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black px-3 py-1.5 text-sm font-medium"
          >
            View work
          </Link>
          <Link
            href="/services"
            className="rounded-md border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 text-sm font-medium"
          >
            Services
          </Link>
          <Link
            href="/blog"
            className="rounded-md border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 text-sm font-medium"
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="rounded-md border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 text-sm font-medium"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="rounded-md border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 text-sm font-medium"
          >
            Contact
          </Link>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold tracking-tighter">Selected work</h2>
        <div className="space-y-5">
          {safeWorks.slice(0, 3).map((work) => (
            <div key={work.id ?? work.title} className="flex flex-col">
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-medium text-neutral-900 dark:text-neutral-100 tracking-tight">
                  {work.title}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 tabular-nums">
                  {work.year}
                </p>
              </div>
              <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                {work.description}
              </p>
              <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
                {Array.isArray(work.tech) ? work.tech.join(" · ") : null}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Link className="text-sm underline underline-offset-4" href="/work">
            View all work
          </Link>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold tracking-tighter">Services</h2>
        <div className="space-y-4">
          {(safeServices?.services ?? []).slice(0, 3).map((service: any) => (
            <div key={service.id ?? service.title}>
              <p className="font-medium text-neutral-900 dark:text-neutral-100 tracking-tight">
                {service.title}
              </p>
              <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                {service.description}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Link className="text-sm underline underline-offset-4" href="/services">
            View services
          </Link>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold tracking-tighter">Latest posts</h2>
        <BlogPosts />
      </section>
    </section>
  );
}


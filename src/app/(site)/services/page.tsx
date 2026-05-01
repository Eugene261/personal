import { getDocument } from "@/lib/firebaseData";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Services",
  description: "What I do and how I work.",
};

export default async function ServicesPage() {
  const servicesData = await getDocument<any>("content", "services");
  const safe = servicesData || {};
  const services: any[] = safe?.services ?? [];
  const approach: any[] = safe?.approach ?? [];
  const techStack: string[] = safe?.techStack ?? [];

  return (
    <section>
      <h1 className="title text-2xl font-semibold tracking-tighter">
        {safe?.heading ?? "Services"}
      </h1>
      <p className="mt-4 text-neutral-700 dark:text-neutral-300">
        {safe?.subtitle ?? "I design, build, and ship complete products."}
      </p>

      {services.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold tracking-tighter">What I do</h2>
          <div className="mt-4 space-y-6">
            {services.map((s) => (
              <div key={s.id ?? s.title}>
                <p className="font-medium text-neutral-900 dark:text-neutral-100 tracking-tight">
                  {s.title}
                </p>
                <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">{s.description}</p>
                {Array.isArray(s.tags) && s.tags.length > 0 ? (
                  <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
                    {s.tags.join(" · ")}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {approach.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold tracking-tighter">How I work</h2>
          <div className="mt-4 space-y-4">
            {approach.map((step) => (
              <div key={step.number ?? step.title}>
                <p className="font-medium text-neutral-900 dark:text-neutral-100 tracking-tight">
                  {step.number ? `${step.number} — ` : ""}
                  {step.title}
                </p>
                <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {techStack.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold tracking-tighter">Tools</h2>
          <p className="mt-3 text-sm text-neutral-700 dark:text-neutral-300">
            {techStack.join(" · ")}
          </p>
        </div>
      )}
    </section>
  );
}


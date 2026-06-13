import { getDocument } from "@/lib/firebaseData";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const aboutData = await getDocument<any>("content", "about");
  const safeAbout = aboutData || {};

  const experiences: any[] = safeAbout?.experiences ?? [];
  const education: any[] = safeAbout?.education ?? [];
  const philosophy: any[] = safeAbout?.philosophy ?? [];
  const skills = safeAbout?.skills ?? {};
  const quickFacts: any[] = safeAbout?.quickFacts ?? [];

  return (
    <section>
      <h1 className="title text-2xl font-semibold tracking-tighter">About</h1>
      <p className="mt-4 text-neutral-700 dark:text-neutral-300">
        {safeAbout?.aboutTeaser?.body ??
          "Self-taught Full-Stack Engineer building products end-to-end."}
      </p>

      {quickFacts.length > 0 && (
        <div className="mt-8 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">At a glance</p>
          <dl className="mt-3 grid grid-cols-1 gap-2">
            {quickFacts.map((item) => (
              <div key={item.label} className="flex items-baseline justify-between gap-4">
                <dt className="text-sm text-neutral-600 dark:text-neutral-400">{item.label}</dt>
                <dd className="text-sm text-neutral-900 dark:text-neutral-100">{item.value}</dd>
              </div>
            ))}
            <div className="flex items-baseline justify-between gap-4 border-t border-neutral-100 dark:border-neutral-900 pt-2 mt-1">
              <dt className="text-sm text-neutral-600 dark:text-neutral-400">X (Twitter)</dt>
              <dd className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                <a href="https://x.com/YGene_" target="_blank" rel="noopener noreferrer" className="hover:underline">@YGene_ ↗</a>
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-sm text-neutral-600 dark:text-neutral-400">LinkedIn</dt>
              <dd className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                <a href="https://www.linkedin.com/in/eugene-opoku-243601392" target="_blank" rel="noopener noreferrer" className="hover:underline">Eugene Opoku ↗</a>
              </dd>
            </div>
          </dl>
        </div>
      )}

      {experiences.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold tracking-tighter">Experience</h2>
          <div className="mt-4 space-y-6">
            {experiences.map((exp) => (
              <div key={exp.id ?? exp.title}>
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-medium text-neutral-900 dark:text-neutral-100 tracking-tight">
                    {exp.title}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{exp.period}</p>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{exp.project}</p>
                <ul className="mt-2 list-disc pl-5 text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
                  {(exp.description ?? []).map((d: string, i: number) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold tracking-tighter">Education</h2>
          <div className="mt-4 space-y-5">
            {education.map((edu) => (
              <div key={edu.id ?? edu.degree}>
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-medium text-neutral-900 dark:text-neutral-100 tracking-tight">
                    {edu.degree}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{edu.period}</p>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{edu.school}</p>
                <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">{edu.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {philosophy.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold tracking-tighter">Principles</h2>
          <div className="mt-4 space-y-4">
            {philosophy.map((p) => (
              <div key={p.id ?? p.title}>
                <p className="font-medium text-neutral-900 dark:text-neutral-100 tracking-tight">
                  {p.title}
                </p>
                <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">{p.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {skills && (skills.primary || skills.secondary || skills.datascience) && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold tracking-tighter">Skills</h2>
          <div className="mt-4 space-y-5 text-sm text-neutral-700 dark:text-neutral-300">
            {skills.primary?.length ? (
              <p>
                <span className="text-neutral-900 dark:text-neutral-100 font-medium">Primary:</span>{" "}
                {skills.primary.join(", ")}
              </p>
            ) : null}
            {skills.datascience?.length ? (
              <p>
                <span className="text-neutral-900 dark:text-neutral-100 font-medium">Data/ML:</span>{" "}
                {skills.datascience.join(", ")}
              </p>
            ) : null}
            {skills.secondary?.length ? (
              <p>
                <span className="text-neutral-900 dark:text-neutral-100 font-medium">Also:</span>{" "}
                {skills.secondary.join(", ")}
              </p>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
}


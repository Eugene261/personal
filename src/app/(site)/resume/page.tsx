import { getDocument, getCollection } from "@/lib/firebaseData";
import aboutDataLocal from "@/data/about.json";
import worksDataLocal from "@/data/works.json";
import resumeDataLocal from "@/data/resume.json";
import ResumeClientView from "@/components/ResumeClientView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Eugene Opoku - Resume",
  description: "Eugene Opoku's professional resume. Curated achievements and technical toolkits.",
};

export default async function ResumePage() {
  const [aboutData, worksData, resumeData] = await Promise.all([
    getDocument<any>("content", "about"),
    getCollection<any>("works"),
    getDocument<any>("content", "resume"),
  ]);

  const safeAbout = aboutData || aboutDataLocal || {};
  const safeWorks = Array.isArray(worksData) && worksData.length > 0 ? worksData : worksDataLocal;
  const safeResumeProjects = {
    ...resumeDataLocal.projects,
    ...resumeData?.projects,
  };
  if ((resumeDataLocal.projects as any)?.["2"]?.included) {
    safeResumeProjects["2"] = {
      ...(resumeDataLocal.projects as any)["2"],
      ...(resumeData?.projects?.["2"] || {}),
      included: true,
    };
  }

  const safeResume = {
    ...resumeDataLocal,
    ...resumeData,
    basics: {
      ...resumeDataLocal.basics,
      ...resumeData?.basics,
    },
    projects: safeResumeProjects,
    experiences: {
      ...resumeDataLocal.experiences,
      ...resumeData?.experiences,
    },
  };

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
    summary: safeResume?.basics?.summary || "",
  };

  // 2. Merge Experiences
  const experiences = (safeAbout.experiences || [])
    .map((exp: any) => {
      const override = safeResume.experiences?.[exp.id];
      const localExp = (aboutDataLocal.experiences || []).find((e: any) => e.id === exp.id);
      const localResumeExp = (resumeDataLocal.experiences as any)?.[exp.id];
      
      const projectName = override?.project || exp.project;
      const matchedWork = (safeWorks || []).find(
        (w: any) => w.title?.toLowerCase().trim() === projectName?.toLowerCase().trim()
      );
      
      const resolvedUrl = 
        override?.url ||
        exp?.url ||
        localResumeExp?.url ||
        localExp?.url ||
        matchedWork?.url ||
        "";

      if (override) {
        return {
          ...exp,
          included: override.included !== false,
          title: override.title || exp.title,
          project: projectName,
          period: override.period || exp.period,
          url: resolvedUrl,
          description: Array.isArray(override.description) && override.description.length > 0 
            ? override.description.filter(Boolean)
            : exp.description,
        };
      }
      return { ...exp, included: true, project: projectName, url: resolvedUrl };
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
      const cloudOverride = safeResume.projects?.[proj.id];
      const localOverride = (resumeDataLocal.projects as any)?.[proj.id];
      const override = cloudOverride || localOverride;

      const isIncluded = cloudOverride?.included !== undefined 
        ? cloudOverride.included !== false 
        : localOverride?.included !== undefined 
          ? localOverride.included !== false 
          : true;

      if (override) {
        return {
          ...proj,
          included: isIncluded,
          title: override.title || proj.title,
          role: override.role || "Creator & Engineer",
          description: override.description || proj.description,
          tech: Array.isArray(override.tech) && override.tech.length > 0 ? override.tech : proj.tech,
          url: override.url || proj.url,
        };
      }
      return { ...proj, included: true, role: "Creator & Engineer" };
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

  return (
    <ResumeClientView
      basics={basics}
      experiences={experiences}
      projects={projects}
      education={education}
      skills={skills}
    />
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  ArrowPathIcon,
  CheckIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  CodeBracketIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

type Experience = {
  id: string;
  title: string;
  project: string;
  type: string;
  period: string;
  description: string[];
  icon?: string;
};

type Education = {
  id: string;
  degree: string;
  school: string;
  period: string;
  details: string;
};

type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  tech: string[];
  url: string;
  year?: string;
};

type SubTab = "basics" | "experiences" | "projects" | "education" | "skills" | "guide";

export default function ResumeManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("basics");

  // Data states
  const [siteAbout, setSiteAbout] = useState<any>(null);
  const [siteWorks, setSiteWorks] = useState<Project[]>([]);
  const [resumeConfig, setResumeConfig] = useState<any>({
    basics: {
      name: "",
      label: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      github: "",
      linkedin: "",
      summary: "",
    },
    experiences: {},
    education: {},
    projects: {},
    skills: {
      primary: [],
      datascience: [],
      secondary: [],
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [aboutRes, worksRes, resumeRes] = await Promise.all([
        fetch("/api/admin/about"),
        fetch("/api/admin/works"),
        fetch("/api/admin/resume"),
      ]);

      const aboutData = await aboutRes.json();
      const worksData = await worksRes.json();
      const resumeData = await resumeRes.json();

      setSiteAbout(aboutData);
      setSiteWorks(worksData || []);

      // Format resumeConfig from fetched data, fallback to defaults
      setResumeConfig({
        basics: {
          name: resumeData?.basics?.name || aboutData?.hero?.name || "",
          label: resumeData?.basics?.label || aboutData?.hero?.role || "",
          email: resumeData?.basics?.email || "eugeneopoku74@gmail.com",
          phone: resumeData?.basics?.phone || "",
          location: resumeData?.basics?.location || aboutData?.quickFacts?.find((f: any) => f.label === "Location")?.value || "Accra, Ghana",
          website: resumeData?.basics?.website || "https://704-labz.vercel.app",
          github: resumeData?.basics?.github || "https://github.com/Eugene261",
          linkedin: resumeData?.basics?.linkedin || "https://www.linkedin.com/in/eugene-opoku-243601392",
          summary: resumeData?.basics?.summary || aboutData?.hero?.bio || "",
        },
        experiences: resumeData?.experiences || {},
        education: resumeData?.education || {},
        projects: resumeData?.projects || {},
        skills: {
          primary: resumeData?.skills?.primary || aboutData?.skills?.primary || [],
          datascience: resumeData?.skills?.datascience || aboutData?.skills?.datascience || [],
          secondary: resumeData?.skills?.secondary || aboutData?.skills?.secondary || [],
        },
      });
    } catch (error) {
      console.error("Failed to load data for Resume Builder", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/admin/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumeConfig),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert("Failed to save resume configuration");
      }
    } catch (error) {
      console.error("Error saving resume configuration", error);
      alert("Error saving resume configuration");
    } finally {
      setSaving(false);
    }
  };

  const updateBasics = (field: string, value: string) => {
    setResumeConfig({
      ...resumeConfig,
      basics: {
        ...resumeConfig.basics,
        [field]: value,
      },
    });
  };

  const toggleExperience = (id: string, exp: Experience) => {
    const current = resumeConfig.experiences[id] || {
      included: true,
      title: exp.title,
      project: exp.project,
      period: exp.period,
      description: exp.description,
    };
    setResumeConfig({
      ...resumeConfig,
      experiences: {
        ...resumeConfig.experiences,
        [id]: {
          ...current,
          included: !current.included,
        },
      },
    });
  };

  const updateExperienceOverride = (id: string, field: string, value: any, exp: Experience) => {
    const current = resumeConfig.experiences[id] || {
      included: true,
      title: exp.title,
      project: exp.project,
      period: exp.period,
      description: exp.description,
    };
    setResumeConfig({
      ...resumeConfig,
      experiences: {
        ...resumeConfig.experiences,
        [id]: {
          ...current,
          [field]: value,
        },
      },
    });
  };

  const toggleProject = (id: string, proj: Project) => {
    const current = resumeConfig.projects[id] || {
      included: true,
      title: proj.title,
      role: "Founder & Full-Stack Engineer",
      description: proj.description,
      tech: proj.tech,
      url: proj.url,
    };
    setResumeConfig({
      ...resumeConfig,
      projects: {
        ...resumeConfig.projects,
        [id]: {
          ...current,
          included: !current.included,
        },
      },
    });
  };

  const updateProjectOverride = (id: string, field: string, value: any, proj: Project) => {
    const current = resumeConfig.projects[id] || {
      included: true,
      title: proj.title,
      role: "Founder & Full-Stack Engineer",
      description: proj.description,
      tech: proj.tech,
      url: proj.url,
    };
    setResumeConfig({
      ...resumeConfig,
      projects: {
        ...resumeConfig.projects,
        [id]: {
          ...current,
          [field]: value,
        },
      },
    });
  };

  const toggleEducation = (id: string, edu: Education) => {
    const current = resumeConfig.education[id] || {
      included: true,
      degree: edu.degree,
      school: edu.school,
      period: edu.period,
      details: edu.details,
    };
    setResumeConfig({
      ...resumeConfig,
      education: {
        ...resumeConfig.education,
        [id]: {
          ...current,
          included: !current.included,
        },
      },
    });
  };

  const updateEducationOverride = (id: string, field: string, value: any, edu: Education) => {
    const current = resumeConfig.education[id] || {
      included: true,
      degree: edu.degree,
      school: edu.school,
      period: edu.period,
      details: edu.details,
    };
    setResumeConfig({
      ...resumeConfig,
      education: {
        ...resumeConfig.education,
        [id]: {
          ...current,
          [field]: value,
        },
      },
    });
  };

  const updateSkillsOverride = (category: "primary" | "datascience" | "secondary", index: number, value: string) => {
    const newSkills = [...resumeConfig.skills[category]];
    newSkills[index] = value;
    setResumeConfig({
      ...resumeConfig,
      skills: {
        ...resumeConfig.skills,
        [category]: newSkills,
      },
    });
  };

  const addSkill = (category: "primary" | "datascience" | "secondary") => {
    setResumeConfig({
      ...resumeConfig,
      skills: {
        ...resumeConfig.skills,
        [category]: [...resumeConfig.skills[category], ""],
      },
    });
  };

  const removeSkill = (category: "primary" | "datascience" | "secondary", index: number) => {
    const newSkills = resumeConfig.skills[category].filter((_: any, i: number) => i !== index);
    setResumeConfig({
      ...resumeConfig,
      skills: {
        ...resumeConfig.skills,
        [category]: newSkills,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center text-emerald-500">
        <ArrowPathIcon className="h-6 w-6 animate-spin mr-2" />
        Loading Resume configuration...
      </div>
    );
  }

  const subTabs = [
    { id: "basics", label: "Contact & Summary", icon: <UserIcon className="h-4 w-4" /> },
    { id: "experiences", label: "Work Experience", icon: <BriefcaseIcon className="h-4 w-4" /> },
    { id: "projects", label: "Projects Selection", icon: <CodeBracketIcon className="h-4 w-4" /> },
    { id: "education", label: "Education Toggle", icon: <AcademicCapIcon className="h-4 w-4" /> },
    { id: "skills", label: "Skills Layout", icon: <CodeBracketIcon className="h-4 w-4" /> },
    { id: "guide", label: "Resume Guide", icon: <InformationCircleIcon className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Resume Builder</h2>
          <p className="text-sm text-neutral-500">
            Curate, edit, and tailor your professional resume.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="text-sm text-emerald-500 font-medium flex items-center gap-1">
              <CheckIcon className="h-4 w-4" /> Saved successfully
            </span>
          )}
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 disabled:opacity-50 text-sm"
          >
            {saving ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : null}
            Save Resume
          </button>
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as SubTab)}
            className={[
              "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
              activeSubTab === tab.id
                ? "bg-neutral-100 text-black dark:bg-neutral-900 dark:text-white"
                : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-neutral-100",
            ].join(" ")}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content panes */}
      <div className="mt-4">
        {/* BASICS PANEL */}
        {activeSubTab === "basics" && (
          <div className="space-y-6 max-w-3xl">
            <div className="rounded-lg bg-neutral-50 dark:bg-neutral-950 p-4 border border-neutral-200/50 dark:border-neutral-800/50">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <InformationCircleIcon className="h-4 w-4 text-emerald-500" />
                Industry Standard Tip
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Contact information should be accurate and minimal. A phone number is critical for recruiters, and including links to your portfolio website, GitHub, and LinkedIn helps them verify your work.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Name</label>
                <input
                  type="text"
                  value={resumeConfig.basics.name}
                  onChange={(e) => updateBasics("name", e.target.value)}
                  className="w-full bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Eugene Opoku"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Professional Title</label>
                <input
                  type="text"
                  value={resumeConfig.basics.label}
                  onChange={(e) => updateBasics("label", e.target.value)}
                  className="w-full bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Founder & Full-Stack Engineer"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Email</label>
                <input
                  type="email"
                  value={resumeConfig.basics.email}
                  onChange={(e) => updateBasics("email", e.target.value)}
                  className="w-full bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. eugene@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Phone Number (Required for Resume)</label>
                <input
                  type="text"
                  value={resumeConfig.basics.phone}
                  onChange={(e) => updateBasics("phone", e.target.value)}
                  className="w-full bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. +233 (0) 50 123 4567"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Location</label>
                <input
                  type="text"
                  value={resumeConfig.basics.location}
                  onChange={(e) => updateBasics("location", e.target.value)}
                  className="w-full bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Accra, Ghana"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Website / Portfolio</label>
                <input
                  type="text"
                  value={resumeConfig.basics.website}
                  onChange={(e) => updateBasics("website", e.target.value)}
                  className="w-full bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">GitHub Link</label>
                <input
                  type="text"
                  value={resumeConfig.basics.github}
                  onChange={(e) => updateBasics("github", e.target.value)}
                  className="w-full bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">LinkedIn Link</label>
                <input
                  type="text"
                  value={resumeConfig.basics.linkedin}
                  onChange={(e) => updateBasics("linkedin", e.target.value)}
                  className="w-full bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Professional Summary</label>
                <span className="text-[10px] text-neutral-500">💡 Tip: Focus on technical keywords and founder experience. 2-3 sentences.</span>
              </div>
              <textarea
                rows={4}
                value={resumeConfig.basics.summary}
                onChange={(e) => updateBasics("summary", e.target.value)}
                className="w-full bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                placeholder="Write a powerful statement summarizing your expertise, key skills, and engineering philosophy."
              />
            </div>
          </div>
        )}

        {/* EXPERIENCES PANEL */}
        {activeSubTab === "experiences" && (
          <div className="space-y-6">
            <div className="rounded-lg bg-neutral-50 dark:bg-neutral-950 p-4 border border-neutral-200/50 dark:border-neutral-800/50">
              <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
                <InformationCircleIcon className="h-4 w-4 text-emerald-500" />
                The Google X-Y-Z Bullet Point Formula
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-2">
                Recruiters love results. Write bullet points that show impact: <strong>&quot;Accomplished [X], as measured by [Y], by doing [Z].&quot;</strong> Start with active verbs.
              </p>
              <p className="text-xs text-neutral-500 italic">
                Example: &quot;Architected and launched social commerce backend (Z) improving checkout speeds by 30% (Y) and supporting 1k+ real-time transactions in the first month (X).&quot;
              </p>
            </div>

            <div className="space-y-6">
              {siteAbout?.experiences?.map((exp: Experience) => {
                const override = resumeConfig.experiences[exp.id] || {
                  included: true,
                  title: exp.title,
                  project: exp.project,
                  period: exp.period,
                  description: exp.description,
                };

                return (
                  <div
                    key={exp.id}
                    className={[
                      "border rounded-xl p-4 transition-colors",
                      override.included
                        ? "border-neutral-200 dark:border-neutral-800 bg-transparent"
                        : "border-neutral-100 dark:border-neutral-900 bg-neutral-50/20 dark:bg-neutral-950/20 opacity-60",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{exp.icon || "💼"}</span>
                        <div>
                          <h4 className="font-semibold text-sm">
                            {exp.title} <span className="text-neutral-400">@</span> {exp.project}
                          </h4>
                          <p className="text-xs text-neutral-500">{exp.period}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="inline-flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={override.included}
                            onChange={() => toggleExperience(exp.id, exp)}
                            className="rounded border-neutral-300 dark:border-neutral-700 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                          />
                          <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400 select-none">
                            {override.included ? "Included in Resume" : "Hidden"}
                          </span>
                        </label>
                      </div>
                    </div>

                    {override.included && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Title Override</label>
                            <input
                              type="text"
                              value={override.title}
                              onChange={(e) => updateExperienceOverride(exp.id, "title", e.target.value, exp)}
                              className="w-full bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Company Override</label>
                            <input
                              type="text"
                              value={override.project}
                              onChange={(e) => updateExperienceOverride(exp.id, "project", e.target.value, exp)}
                              className="w-full bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Period Override</label>
                            <input
                              type="text"
                              value={override.period}
                              onChange={(e) => updateExperienceOverride(exp.id, "period", e.target.value, exp)}
                              className="w-full bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-baseline">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                              Resume Bullet Points (one per line)
                            </label>
                            <span className="text-[9px] text-neutral-400">Action verb + metrics + tool</span>
                          </div>
                          <textarea
                            rows={4}
                            value={Array.isArray(override.description) ? override.description.join("\n") : ""}
                            onChange={(e) =>
                              updateExperienceOverride(
                                exp.id,
                                "description",
                                e.target.value.split("\n"),
                                exp
                              )
                            }
                            className="w-full bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-emerald-500"
                            placeholder="Design, build, and deploy..."
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PROJECTS PANEL */}
        {activeSubTab === "projects" && (
          <div className="space-y-6">
            <div className="rounded-lg bg-neutral-50 dark:bg-neutral-950 p-4 border border-neutral-200/50 dark:border-neutral-800/50">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <InformationCircleIcon className="h-4 w-4 text-emerald-500" />
                Featured Projects Curation
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Include projects that demonstrate your ability to deliver end-to-end products. Clearly define your role (e.g. Creator, Lead Developer) and detail the technology stack. Keeping it relevant is key to maintaining a 1-page resume document.
              </p>
            </div>

            <div className="space-y-6">
              {siteWorks?.map((proj: Project) => {
                const override = resumeConfig.projects[proj.id] || {
                  included: true,
                  title: proj.title,
                  role: "Founder & Full-Stack Engineer",
                  description: proj.description,
                  tech: proj.tech,
                  url: proj.url,
                };

                return (
                  <div
                    key={proj.id}
                    className={[
                      "border rounded-xl p-4 transition-colors",
                      override.included
                        ? "border-neutral-200 dark:border-neutral-800 bg-transparent"
                        : "border-neutral-100 dark:border-neutral-900 bg-neutral-50/20 dark:bg-neutral-950/20 opacity-60",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-4">
                      <div>
                        <h4 className="font-semibold text-sm">
                          {proj.title} <span className="text-xs font-normal text-neutral-500">({proj.category})</span>
                        </h4>
                        <p className="text-xs text-neutral-500">{proj.url}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="inline-flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={override.included}
                            onChange={() => toggleProject(proj.id, proj)}
                            className="rounded border-neutral-300 dark:border-neutral-700 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                          />
                          <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400 select-none">
                            {override.included ? "Include in Resume" : "Hidden"}
                          </span>
                        </label>
                      </div>
                    </div>

                    {override.included && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Project Name Override</label>
                            <input
                              type="text"
                              value={override.title}
                              onChange={(e) => updateProjectOverride(proj.id, "title", e.target.value, proj)}
                              className="w-full bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Role / Contribution</label>
                            <input
                              type="text"
                              value={override.role}
                              onChange={(e) => updateProjectOverride(proj.id, "role", e.target.value, proj)}
                              className="w-full bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Project URL Override</label>
                            <input
                              type="text"
                              value={override.url}
                              onChange={(e) => updateProjectOverride(proj.id, "url", e.target.value, proj)}
                              className="w-full bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Resume Description</label>
                          <textarea
                            rows={2}
                            value={override.description}
                            onChange={(e) => updateProjectOverride(proj.id, "description", e.target.value, proj)}
                            className="w-full bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Technologies (comma-separated)</label>
                          <input
                            type="text"
                            value={Array.isArray(override.tech) ? override.tech.join(", ") : ""}
                            onChange={(e) =>
                              updateProjectOverride(
                                proj.id,
                                "tech",
                                e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                                proj
                              )
                            }
                            className="w-full bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* EDUCATION PANEL */}
        {activeSubTab === "education" && (
          <div className="space-y-6">
            <div className="space-y-4">
              {siteAbout?.education?.map((edu: Education) => {
                const override = resumeConfig.education[edu.id] || {
                  included: true,
                  degree: edu.degree,
                  school: edu.school,
                  period: edu.period,
                  details: edu.details,
                };

                return (
                  <div
                    key={edu.id}
                    className={[
                      "border rounded-xl p-4 transition-colors",
                      override.included
                        ? "border-neutral-200 dark:border-neutral-800 bg-transparent"
                        : "border-neutral-100 dark:border-neutral-900 bg-neutral-50/20 dark:bg-neutral-950/20 opacity-60",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-4">
                      <div>
                        <h4 className="font-semibold text-sm">{edu.degree}</h4>
                        <p className="text-xs text-neutral-500">{edu.school} | {edu.period}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="inline-flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={override.included}
                            onChange={() => toggleEducation(edu.id, edu)}
                            className="rounded border-neutral-300 dark:border-neutral-700 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                          />
                          <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400 select-none">
                            {override.included ? "Include in Resume" : "Hidden"}
                          </span>
                        </label>
                      </div>
                    </div>

                    {override.included && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Degree Override</label>
                            <input
                              type="text"
                              value={override.degree}
                              onChange={(e) => updateEducationOverride(edu.id, "degree", e.target.value, edu)}
                              className="w-full bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">School Override</label>
                            <input
                              type="text"
                              value={override.school}
                              onChange={(e) => updateEducationOverride(edu.id, "school", e.target.value, edu)}
                              className="w-full bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Period Override</label>
                            <input
                              type="text"
                              value={override.period}
                              onChange={(e) => updateEducationOverride(edu.id, "period", e.target.value, edu)}
                              className="w-full bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Description Override</label>
                          <textarea
                            rows={3}
                            value={override.details}
                            onChange={(e) => updateEducationOverride(edu.id, "details", e.target.value, edu)}
                            className="w-full bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SKILLS PANEL */}
        {activeSubTab === "skills" && (
          <div className="space-y-6 max-w-3xl">
            <div className="rounded-lg bg-neutral-50 dark:bg-neutral-950 p-4 border border-neutral-200/50 dark:border-neutral-800/50">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <InformationCircleIcon className="h-4 w-4 text-emerald-500" />
                Technical Skills Optimization
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Organize your skills so hiring managers can immediately identify your technical stack. Place your core languages and modern framework competencies right at the top.
              </p>
            </div>

            {(["primary", "datascience", "secondary"] as const).map((cat) => {
              const labelMap = {
                primary: "Languages & Frameworks",
                datascience: "Data Science & AI/ML",
                secondary: "Tools, Infrastructure & Databases",
              };

              return (
                <div key={cat} className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">{labelMap[cat]}</h4>
                    <button
                      type="button"
                      onClick={() => addSkill(cat)}
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:opacity-80 flex items-center gap-1"
                    >
                      + Add Skill
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {resumeConfig.skills[cat]?.map((skill: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-900 border border-neutral-250 dark:border-neutral-850 rounded-lg pl-3 pr-1.5 py-1 text-xs"
                      >
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => updateSkillsOverride(cat, idx, e.target.value)}
                          className="bg-transparent border-0 p-0 focus:ring-0 focus:outline-none w-24 text-xs"
                          placeholder="Skill name"
                        />
                        <button
                          type="button"
                          onClick={() => removeSkill(cat, idx)}
                          className="text-neutral-400 hover:text-red-500 p-0.5"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* GUIDE PANEL */}
        {activeSubTab === "guide" && (
          <div className="prose prose-sm dark:prose-invert max-w-3xl space-y-6 text-sm text-neutral-700 dark:text-neutral-300">
            <div>
              <h3 className="text-base font-bold text-black dark:text-white mb-2 border-b pb-1">
                Industry-Standard Resume Guidelines
              </h3>
              <p className="leading-relaxed">
                A software engineering resume has a single objective: <strong>earn you a technical interview.</strong> Technical recruiters spend an average of 6 seconds looking at a resume. Make it structured, clean, and highly technical.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-black dark:text-white">✅ Formatting Do&apos;s</h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs">
                  <li><strong>Keep it under 1-2 pages:</strong> A single page is preferred for engineering roles. Clean margins (0.5 to 0.75 inches).</li>
                  <li><strong>Clear Contact Metadata:</strong> Place Name, Title, Email, Location, Phone, GitHub, and Portfolio links clearly at the top.</li>
                  <li><strong>ATS Friendly:</strong> Avoid complex multi-column grids or sidebars, graphic scales, or custom fonts that fail parsing systems. Stick to single-column text layouts.</li>
                  <li><strong>No rating graphs:</strong> Never use progress bars for skill levels (e.g. &quot;React: 80%&quot;). Just list the skills.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-black dark:text-white">🚀 Writing Bullet Points</h4>
                <p className="text-xs leading-relaxed">
                  Start every description bullet point with a strong, precise action verb.
                </p>
                <div className="bg-neutral-50 dark:bg-neutral-950 border rounded-lg p-3 text-xs space-y-2">
                  <div>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Technical Words:</span>
                    <p className="text-[11px] text-neutral-500 italic mt-0.5">
                      Architected, Engineered, Developed, Built, Refactored, Debugged, Automated, Integrated, Deployed.
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Business/Founder Words:</span>
                    <p className="text-[11px] text-neutral-500 italic mt-0.5">
                      Founded, Spearheaded, Orchestrated, Designed, Shipped, Scaled, Led, Optimized, Saved.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold text-black dark:text-white mb-2">💡 Example Summary Templates</h4>
              <div className="space-y-3">
                <div className="p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs">
                  <span className="font-bold block mb-1">Founder / Full-Stack Template</span>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed italic">
                    &quot;Full-Stack Engineer and Startup Founder with 6+ years of experience building and shipping production-grade applications. Expert in Rust, TypeScript, and Python, with a history of launching 6+ products from zero to production. Passionate about AI-assisted engineering pipelines, scalable systems architecture, and product-focused development.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

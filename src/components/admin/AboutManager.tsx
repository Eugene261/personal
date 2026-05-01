"use client";

import { useState, useEffect } from "react";
import { PlusIcon, PencilIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

type Experience = {
    id: string;
    title: string;
    project: string;
    type: string;
    period: string;
    description: string[];
    icon: string;
};

type Education = {
    id: string;
    degree: string;
    school: string;
    period: string;
    details: string;
};

type QuickFact = {
    label: string;
    value: string;
};

export default function AboutManager() {
    const [fullConfig, setFullConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [activeSection, setActiveSection] = useState<"experiences" | "education" | "quickFacts">("experiences");

    // Editing states
    const [editingExp, setEditingExp] = useState<Experience | null>(null);
    const [editingEdu, setEditingEdu] = useState<Education | null>(null);
    const [editingFact, setEditingFact] = useState<{ index: number, fact: QuickFact } | null>(null);

    useEffect(() => {
        fetchAbout();
    }, []);

    const fetchAbout = async () => {
        try {
            const res = await fetch("/api/admin/about");
            const data = await res.json();
            setFullConfig(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (updatedConfig: any) => {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/about", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedConfig)
            });
            if (res.ok) {
                setEditingExp(null);
                setEditingEdu(null);
                setEditingFact(null);
                fetchAbout(); // Reload
            }
        } catch (error) {
            console.error("Failed to save", error);
        } finally {
            setSaving(false);
        }
    };

    const saveExperience = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingExp || !fullConfig) return;
        const newExps = [...(fullConfig.experiences || [])];
        const existingIndex = newExps.findIndex(exp => exp.id === editingExp.id);
        if (existingIndex >= 0) {
            newExps[existingIndex] = editingExp;
        } else {
            newExps.push({ ...editingExp, id: Date.now().toString() });
        }
        handleSave({ ...fullConfig, experiences: newExps });
    };

    const saveEducation = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingEdu || !fullConfig) return;
        const newEdus = [...(fullConfig.education || [])];
        const existingIndex = newEdus.findIndex(edu => edu.id === editingEdu.id);
        if (existingIndex >= 0) {
            newEdus[existingIndex] = editingEdu;
        } else {
            newEdus.push({ ...editingEdu, id: Date.now().toString() });
        }
        handleSave({ ...fullConfig, education: newEdus });
    };

    const saveFact = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingFact || !fullConfig) return;
        const newFacts = [...(fullConfig.quickFacts || [])];
        if (editingFact.index >= 0) {
            newFacts[editingFact.index] = editingFact.fact;
        } else {
            newFacts.push(editingFact.fact);
        }
        handleSave({ ...fullConfig, quickFacts: newFacts });
    };

    if (loading) return <div className="animate-pulse text-emerald-500">Loading about data...</div>;

    if (editingExp) {
        return (
            <div>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white">{editingExp.id ? 'Edit Experience' : 'New Experience'}</h2>
                    <button onClick={() => setEditingExp(null)} className="text-neutral-400 hover:text-white px-4 py-2">Cancel</button>
                </div>

                <form onSubmit={saveExperience} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Title</label>
                            <input required type="text" value={editingExp.title} onChange={e => setEditingExp({ ...editingExp, title: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Project / Company</label>
                            <input required type="text" value={editingExp.project} onChange={e => setEditingExp({ ...editingExp, project: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Period (e.g. 2024 - Present)</label>
                            <input required type="text" value={editingExp.period} onChange={e => setEditingExp({ ...editingExp, period: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Type (e.g. Solo Project)</label>
                            <input required type="text" value={editingExp.type} onChange={e => setEditingExp({ ...editingExp, type: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Description Items (one per line)</label>
                        <textarea required rows={5} value={editingExp.description.join("\n")} onChange={e => setEditingExp({ ...editingExp, description: e.target.value.split("\n") })} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
                    </div>

                    <button disabled={saving} type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 mt-8 disabled:opacity-50">
                        {saving ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : null}
                        Save Experience
                    </button>
                </form>
            </div>
        );
    }

    if (editingEdu) {
        return (
            <div>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white">{editingEdu.id ? 'Edit Education' : 'New Education'}</h2>
                    <button onClick={() => setEditingEdu(null)} className="text-neutral-400 hover:text-white px-4 py-2">Cancel</button>
                </div>

                <form onSubmit={saveEducation} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Degree</label>
                            <input required type="text" value={editingEdu.degree} onChange={e => setEditingEdu({ ...editingEdu, degree: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">School / Institution</label>
                            <input required type="text" value={editingEdu.school} onChange={e => setEditingEdu({ ...editingEdu, school: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Period (e.g. 2017 - 2021)</label>
                        <input required type="text" value={editingEdu.period} onChange={e => setEditingEdu({ ...editingEdu, period: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Details</label>
                        <textarea required rows={4} value={editingEdu.details} onChange={e => setEditingEdu({ ...editingEdu, details: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
                    </div>

                    <button disabled={saving} type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 mt-8 disabled:opacity-50">
                        {saving ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : null}
                        Save Education
                    </button>
                </form>
            </div>
        );
    }

    if (editingFact) {
        return (
            <div>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white">{editingFact.index >= 0 ? 'Edit Fact' : 'New Fact'}</h2>
                    <button onClick={() => setEditingFact(null)} className="text-neutral-400 hover:text-white px-4 py-2">Cancel</button>
                </div>

                <form onSubmit={saveFact} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Label (e.g. Status, Stack)</label>
                        <input required type="text" value={editingFact.fact.label} onChange={e => setEditingFact({ ...editingFact, fact: { ...editingFact.fact, label: e.target.value } })} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Value (e.g. Solo Builder, Next.js)</label>
                        <input required type="text" value={editingFact.fact.value} onChange={e => setEditingFact({ ...editingFact, fact: { ...editingFact.fact, value: e.target.value } })} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
                    </div>

                    <button disabled={saving} type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 mt-8 disabled:opacity-50">
                        {saving ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : null}
                        Save Fact
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div>
            {/* Section tabs */}
            <div className="flex gap-2 sm:gap-4 overflow-x-auto whitespace-nowrap border-b border-neutral-800 pb-4 mb-8 no-scrollbar">
                <button 
                    onClick={() => setActiveSection("experiences")}
                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeSection === 'experiences' ? 'bg-emerald-900/40 text-emerald-400' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}`}
                >
                    Experiences
                </button>
                <button 
                    onClick={() => setActiveSection("education")}
                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeSection === 'education' ? 'bg-emerald-900/40 text-emerald-400' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}`}
                >
                    Education
                </button>
                <button 
                    onClick={() => setActiveSection("quickFacts")}
                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeSection === 'quickFacts' ? 'bg-emerald-900/40 text-emerald-400' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}`}
                >
                    Quick Facts
                </button>
            </div>

            {activeSection === "experiences" && (
                <>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">Experiences</h2>
                            <p className="text-sm text-neutral-500">Manage the timeline items.</p>
                        </div>
                        <button onClick={() => setEditingExp({ id: "", title: "", project: "", type: "Solo Project", period: "", description: [""], icon: "🚀" })} className="bg-white text-neutral-950 hover:bg-neutral-200 font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors w-full sm:w-auto">
                            <PlusIcon className="w-4 h-4" /> Add Experience
                        </button>
                    </div>
                    <div className="space-y-4">
                        {(fullConfig?.experiences || []).map((exp: Experience) => (
                            <div key={exp.id} className="bg-neutral-950/50 border border-neutral-800 rounded-xl p-5 flex items-center justify-between group">
                                <div className="flex items-start gap-5">
                                    <div>
                                        <h3 className="font-bold text-white tracking-tight">{exp.title} — {exp.project}</h3>
                                        <div className="text-xs text-neutral-500 mt-1 flex gap-2">
                                            <span>{exp.type}</span> • <span>{exp.period}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setEditingExp(exp)} className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-emerald-400 transition-colors">
                                        <PencilIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {activeSection === "education" && (
                <>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">Education</h2>
                            <p className="text-sm text-neutral-500">Manage education entries.</p>
                        </div>
                        <button onClick={() => setEditingEdu({ id: "", degree: "", school: "", period: "", details: "" })} className="bg-white text-neutral-950 hover:bg-neutral-200 font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors w-full sm:w-auto">
                            <PlusIcon className="w-4 h-4" /> Add Education
                        </button>
                    </div>
                    <div className="space-y-4">
                        {(fullConfig?.education || []).map((edu: Education) => (
                            <div key={edu.id} className="bg-neutral-950/50 border border-neutral-800 rounded-xl p-5 flex items-center justify-between group">
                                <div className="flex items-start gap-5">
                                    <div>
                                        <h3 className="font-bold text-white tracking-tight">{edu.degree} — {edu.school}</h3>
                                        <div className="text-xs text-neutral-500 mt-1">
                                            <span>{edu.period}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setEditingEdu(edu)} className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-emerald-400 transition-colors">
                                        <PencilIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {activeSection === "quickFacts" && (
                <>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">Quick Facts (At a Glance)</h2>
                            <p className="text-sm text-neutral-500">Manage the quick facts shown on the right side.</p>
                        </div>
                        <button onClick={() => setEditingFact({ index: -1, fact: { label: "", value: "" } })} className="bg-white text-neutral-950 hover:bg-neutral-200 font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors w-full sm:w-auto">
                            <PlusIcon className="w-4 h-4" /> Add Fact
                        </button>
                    </div>
                    <div className="space-y-4">
                        {(fullConfig?.quickFacts || []).map((fact: QuickFact, index: number) => (
                            <div key={index} className="bg-neutral-950/50 border border-neutral-800 rounded-xl p-5 flex items-center justify-between group">
                                <div className="flex items-start gap-5">
                                    <div>
                                        <h3 className="font-bold text-emerald-400 tracking-tight text-sm uppercase">{fact.label}</h3>
                                        <div className="text-base text-white mt-1">
                                            {fact.value}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setEditingFact({ index, fact })} className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-emerald-400 transition-colors">
                                        <PencilIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { PlusIcon, PencilIcon, ArrowPathIcon, TrashIcon } from "@heroicons/react/24/outline";
import { getTechIcon } from "@/lib/techStackIcons";

type Service = {
    id: string;
    title: string;
    description: string;
    icon: string;
    tags: string[];
};

export default function ServicesManager() {
    const [services, setServices] = useState<Service[]>([]);
    const [fullConfig, setFullConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Quick and dirty editing state
    const [editingService, setEditingService] = useState<Service | null>(null);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await fetch("/api/admin/services");
            const data = await res.json();
            setFullConfig(data);
            setServices(data.services || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const saveFullConfig = async (updatedConfig: any) => {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/services", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedConfig)
            });
            if (res.ok) {
                setFullConfig(updatedConfig);
                setServices(updatedConfig.services || []);
            }
        } catch (error) {
            console.error("Failed to save", error);
        } finally {
            setSaving(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingService || !fullConfig) return;

        // Update the specific service inside the full config
        const existingIndex = services.findIndex(s => s.id === editingService.id);
        const newServices = [...services];

        if (existingIndex >= 0) {
            newServices[existingIndex] = editingService;
        } else {
            newServices.push({ ...editingService, id: Date.now().toString() });
        }

        const updatedConfig = { ...fullConfig, services: newServices };
        await saveFullConfig(updatedConfig);
        setEditingService(null);
    };

    if (loading) return <div className="animate-pulse text-emerald-500">Loading services...</div>;

    if (editingService) {
        return (
            <div>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white">{editingService.id ? 'Edit Service' : 'New Service'}</h2>
                    <button onClick={() => setEditingService(null)} className="text-neutral-400 hover:text-white px-4 py-2">Cancel</button>
                </div>

                <form onSubmit={handleSave} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Title</label>
                        <input required type="text" value={editingService.title} onChange={e => setEditingService({ ...editingService, title: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Description</label>
                        <textarea required rows={3} value={editingService.description} onChange={e => setEditingService({ ...editingService, description: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Icon Name (Heroicons)</label>
                        <input required type="text" value={editingService.icon} onChange={e => setEditingService({ ...editingService, icon: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Tags (comma separated)</label>
                        <input required type="text" value={editingService.tags?.join(", ") || ""} onChange={e => setEditingService({ ...editingService, tags: e.target.value.split(",").map(s => s.trim()) })} placeholder="React, Node.js, Tailwind" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
                    </div>

                    <button disabled={saving} type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 mt-8 disabled:opacity-50">
                        {saving ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : null}
                        Save Service
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Services & Offerings</h2>
                    <p className="text-sm text-neutral-500">Manage your main service cards.</p>
                </div>
                <button
                    onClick={() => setEditingService({ id: "", title: "", description: "", icon: "CodeBracketIcon", tags: [] })}
                    className="bg-white text-neutral-950 hover:bg-neutral-200 font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors w-full sm:w-auto"
                >
                    <PlusIcon className="w-4 h-4" />
                    Add New Service
                </button>
            </div>

            <div className="space-y-4">
                {services.map((service) => (
                    <div key={service.id} className="bg-neutral-950/50 border border-neutral-800 rounded-xl p-5 flex items-center justify-between group">
                        <div className="flex items-start gap-5">
                            <div className="w-12 h-12 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                                <span className="text-xs text-neutral-500 font-mono rotate-[-45deg]">{service.icon.replace('Icon', '')}</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-white tracking-tight">{service.title}</h3>
                                <p className="text-sm text-neutral-500 mt-1 line-clamp-1">{service.description}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setEditingService(service)} className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-emerald-400 transition-colors">
                                <PencilIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Global Tech Stack Section */}
            <div className="mt-16 pt-16 border-t border-neutral-800">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Global Tech Stack</h2>
                        <p className="text-sm text-neutral-500">The technologies displayed in your Services footer.</p>
                    </div>
                </div>

                <div className="bg-neutral-950/30 border border-neutral-800 rounded-2xl p-4 sm:p-6">
                    <div className="flex flex-wrap gap-3 mb-8">
                        {fullConfig?.techStack?.map((tech: string, index: number) => {
                            const icon = getTechIcon(tech);
                            return (
                                <div key={`${tech}-${index}`} className="flex items-center gap-3 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-full group">
                                    {icon && (
                                        <img
                                            src={icon}
                                            alt=""
                                            className="w-4 h-4 object-contain"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "/tech-stack/Devicon.png";
                                            }}
                                        />
                                    )}
                                    <span className="text-sm font-medium text-white">{tech}</span>
                                    <button
                                        onClick={() => {
                                            const newStack = fullConfig.techStack.filter((_: any, i: number) => i !== index);
                                            saveFullConfig({ ...fullConfig, techStack: newStack });
                                        }}
                                        className="text-neutral-500 hover:text-red-400 p-1"
                                    >
                                        <PlusIcon className="w-3 h-3 rotate-45" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            id="new-tech-input"
                            type="text"
                            placeholder="Add technology (e.g. Docker)..."
                            className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-emerald-500"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const val = (e.target as HTMLInputElement).value.trim();
                                    if (val) {
                                        const newStack = [...(fullConfig.techStack || []), val];
                                        saveFullConfig({ ...fullConfig, techStack: newStack });
                                        (e.target as HTMLInputElement).value = "";
                                    }
                                }
                            }}
                        />
                        <button
                            onClick={() => {
                                const input = document.getElementById('new-tech-input') as HTMLInputElement;
                                const val = input.value.trim();
                                if (val) {
                                    const newStack = [...(fullConfig.techStack || []), val];
                                    saveFullConfig({ ...fullConfig, techStack: newStack });
                                    input.value = "";
                                }
                            }}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 sm:py-0 rounded-xl text-sm transition-colors"
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { PlusIcon, PencilIcon, TrashIcon, ArrowPathIcon, PhotoIcon } from "@heroicons/react/24/outline";

type Work = {
    id: string;
    title: string;
    category: string;
    description: string;
    year: string;
    tech: string[];
    image: string;
    url?: string;
    order?: number;
};

export default function WorksManager() {
    const [works, setWorks] = useState<Work[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [fetchingOg, setFetchingOg] = useState(false);

    // Quick and dirty editing state
    const [editingWork, setEditingWork] = useState<Work | null>(null);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    useEffect(() => {
        fetchWorks();
    }, []);

    const fetchWorks = async () => {
        try {
            const res = await fetch("/api/admin/works");
            const data = await res.json();
            const loadedWorks: Work[] = data || [];
            
            // Sort by order ascending if order exists, otherwise default to year desc / id desc
            const sorted = [...loadedWorks].sort((a, b) => {
                if (a.order !== undefined && b.order !== undefined) {
                    return a.order - b.order;
                }
                const yearDiff = parseInt(b.year || "0") - parseInt(a.year || "0");
                if (yearDiff !== 0) return yearDiff;
                return parseInt(b.id || "0") - parseInt(a.id || "0");
            });

            setWorks(sorted);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleMove = async (work: Work, direction: number) => {
        const index = works.findIndex(w => w.id === work.id);
        if (index === -1) return;

        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= works.length) return;

        const newWorks = [...works];
        const temp = newWorks[index];
        newWorks[index] = newWorks[newIndex];
        newWorks[newIndex] = temp;

        // Reassign clean index-based order
        const updatedWorks = newWorks.map((w, idx) => ({
            ...w,
            order: idx
        }));

        setWorks(updatedWorks);

        try {
            const itemA = updatedWorks[index];
            const itemB = updatedWorks[newIndex];

            await Promise.all([
                fetch("/api/admin/works", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(itemA)
                }),
                fetch("/api/admin/works", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(itemB)
                })
            ]);
        } catch (error) {
            console.error("Failed to save new order", error);
        }
    };

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
    };

    const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === targetIndex) return;

        const newWorks = [...works];
        const draggedItem = newWorks[draggedIndex];
        
        newWorks.splice(draggedIndex, 1);
        newWorks.splice(targetIndex, 0, draggedItem);

        const updatedWorks = newWorks.map((w, idx) => ({
            ...w,
            order: idx
        }));

        setWorks(updatedWorks);

        try {
            await Promise.all(
                updatedWorks.map(w => 
                    fetch("/api/admin/works", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(w)
                    })
                )
            );
        } catch (error) {
            console.error("Failed to save new order after drag and drop", error);
        }
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !editingWork) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok && data.url) {
                setEditingWork({ ...editingWork, image: data.url });
            } else {
                alert(`Upload failed: ${data.error || res.statusText || "No URL returned"}`);
            }
        } catch (error: any) {
            console.error("Upload failed", error);
            alert(`Upload failed: ${error.message || error}`);
        } finally {
            setUploading(false);
        }
    };

    const handleAutoFetchOgImage = async () => {
        if (!editingWork || !editingWork.url) return;
        
        setFetchingOg(true);
        try {
            const res = await fetch("/api/admin/fetch-og", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: editingWork.url }),
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok && data.imageUrl) {
                setEditingWork({ ...editingWork, image: data.imageUrl });
            } else {
                alert(`Fetch failed: ${data.error || res.statusText || "No image found"}`);
            }
        } catch (error: any) {
            console.error("Fetch OG failed", error);
            alert(`Failed to fetch OG image: ${error.message || error}`);
        } finally {
            setFetchingOg(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingWork) return;
        setSaving(true);

        try {
            const res = await fetch("/api/admin/works", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingWork)
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                setEditingWork(null);
                fetchWorks(); // Reload to get fresh data
            } else {
                alert(`Failed to save: ${data.error || res.statusText}`);
            }
        } catch (error: any) {
            console.error("Failed to save", error);
            alert(`Failed to save: ${error.message || error}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="animate-pulse text-emerald-500">Loading works...</div>;

    if (editingWork) {
        return (
            <div>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white">{editingWork.id ? 'Edit Work' : 'New Work'}</h2>
                    <button onClick={() => setEditingWork(null)} className="text-neutral-400 hover:text-white px-4 py-2">Cancel</button>
                </div>

                <form onSubmit={handleSave} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Image Upload Area */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-2">Project Image</label>
                            <div className="relative group">
                                <div className="aspect-[16/10] bg-neutral-950 border-2 border-dashed border-neutral-800 rounded-2xl overflow-hidden flex items-center justify-center relative transition-colors hover:border-emerald-500/50">
                                    {editingWork.image ? (
                                        <img src={editingWork.image} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center">
                                            <PhotoIcon className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
                                            <p className="text-xs text-neutral-500">No image selected</p>
                                        </div>
                                    )}

                                    {uploading && (
                                        <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center">
                                            <ArrowPathIcon className="w-8 h-8 text-emerald-500 animate-spin" />
                                        </div>
                                    )}

                                    <label className="absolute inset-0 cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900/60 backdrop-blur-[2px]">
                                        <span className="bg-white text-neutral-900 px-4 py-2 rounded-full font-bold text-xs shadow-xl">
                                            {editingWork.image ? 'Change Image' : 'Upload Image'}
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>
                            
                            <div className="mt-3">
                                <button
                                    type="button"
                                    onClick={handleAutoFetchOgImage}
                                    disabled={fetchingOg || !editingWork.url}
                                    className="w-full bg-neutral-900 text-white dark:bg-neutral-800 dark:text-neutral-150 hover:bg-neutral-800 dark:hover:bg-neutral-700 disabled:opacity-40 border border-neutral-800 rounded-xl text-xs font-bold py-2.5 px-4 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                                >
                                    {fetchingOg ? (
                                        <>
                                            <ArrowPathIcon className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                                            Fetching OG Image...
                                        </>
                                    ) : (
                                        <>
                                            <ArrowPathIcon className="w-3.5 h-3.5 text-neutral-450" />
                                            Auto-Fetch Image
                                        </>
                                    )}
                                </button>
                                <p className="text-[10px] text-neutral-500 mt-1.5 leading-normal">
                                    {!editingWork.url ? "⚠️ Enter a Project URL below to enable auto-fetching." : "Automatically loads the website's Open Graph image metadata."}
                                </p>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Title</label>
                                    <input required type="text" value={editingWork.title} onChange={e => setEditingWork({ ...editingWork, title: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Category</label>
                                    <input required type="text" value={editingWork.category} onChange={e => setEditingWork({ ...editingWork, category: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Year</label>
                                    <input required type="text" value={editingWork.year} onChange={e => setEditingWork({ ...editingWork, year: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Tech Stack</label>
                                    <input required type="text" value={editingWork.tech.join(", ")} onChange={e => setEditingWork({ ...editingWork, tech: e.target.value.split(",").map(s => s.trim()) })} placeholder="React, Node.js..." className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Project URL</label>
                        <input type="url" value={editingWork.url || ""} onChange={e => setEditingWork({ ...editingWork, url: e.target.value })} placeholder="https://example.com" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Description</label>
                        <textarea required rows={3} value={editingWork.description} onChange={e => setEditingWork({ ...editingWork, description: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
                    </div>

                    <button disabled={saving || uploading} type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 mt-8 disabled:opacity-50">
                        {saving ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : null}
                        Save Work
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Portfolio Works</h2>
                    <p className="text-sm text-neutral-500">Manage the projects displayed on your portfolio.</p>
                </div>
                <button
                    onClick={() => setEditingWork({ id: "", title: "", category: "", description: "", year: new Date().getFullYear().toString(), tech: [], image: "", url: "", order: works.length })}
                    className="bg-white text-neutral-950 hover:bg-neutral-200 font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors w-full sm:w-auto"
                >
                    <PlusIcon className="w-4 h-4" />
                    Add New Project
                </button>
            </div>

            <div className="space-y-4">
                {works.map((work, index) => (
                    <div
                        key={work.id}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        onDrop={(e) => handleDrop(e, index)}
                        className={`bg-neutral-950/50 border rounded-xl p-5 flex items-center justify-between group transition-all duration-200 select-none ${
                            draggedIndex === index 
                                ? "opacity-30 border-dashed border-emerald-500 bg-neutral-900/80" 
                                : "border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/10"
                        }`}
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 flex-1 w-full overflow-hidden">
                            {/* Drag Grip Handle */}
                            <div className="hidden sm:flex items-center justify-center shrink-0 cursor-grab active:cursor-grabbing text-neutral-600 group-hover:text-neutral-450 select-none">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                    <path d="M7 2a2 2 0 11.001 3.999A2 2 0 017 2zm6 0a2 2 0 11.001 3.999A2 2 0 0113 2zM7 8a2 2 0 11.001 3.999A2 2 0 017 8zm6 0a2 2 0 11.001 3.999A2 2 0 0113 8zm-6 6a2 2 0 11.001 3.999A2 2 0 017 14zm6 0a2 2 0 11.001 3.999A2 2 0 0113 14z" />
                                </svg>
                            </div>
                            
                            {work.image ? (
                                <img src={work.image} alt="" className="w-full sm:w-16 h-32 sm:h-12 object-cover rounded bg-neutral-900 border border-neutral-800 shrink-0 pointer-events-none" />
                            ) : (
                                <div className="w-full sm:w-16 h-32 sm:h-12 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                                     <PhotoIcon className="w-5 h-5 text-neutral-600" />
                                </div>
                            )}
                            <div className="min-w-0">
                                <h3 className="font-bold text-white tracking-tight truncate">{work.title}</h3>
                                <div className="text-xs text-neutral-500 mt-1 flex gap-2">
                                    <span>{work.category}</span> • <span>{work.year}</span>
                                    {work.url && <span>• <a href={work.url} target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline" onClick={e => e.stopPropagation()}>Link ↗</a></span>}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleMove(work, -1)}
                                disabled={index === 0}
                                className="p-2 hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none rounded-lg text-neutral-500 hover:text-white transition-colors cursor-pointer"
                                title="Move Up"
                            >
                                ▲
                            </button>
                            <button
                                onClick={() => handleMove(work, 1)}
                                disabled={index === works.length - 1}
                                className="p-2 hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none rounded-lg text-neutral-500 hover:text-white transition-colors cursor-pointer"
                                title="Move Down"
                            >
                                ▼
                            </button>
                            <button onClick={() => setEditingWork(work)} className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-emerald-400 transition-colors cursor-pointer">
                                <PencilIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {works.length === 0 && (
                    <div className="text-center py-12 border border-dashed border-neutral-800 rounded-xl">
                        <p className="text-neutral-500 text-sm">No works found. Add one to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

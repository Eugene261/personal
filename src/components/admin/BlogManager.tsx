"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type PostMetadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
};

type ListedPost = { slug: string; metadata: PostMetadata };

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function BlogManager() {
  const [posts, setPosts] = useState<ListedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [mode, setMode] = useState<"list" | "edit" | "create">("list");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [publishedAt, setPublishedAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [summary, setSummary] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");

  const canSave = useMemo(() => {
    return title.trim() && publishedAt.trim() && summary.trim();
  }, [title, publishedAt, summary]);

  async function fetchList() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/blog", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(Array.isArray(data?.posts) ? data.posts : []);
    } catch (e: any) {
      setError(e?.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }

  async function openEdit(targetSlug: string) {
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/blog/${encodeURIComponent(targetSlug)}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to load post");
      const data = await res.json();
      setActiveSlug(targetSlug);
      setMode("edit");
      setTitle(data?.metadata?.title ?? "");
      setSlug(targetSlug);
      setPublishedAt(data?.metadata?.publishedAt ?? "");
      setSummary(data?.metadata?.summary ?? "");
      setImage(data?.metadata?.image ?? "");
      setContent(data?.content ?? "");
    } catch (e: any) {
      setError(e?.message || "Failed to load post");
    } finally {
      setSaving(false);
    }
  }

  function openCreate() {
    setError(null);
    setMode("create");
    setActiveSlug(null);
    setTitle("");
    setSlug("");
    setPublishedAt(new Date().toISOString().slice(0, 10));
    setSummary("");
    setImage("");
    setContent("");
  }

  async function saveCreate() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: slug.trim() || slugify(title),
          publishedAt,
          summary,
          image: image.trim() || undefined,
          content,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to create post");
      await fetchList();
      await openEdit(data.slug);
    } catch (e: any) {
      setError(e?.message || "Failed to create post");
    } finally {
      setSaving(false);
    }
  }

  async function saveUpdate() {
    if (!activeSlug) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/blog/${encodeURIComponent(activeSlug)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          publishedAt,
          summary,
          image: image.trim() || undefined,
          content,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to update post");
      await fetchList();
    } catch (e: any) {
      setError(e?.message || "Failed to update post");
    } finally {
      setSaving(false);
    }
  }

  async function deletePost(targetSlug: string) {
    const ok = window.confirm(`Delete "${targetSlug}"? This cannot be undone.`);
    if (!ok) return;

    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/blog/${encodeURIComponent(targetSlug)}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to delete post");
      await fetchList();
      setMode("list");
      setActiveSlug(null);
    } catch (e: any) {
      setError(e?.message || "Failed to delete post");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    fetchList();
  }, []);

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) =>
      new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt) ? -1 : 1
    );
  }, [posts]);

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tighter">Blog</h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Create and edit MDX posts.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-md bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black px-3 py-2 text-sm font-medium"
        >
          New post
        </button>
      </div>

      {error ? (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300 p-3 text-sm">
          {error}
        </div>
      ) : null}

      {loading ? (
        <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-400">Loading…</p>
      ) : null}

      {mode === "list" ? (
        <div className="mt-6 space-y-3">
          {sortedPosts.map((p) => (
            <div
              key={p.slug}
              className="flex items-start justify-between gap-4 rounded-md border border-neutral-200 dark:border-neutral-800 p-3"
            >
              <div className="min-w-0">
                <p className="font-medium tracking-tight truncate">{p.metadata.title}</p>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                  {p.metadata.publishedAt} · <span className="font-mono">{p.slug}</span>
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/blog/${p.slug}`}
                  target="_blank"
                  className="text-sm underline underline-offset-4"
                >
                  View
                </Link>
                <button
                  onClick={() => openEdit(p.slug)}
                  className="text-sm underline underline-offset-4"
                  disabled={saving}
                >
                  Edit
                </button>
                <button
                  onClick={() => deletePost(p.slug)}
                  className="text-sm text-red-600 dark:text-red-400 underline underline-offset-4"
                  disabled={saving}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {sortedPosts.length === 0 ? (
            <div className="mt-6 rounded-md border border-dashed border-neutral-200 dark:border-neutral-800 p-6 text-sm text-neutral-600 dark:text-neutral-400">
              No posts yet. Click “New post”.
            </div>
          ) : null}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div>
            <label className="block text-sm font-medium">Content (MDX)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={18}
              className="mt-2 w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-transparent px-3 py-2 font-mono text-sm"
              placeholder="Write MDX here…"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (mode === "create" && !slug.trim()) {
                    setSlug(slugify(e.target.value));
                  }
                }}
                className="mt-2 w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-transparent px-3 py-2 text-sm"
              />
            </div>

            {mode === "create" ? (
              <div>
                <label className="block text-sm font-medium">Slug</label>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="mt-2 w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-transparent px-3 py-2 text-sm font-mono"
                  placeholder="my-post"
                />
                <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                  Used for the URL: <span className="font-mono">/blog/&lt;slug&gt;</span>
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium">Slug</label>
                <p className="mt-2 text-sm font-mono text-neutral-600 dark:text-neutral-400">
                  {activeSlug}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium">Published date</label>
              <input
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="mt-2 w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-transparent px-3 py-2 text-sm font-mono"
                placeholder="YYYY-MM-DD"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Summary</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                className="mt-2 w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-transparent px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">OG image (optional)</label>
              <input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="mt-2 w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-transparent px-3 py-2 text-sm"
                placeholder="/og?title=..."
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  setMode("list");
                  setActiveSlug(null);
                }}
                className="rounded-md border border-neutral-200 dark:border-neutral-800 px-3 py-2 text-sm"
                disabled={saving}
              >
                Back
              </button>
              <button
                onClick={mode === "create" ? saveCreate : saveUpdate}
                className="rounded-md bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black px-3 py-2 text-sm font-medium disabled:opacity-50"
                disabled={saving || !canSave}
              >
                {saving ? "Saving…" : "Save"}
              </button>
              {activeSlug ? (
                <Link
                  href={`/blog/${activeSlug}`}
                  target="_blank"
                  className="ml-auto text-sm underline underline-offset-4"
                >
                  View post
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


"use client";

import { useState, useEffect } from "react";
import { ArrowPathIcon, TrashIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

export default function ContactsManager() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/admin/contacts");
      if (res.ok) {
        const data = await res.json();
        setMessages(data || []);
      }
    } catch (error) {
      console.error("Failed to load messages", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    setDeletingId(id);
    try {
      const res = await fetch("/api/admin/contacts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
      } else {
        const data = await res.json().catch(() => ({}));
        alert(`Delete failed: ${data.error || res.statusText}`);
      }
    } catch (error: any) {
      console.error("Delete error:", error);
      alert(`Delete failed: ${error.message || error}`);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  if (loading) return <div className="animate-pulse text-emerald-500">Loading messages...</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Visitor Messages</h2>
          <p className="text-sm text-neutral-500">View and manage contact submissions from your portfolio site.</p>
        </div>
      </div>

      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="bg-neutral-950/50 border border-neutral-800 rounded-xl p-5 flex flex-col md:flex-row justify-between gap-4 group hover:border-neutral-700 hover:bg-neutral-900/10 transition-all duration-200"
          >
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white tracking-tight">{msg.name}</span>
                  <span className="text-neutral-500">•</span>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-sm text-emerald-500 hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    <EnvelopeIcon className="w-3.5 h-3.5" />
                    {msg.email}
                  </a>
                </div>
                <span className="text-xs text-neutral-500 font-mono">
                  {formatDate(msg.createdAt)}
                </span>
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap bg-neutral-950/30 p-4 border border-neutral-900 rounded-lg">
                {msg.message}
              </p>
            </div>
            
            <div className="flex items-start md:items-center shrink-0">
              <button
                disabled={deletingId === msg.id}
                onClick={() => handleDelete(msg.id)}
                className="p-2 bg-neutral-900 hover:bg-red-950/30 text-neutral-500 hover:text-red-400 border border-neutral-800 hover:border-red-900/50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                title="Delete message"
              >
                {deletingId === msg.id ? (
                  <ArrowPathIcon className="w-4 h-4 animate-spin" />
                ) : (
                  <TrashIcon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-16 border border-dashed border-neutral-800 rounded-2xl bg-neutral-950/10">
            <EnvelopeIcon className="w-8 h-8 text-neutral-700 mx-auto mb-3" />
            <p className="text-neutral-500 text-sm">No messages found. Submissions will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

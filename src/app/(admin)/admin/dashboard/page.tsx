"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftOnRectangleIcon,
  BriefcaseIcon,
  WrenchScrewdriverIcon,
  UserIcon,
  PencilSquareIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import WorksManager from "@/components/admin/WorksManager";
import ServicesManager from "@/components/admin/ServicesManager";
import AboutManager from "@/components/admin/AboutManager";
import BlogManager from "@/components/admin/BlogManager";
import ContactsManager from "@/components/admin/ContactsManager";

type Tab = "works" | "services" | "about" | "blog" | "contacts";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("works");
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin");
    router.refresh();
  };

  const tabs: Array<{ id: Tab; label: string; icon: React.ReactNode }> = [
    { id: "works", label: "Works", icon: <BriefcaseIcon className="h-4 w-4" /> },
    { id: "services", label: "Services", icon: <WrenchScrewdriverIcon className="h-4 w-4" /> },
    { id: "about", label: "About", icon: <UserIcon className="h-4 w-4" /> },
    { id: "blog", label: "Blog", icon: <PencilSquareIcon className="h-4 w-4" /> },
    { id: "contacts", label: "Messages", icon: <ChatBubbleLeftRightIcon className="h-4 w-4" /> },
  ];

  return (
    <div>
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tighter">Admin</h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Manage portfolio content.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-md border border-neutral-200 dark:border-neutral-800 px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900"
        >
          <ArrowLeftOnRectangleIcon className="h-4 w-4" />
          Log out
        </button>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={[
                "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm whitespace-nowrap",
                activeTab === t.id
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black"
                  : "border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900",
              ].join(" ")}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </nav>

        <section className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6">
          {activeTab === "works" ? <WorksManager /> : null}
          {activeTab === "services" ? <ServicesManager /> : null}
          {activeTab === "about" ? <AboutManager /> : null}
          {activeTab === "blog" ? <BlogManager /> : null}
          {activeTab === "contacts" ? <ContactsManager /> : null}
        </section>
      </div>
    </div>
  );
}


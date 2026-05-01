"use client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-black dark:text-neutral-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">{children}</div>
    </div>
  );
}


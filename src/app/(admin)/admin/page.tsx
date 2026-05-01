"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockClosedIcon, ShieldExclamationIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black">
            <LockClosedIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Admin</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Enter your password to continue.
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="mt-6 space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(false);
            }}
            placeholder="Password"
            className={[
              "w-full rounded-md border bg-transparent px-3 py-2 text-sm",
              error ? "border-red-500" : "border-neutral-200 dark:border-neutral-800",
              "focus:outline-none focus:ring-2 focus:ring-neutral-400/30",
            ].join(" ")}
            autoFocus
          />
          {error ? (
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
              <ShieldExclamationIcon className="h-4 w-4" />
              Authentication failed
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black px-3 py-2 text-sm font-medium disabled:opacity-50"
          >
            {loading ? (
              <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white dark:border-black/20 dark:border-t-black animate-spin" />
            ) : (
              <ArrowRightIcon className="h-4 w-4" />
            )}
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}


import Link from "next/link";
import Footer from "../components/footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="antialiased max-w-xl mx-4 mt-8 lg:mx-auto">
      <header className="no-print mb-16 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="font-serif text-lg tracking-tight font-medium hover:opacity-75 transition-opacity">
          Eugene Opoku
        </Link>
        <nav className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-xs font-mono text-neutral-500 dark:text-neutral-400">
          <Link href="/work" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
            work
          </Link>
          <Link href="/services" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
            services
          </Link>
          <Link href="/blog" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
            blog
          </Link>
          <Link href="/about" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
            about
          </Link>
          <Link href="/resume" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
            resume
          </Link>
          <Link href="/contact" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
            contact
          </Link>
        </nav>
      </header>
      <main className="flex-auto min-w-0 flex flex-col px-2 md:px-0">
        {children}
        <div className="no-print">
          <Footer />
        </div>
      </main>
    </div>
  );
}



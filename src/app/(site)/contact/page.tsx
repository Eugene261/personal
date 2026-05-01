import Link from "next/link";

export const metadata = {
  title: "Contact",
  description: "Get in touch.",
};

export default function ContactPage() {
  const email = "eugeneopoku74@gmail.com";

  return (
    <section>
      <h1 className="title text-2xl font-semibold tracking-tighter">Contact</h1>
      <p className="mt-4 text-neutral-700 dark:text-neutral-300">
        The fastest way to reach me is email.
      </p>

      <div className="mt-8 space-y-3">
        <a
          className="inline-flex items-center rounded-md bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black px-3 py-1.5 text-sm font-medium"
          href={`mailto:${email}`}
        >
          {email}
        </a>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Or browse the blog on{" "}
          <Link className="underline underline-offset-4" href="/blog">
            /blog
          </Link>
          .
        </p>
      </div>
    </section>
  );
}


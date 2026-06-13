import ContactChat from "@/components/ContactChat";

export const metadata = {
  title: "Contact",
  description: "Get in touch.",
};

export default function ContactPage() {
  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="title text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 lowercase">
          contact
        </h1>
        <p className="text-xs font-mono text-neutral-400 dark:text-neutral-500 mt-1 uppercase tracking-widest">
          Let&apos;s build something fun
        </p>
      </div>

      <ContactChat />
    </section>
  );
}

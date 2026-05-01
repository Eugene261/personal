"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bars2Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navItems = [
    { name: "Home", href: "/#home" },
    { name: "Services", href: "/#services" },
    { name: "Work", href: "/#work" },
    { name: "About", href: "/#about" },
    { name: "Contact", href: "/#contact" },
];

export default function Navbar() {
    const [active, setActive] = useState("Home");
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        const observerOptions = {
            root: null,
            rootMargin: "-20% 0px -70% 0px",
            threshold: 0,
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute("id");
                    const item = navItems.find((nav) => nav.href === `#${id}`);
                    if (item) setActive(item.name);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        const sections = ["home", "services", "work", "about", "contact"];
        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            observer.disconnect();
        };
    }, []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [mobileMenuOpen]);

    return (
        <>
            {/* Desktop Navbar */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden sm:block">
                <div className={`
        flex items-center gap-1 p-1.5 rounded-full border border-neutral-200/50 
        transition-all duration-300 ease-in-out
        ${scrolled ? "bg-white/70 backdrop-blur-md shadow-sm border-neutral-200" : "bg-white/40 backdrop-blur-sm"}
      `}>
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setActive(item.name)}
                            className={`
              px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
              ${active === item.name
                                    ? "bg-neutral-900 text-white shadow-sm"
                                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/50"}
            `}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            </nav>

            {/* Mobile Navbar Button (Floating Top Right) */}
            <div className="fixed top-6 right-6 z-[60] sm:hidden">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className={`p-3 rounded-full border transition-all duration-300 ${scrolled || mobileMenuOpen ? "bg-white/80 backdrop-blur-md border-neutral-200 shadow-sm text-neutral-900" : "bg-white/40 backdrop-blur-sm border-neutral-200/50 text-neutral-800"
                        }`}
                    aria-label="Toggle Menu"
                >
                    {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars2Icon className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            <div
                className={`fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 sm:hidden transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Sidebar Panel */}
            <aside
                className={`fixed top-0 right-0 bottom-0 w-[240px] bg-white z-50 sm:hidden flex flex-col pt-24 px-6 shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex flex-col gap-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => {
                                setActive(item.name);
                                setMobileMenuOpen(false);
                            }}
                            className={`
                  text-lg font-bold tracking-tight py-2 transition-colors border-b border-neutral-100 last:border-0
                  ${active === item.name ? "text-[#0c2320]" : "text-neutral-400 hover:text-[#0c2320]"}
                `}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                <div className="mt-auto pb-12">
                    <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-black/20 mb-2">Let's Connect</p>
                    <p className="text-xs font-semibold text-neutral-600">eugeneopoku74@gmail.com</p>
                </div>
            </aside>
        </>
    );
}

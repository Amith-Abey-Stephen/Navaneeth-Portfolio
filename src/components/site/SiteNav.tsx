"use client";

import type { Section, SiteContent } from "@/lib/types";
import { renderableSections } from "@/lib/types";
import { ArrowUpRight } from "lucide-react";
import { motion, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { GoldDot } from "./shared";

const NAV_SECTIONS: Partial<Record<Section["type"], string>> = {
  about: "About",
  experience: "Experience",
  projects: "Projects",
  skills: "Skills",
};

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <a
      href={href}
      aria-current={active ? "true" : undefined}
      className={`group relative py-1 text-sm font-medium transition-colors duration-200 ${
        active ? "text-ink" : "text-muted hover:text-ink"
      }`}
    >
      {label}
      {active ? (
        // Shared underline slides between links as the active section changes.
        <motion.span
          layoutId="nav-active"
          aria-hidden
          className="absolute -bottom-0.5 left-0 h-0.5 w-full rounded-full bg-accent"
          transition={{ type: "spring", stiffness: 400, damping: 34 }}
        />
      ) : (
        <span
          aria-hidden
          className="absolute -bottom-0.5 left-0 h-0.5 w-full origin-left scale-x-0 rounded-full bg-accent/50 transition-transform duration-200 group-hover:scale-x-50"
        />
      )}
    </a>
  );
}

export function SiteNav({ content }: { content: SiteContent }) {
  const links = renderableSections(content)
    .filter((s) => NAV_SECTIONS[s.type])
    .map((s) => ({ href: `#${s.type}`, label: NAV_SECTIONS[s.type]! }));

  const firstName = content.hero.name.trim().split(/\s+/)[0] || "Portfolio";
  const [active, setActive] = useState<string>("");
  const sectionIds = [...links.map((l) => l.href.slice(1)), "contact"].join(",");

  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    sectionIds.split(",").forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [sectionIds]);

  return (
    <>
      {/* The brass measure: scroll progress as a hairline of light at the top edge. */}
      <motion.span
        aria-hidden
        className="fixed top-0 left-0 z-50 h-[2px] w-full origin-left bg-accent/80"
        style={{ scaleX: scrollYProgress }}
      />
      {/* Floating glass capsule, detached from the top like a pane resting above the page. */}
      <header className="sticky top-3 z-40 px-3 sm:top-5 sm:px-6">
        <div className="glass mx-auto flex h-14 max-w-5xl items-center justify-between !rounded-full pr-2 pl-5 sm:pl-7">
          <a href="#top" className="font-display text-lg font-semibold tracking-tight">
            <GoldDot text={firstName} />
          </a>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Sections">
            {links.map((l) => (
              <NavLink key={l.href} href={l.href} label={l.label} active={active === l.href.slice(1)} />
            ))}
            <NavLink href="#contact" label="Contact" active={active === "contact"} />
          </nav>
          {content.contact.resumeUrl ? (
            <a
              href={content.contact.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-chip inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-ink transition-[filter,transform] duration-200 hover:brightness-125 active:scale-[0.98]"
            >
              Resume
              <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
            </a>
          ) : (
            <a
              href="#contact"
              className="glass-chip inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-ink transition-[filter,transform] duration-200 hover:brightness-125 active:scale-[0.98]"
            >
              Contact
            </a>
          )}
        </div>
      </header>
    </>
  );
}

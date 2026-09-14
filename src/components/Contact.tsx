"use client";

import { useState, type ReactNode } from "react";
import { ArrowRight, Check, Copy, Mail } from "lucide-react";
import type { ContactInfo } from "@/lib/types";
import { GridLines, LinkedInIcon, ScrollReveal } from "./ui";

/**
 * Contact is a shared value, not a section the owner toggles: it always
 * closes the page. Two ways in — email and LinkedIn — both read from the
 * same ContactInfo the hero, nav and footer use. The address itself is
 * shown once (tap to copy); the channel cells are the actions. Anything
 * without a value (LinkedIn) simply doesn't render — nothing is invented,
 * and the phone number is never shown.
 */
export function Contact({ contact }: { contact: ContactInfo }) {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  const linkedin = contact.linkedinUrl?.trim() || null;

  const channels: {
    key: string;
    label: string;
    action: string;
    href: string;
    icon: ReactNode;
    external?: boolean;
  }[] = [
    {
      key: "email",
      label: "Email",
      action: "Send an email",
      href: `mailto:${contact.email}`,
      icon: <Mail size={20} aria-hidden />,
    },
  ];
  if (linkedin) {
    channels.push({
      key: "linkedin",
      label: "LinkedIn",
      action: "Visit LinkedIn",
      href: linkedin,
      icon: <LinkedInIcon size={19} />,
      external: true,
    });
  }

  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden bg-transparent">
      <GridLines />
      <h2 className="sr-only">Contact</h2>
      <p
        aria-hidden
        className="ghost-huge relative mt-6 overflow-hidden px-4 text-center text-[22vw] sm:text-[24vw] md:text-[13vw]"
      >
        Contact
      </p>

      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-8 px-5 pb-14 sm:px-6 md:gap-12 md:px-12 md:pb-16 lg:grid-cols-[1fr_1.2fr]">
        {/* left — the address, once */}
        <div className="min-w-0">
          <ScrollReveal>
            <p className="font-heading text-[15px] text-white/80 sm:text-[16px]">Reach me out here:</p>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <button
              onClick={copyEmail}
              aria-label={copied ? "Email copied" : `Copy ${contact.email}`}
              className="mt-4 flex min-h-[44px] max-w-full items-center gap-2.5 break-all text-left font-heading text-[17px] font-semibold text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white active:decoration-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:text-[18px] md:text-[22px]"
            >
              {copied ? (
                <Check size={18} className="shrink-0 text-green-400" aria-hidden />
              ) : (
                <Copy size={17} className="shrink-0 text-white/50" aria-hidden />
              )}
              <span className="min-w-0">{copied ? "Copied!" : contact.email}</span>
            </button>
            <p aria-live="polite" className="sr-only">
              {copied ? "Email copied" : ""}
            </p>
          </ScrollReveal>
        </div>

        {/* channel cells — the bordered cell grid; borders stay correct for
            any number of cells (last column/row edges are clipped away).
            Stacked on phones, side by side from sm. */}
        <ScrollReveal delay={0.1} className="min-w-0 self-start">
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div
              className={`-mb-px -mr-px grid grid-cols-1 ${channels.length > 1 ? "sm:grid-cols-2" : ""}`}
            >
              {channels.map((c) => (
                <a
                  key={c.key}
                  href={c.href}
                  target={c.external ? "_blank" : undefined}
                  rel={c.external ? "noreferrer" : undefined}
                  className="group flex min-h-[84px] items-center gap-4 border-b border-r border-white/10 px-4 py-4 font-heading transition-colors hover:bg-white/[0.06] active:bg-white/[0.08] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white sm:px-5 md:min-h-[96px] md:px-6"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/[0.08] text-white">
                    {c.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-medium text-white sm:text-[17px]">
                      {c.label}
                    </span>
                    <span className="mt-0.5 block truncate text-[13px] text-white/55 sm:text-[14px]">
                      {c.action}
                    </span>
                  </span>
                  <ArrowRight
                    size={18}
                    className="-rotate-45 shrink-0 text-white/80 transition-transform duration-300 group-hover:rotate-0"
                    aria-hidden
                  />
                  {c.external && <span className="sr-only"> (opens in a new tab)</span>}
                </a>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

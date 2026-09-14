"use client";

import { useState } from "react";
import { ArrowRight, Copy, Check, Mail } from "lucide-react";
import type { ContactInfo } from "@/lib/types";
import { telHref } from "@/lib/format";
import { GridLines, ScrollReveal, MagneticButton } from "./ui";

/**
 * Contact is a shared value, not a section the owner toggles: it always
 * closes the page, and every channel shown here is read from the same
 * ContactInfo the hero, nav and footer use. Channels without a value
 * (LinkedIn, resume) simply don't render — nothing is invented.
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

  const channels = [
    { label: "Email", href: `mailto:${contact.email}` },
    contact.phone ? { label: "Phone", href: telHref(contact.phone) } : null,
    contact.linkedinUrl ? { label: "LinkedIn", href: contact.linkedinUrl, external: true } : null,
    contact.resumeUrl ? { label: "Resume", href: contact.resumeUrl, external: true } : null,
  ].filter((c): c is { label: string; href: string; external?: boolean } => Boolean(c));

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

      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-10 px-5 pb-14 sm:px-6 md:gap-12 md:px-12 md:pb-16 lg:grid-cols-[1fr_1.2fr]">
        {/* left */}
        <div className="min-w-0">
          <ScrollReveal>
            <p className="font-heading text-[15px] text-white/80 sm:text-[16px]">Reach me out here:</p>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <button
              onClick={copyEmail}
              className="mt-4 flex min-h-[44px] max-w-full items-center gap-2 break-all text-left font-heading text-[15px] font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:text-[16px] md:text-[19px]"
            >
              {copied ? (
                <Check size={17} className="shrink-0 text-green-400" aria-hidden />
              ) : (
                <Copy size={16} className="shrink-0 text-white/50" aria-hidden />
              )}
              <span className="min-w-0">{copied ? "Copied!" : contact.email}</span>
            </button>
            <p aria-live="polite" className="sr-only">
              {copied ? "Email copied" : ""}
            </p>
          </ScrollReveal>
          {contact.phone && (
            <ScrollReveal delay={0.12}>
              <a
                href={telHref(contact.phone)}
                className="mt-4 block break-words font-heading text-[19px] font-bold text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:text-[20px] md:mt-5 md:text-[24px]"
              >
                {contact.phone}
              </a>
            </ScrollReveal>
          )}

          <ScrollReveal delay={0.2}>
            <MagneticButton
              href={`mailto:${contact.email}`}
              className="mt-7 inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-xl bg-[#1c1c1e] px-6 py-4 font-heading text-[15px] font-medium transition-colors hover:bg-[#2a2a2e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-[16px] md:mt-8"
            >
              <Mail size={17} className="shrink-0 text-orange-300" aria-hidden /> Email me
            </MagneticButton>
          </ScrollReveal>
        </div>

        {/* channel strip — the bordered cell grid; borders stay correct for
            any number of cells (last column/row edges are clipped away) */}
        <ScrollReveal delay={0.1} className="min-w-0 self-start">
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="-mb-px -mr-px grid grid-cols-2">
              {channels.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.external ? "_blank" : undefined}
                  rel={c.external ? "noreferrer" : undefined}
                  className="group flex min-h-[64px] items-center justify-between gap-2 border-b border-r border-white/10 px-4 py-4 font-heading text-[14px] text-white/85 transition-colors hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white sm:px-5 sm:text-[15px]"
                >
                  {c.label}
                  <ArrowRight
                    size={16}
                    className="-rotate-45 shrink-0 transition-transform duration-300 group-hover:rotate-0"
                    aria-hidden
                  />
                </a>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

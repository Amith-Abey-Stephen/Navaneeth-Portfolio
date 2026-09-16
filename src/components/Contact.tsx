"use client";

import { useState, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Check, Copy, FileText } from "lucide-react";
import type { ContactInfo } from "@/lib/types";
import { ButtonIcon, GridLines, LinkedInIcon, MagneticButton, ScrollReveal } from "./ui";

// The hero's primary button, verbatim, so the page's first and last CTA are
// unmistakably the same control.
const PRIMARY_BUTTON =
  "min-h-[52px] items-center justify-center gap-2.5 bg-[#f2eee7] px-6 py-4 text-[15px] font-semibold text-black transition-colors duration-300 group-hover:bg-white group-active:bg-[#e7e1d6] sm:px-7 md:text-[16px]";

type Channel = { key: string; label: string; action: string; href: string; icon: ReactNode };

/**
 * Contact is a shared value, not a section the owner toggles: it always
 * closes the page. One glass card (the Certifications container) under the
 * ghost title: the invitation and the email on the left — a "Send an email"
 * CTA plus the address itself, tap to copy — and the other places to find
 * him on the right, as the bordered cells the rest of the site uses. Every
 * value comes from the same ContactInfo the hero, nav and footer read; a
 * channel without a value (LinkedIn, resume) simply doesn't render, and with
 * neither the card is just the email column. The phone number is never shown.
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
  const resume = contact.resumeUrl?.trim() || null;

  const elsewhere: Channel[] = [];
  if (linkedin) {
    elsewhere.push({
      key: "linkedin",
      label: "LinkedIn",
      action: "Connect on LinkedIn",
      href: linkedin,
      icon: <LinkedInIcon size={19} />,
    });
  }
  if (resume) {
    elsewhere.push({
      key: "resume",
      label: "Resume",
      action: "Open the resume",
      href: resume,
      icon: <FileText size={20} aria-hidden />,
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

      <div className="relative mx-auto max-w-[1240px] px-5 pb-16 sm:px-6 md:px-12 md:pb-20">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/25 backdrop-blur-xl">
            {/* the aurora hairline the journey line and the Experience highlights
                use — this card is the last stop on the same route */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#34ffb5] via-[#a855f7] to-[#ffb03a] opacity-60"
            />
            {/* one warm wash so the glass doesn't sit flat on the canvas */}
            <div
              aria-hidden
              className="pointer-events-none absolute -left-16 -top-24 h-64 w-64 rounded-full bg-[#ff4a1a]/20 blur-[80px] md:h-80 md:w-80 md:blur-[100px]"
            />

            <div
              className={`relative grid grid-cols-1 ${elsewhere.length > 0 ? "lg:grid-cols-[1.15fr_1fr]" : ""}`}
            >
              {/* the invitation and the address */}
              <div className="p-6 sm:p-8 md:p-10 lg:p-12">
                <p className="font-heading text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  Get in touch
                </p>
                <h3 className="mt-3 font-heading text-[clamp(34px,9vw,44px)] font-bold leading-[0.98] tracking-tight text-white md:text-[56px]">
                  Let&apos;s talk.
                </h3>
                <p className="mt-4 max-w-[460px] font-heading text-[15px] font-light leading-[1.6] text-white/70 sm:text-[16px] md:mt-5 md:text-[18px]">
                  Whether it&apos;s a role, a product idea or a quick question — email is the best
                  way to reach me.
                </p>
                <div className="mt-7 grid grid-cols-1 sm:flex md:mt-8">
                  <MagneticButton href={`mailto:${contact.email}`} className={PRIMARY_BUTTON}>
                    Send an email
                    <ButtonIcon hover={{ x: 2, y: -2 }}>
                      <ArrowUpRight size={17} strokeWidth={2.2} />
                    </ButtonIcon>
                  </MagneticButton>
                </div>
                <button
                  onClick={copyEmail}
                  aria-label={copied ? "Email copied" : `Copy ${contact.email}`}
                  className="mt-5 flex min-h-[44px] max-w-full items-center gap-2.5 break-all text-left font-heading text-[15px] font-medium text-white/85 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-white active:decoration-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:text-[16px] md:text-[17px]"
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
              </div>

              {/* elsewhere — the bordered cells; each fills its share of the
                  column so one or two links both read as a deliberate panel */}
              {elsewhere.length > 0 && (
                <div className="flex flex-col border-t border-white/10 lg:border-l lg:border-t-0">
                  {elsewhere.map((c) => (
                    <a
                      key={c.key}
                      href={c.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex min-h-[96px] flex-1 items-center gap-4 border-b border-white/10 px-6 py-5 font-heading transition-colors last:border-b-0 hover:bg-white/[0.06] active:bg-white/[0.08] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white sm:px-8 md:px-10"
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
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

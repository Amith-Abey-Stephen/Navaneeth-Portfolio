"use client";

import { useState } from "react";
import { ArrowRight, Copy, Check, Sparkles } from "lucide-react";
import { site, socials } from "@/data/content";
import { GridLines, ScrollReveal, MagneticButton } from "./ui";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [budget, setBudget] = useState("Select...");

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden bg-transparent">
      <GridLines />
      <h2 aria-hidden className="ghost-huge relative mt-6 overflow-hidden px-4 text-center text-[22vw] sm:text-[24vw] md:text-[13vw]">
        Contact
      </h2>

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
              {copied ? <Check size={17} className="shrink-0 text-green-400" aria-hidden /> : <Copy size={16} className="shrink-0 text-white/50" aria-hidden />}
              <span className="min-w-0">{copied ? "Copied!" : site.email}</span>
            </button>
          </ScrollReveal>
          <ScrollReveal delay={0.12}>
            <a href={site.phoneHref} className="mt-4 block font-heading text-[19px] font-bold text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:text-[20px] md:mt-5 md:text-[24px]">
              {site.phoneDisplay}
            </a>
          </ScrollReveal>

          <ScrollReveal delay={0.16}>
            <p className="mt-7 font-heading text-[18px] font-bold md:mt-8 md:text-[20px]">Follow me here</p>
            <div className="mt-4 flex flex-wrap gap-2.5 sm:gap-3">
              {["IG", "TT", "DR", "BE", "FR"].map((s, i) => (
                <a
                  key={s}
                  href={socials[i % socials.length]?.href ?? "#contact"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s}
                  className={`grid size-11 place-items-center rounded-xl border border-white/10 font-heading text-[13px] font-bold text-white transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    i === 0
                      ? "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400"
                      : i === 1
                        ? "bg-black"
                        : i === 2
                          ? "bg-[#ea4c89]"
                          : "bg-[#1a1a1a]"
                  }`}
                >
                  {s === "FR" ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden>
                      <path d="M4 0h16v4H12v6h6v4h-6v10H8v-6H4V4h4V0zm2 2v2H6v10h2v6h2v-8h6v-2h-4V4h6V2H6z" />
                    </svg>
                  ) : (
                    s
                  )}
                </a>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <MagneticButton
              href={site.contraHref}
              target="_blank"
              className="mt-7 inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-xl bg-[#1c1c1e] px-6 py-4 font-heading text-[15px] font-medium transition-colors hover:bg-[#2a2a2e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-[16px] md:mt-8"
            >
              <Sparkles size={17} className="shrink-0 text-orange-300" aria-hidden /> Hire Me on Contra
            </MagneticButton>
          </ScrollReveal>
        </div>

        {/* form */}
        <ScrollReveal delay={0.1}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
              setTimeout(() => setSent(false), 3000);
            }}
            className="min-w-0 space-y-4 sm:space-y-5"
          >
            <div>
              <label htmlFor="contact-name" className="font-heading text-[14px] text-white/60">Name</label>
              <input
                id="contact-name"
                name="name"
                autoComplete="name"
                required
                placeholder="Rohit"
                className="mt-2 min-h-[52px] w-full rounded-lg border border-white/10 bg-white/[0.07] px-4 py-3.5 font-heading text-[16px] text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="font-heading text-[14px] text-white/60">Email</label>
              <input
                id="contact-email"
                name="email"
                autoComplete="email"
                required
                type="email"
                placeholder="jane@framer.com"
                className="mt-2 min-h-[52px] w-full rounded-lg border border-white/10 bg-white/[0.07] px-4 py-3.5 font-heading text-[16px] text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="font-heading text-[14px] text-white/60">Message</label>
              <textarea
                id="contact-message"
                name="message"
                autoComplete="off"
                required
                rows={4}
                placeholder="I want a service website"
                className="mt-2 min-h-[120px] w-full resize-y rounded-lg border border-white/10 bg-white/[0.07] px-4 py-3.5 font-heading text-[16px] text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="contact-budget" className="font-heading text-[14px] text-white/60">Budget</label>
              <div className="relative mt-2">
                <select
                  id="contact-budget"
                  name="budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="min-h-[52px] w-full appearance-none rounded-lg border border-white/10 bg-white/[0.07] px-4 py-3.5 pr-10 font-heading text-[16px] text-white/80 focus:border-white/30 focus:outline-none [&>option]:bg-black"
                >
                  {["Select...", "$500 – $1k", "$1k – $3k", "$3k – $5k", "$5k+"].map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
                <span aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/50">⌄</span>
              </div>
            </div>
            <button
              type="submit"
              className="min-h-[52px] w-full rounded-lg bg-[#ece8df] py-4 font-heading text-[16px] font-semibold text-black transition-all hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.99]"
            >
              {sent ? "Message sent — I'll reply soon!" : "Submit"}
            </button>
            <p aria-live="polite" className="sr-only">{sent ? "Message sent" : ""}</p>
          </form>
        </ScrollReveal>
      </div>

      {/* social strip */}
      <div className="mx-auto max-w-[1240px] px-5 sm:px-6 md:px-12">
        <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-white/10 md:grid-cols-4">
          {socials.slice(0, 4).map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="group flex min-h-[52px] items-center justify-between gap-2 border-b border-r border-white/10 px-4 py-4 font-heading text-[14px] text-white/85 transition-colors last:border-r-0 hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white sm:px-5 sm:text-[15px] max-md:[&:nth-child(2)]:border-r-0 max-md:[&:nth-child(3)]:border-b-0 max-md:[&:nth-child(4)]:border-b-0 md:border-b-0 md:[&:last-child]:border-r-0"
            >
              {s.label}
              <ArrowRight size={16} className="-rotate-45 shrink-0 transition-transform duration-300 group-hover:rotate-0" aria-hidden />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

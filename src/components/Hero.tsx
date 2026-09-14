"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Mail } from "lucide-react";
import type { ContactInfo, Hero as HeroContent } from "@/lib/types";
import { telHref } from "@/lib/format";
import { GridLines, MagneticButton } from "./ui";
import { LogoStrip, type StripItem } from "./LogoStrip";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero({
  hero,
  contact,
  strip = [],
}: {
  hero: HeroContent;
  contact: ContactInfo;
  strip?: StripItem[];
}) {
  // The giant name keeps the two-line composition (first word with the slow
  // sheen, the rest right-aligned). It is sized per character count so a long
  // name can never overflow the viewport — a 60-char name simply gets smaller.
  const words = hero.name.trim().split(/\s+/).filter(Boolean);
  const first = words[0] ?? "";
  const rest = words.slice(1).join(" ");
  const longest = Math.max(first.length, rest.length, 1);
  const nameStyle = {
    "--name-m": `clamp(40px, ${Math.min(20, 150 / longest).toFixed(2)}vw, 220px)`,
    "--name-d": `clamp(64px, ${Math.min(11.5, 100 / longest).toFixed(2)}vw, 180px)`,
  } as React.CSSProperties;

  // Second CTA follows what actually exists — never a placeholder link.
  const secondary = contact.resumeUrl
    ? { href: contact.resumeUrl, label: "Download Resume", external: true }
    : contact.linkedinUrl
      ? { href: contact.linkedinUrl, label: "LinkedIn", external: true }
      : contact.phone
        ? { href: telHref(contact.phone), label: "Call me", external: false }
        : null;

  return (
    <section
      id="hero"
      className="noise relative flex min-h-[100svh] flex-col overflow-hidden bg-transparent"
    >
      {/* bg portrait + red grade — bottom edge feathered so it melts
          into the shared canvas (no hard clip into the banner) */}
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_66%,transparent_100%)]">
        {hero.photo.url && (
          /* The portrait is a 1:1 upload. Below lg it fills the viewport like
             the reference; from lg it becomes a right-anchored panel feathered
             into the grade, so the square is never cropped to a sliver. */
          <div className="absolute inset-0 lg:left-auto lg:w-[58vw] lg:[mask-image:linear-gradient(to_right,transparent,black_40%)]">
            <Image
              src={hero.photo.url}
              alt={`${hero.name} portrait`}
              fill
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="scale-[1.05] object-cover object-[50%_20%]"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/15 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#ff3d0a]/55 via-transparent to-black/45" />
        <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_70%_20%,rgba(255,60,10,0.35),transparent_60%)]" />
      </div>

      <GridLines />

      {/* giant name — scrolls naturally with the page like the
          reference (no parallax / fade, so it never lingers or pops) */}
      <div
        className="pointer-events-none relative z-[5] mx-auto w-full max-w-[1500px] select-none px-4 pt-24 sm:px-6 md:px-8 md:pt-20"
        style={nameStyle}
      >
        <motion.div
          initial={{ opacity: 0, y: 90 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}
          aria-hidden
          className="font-heading text-[length:var(--name-m)] font-bold leading-[0.88] tracking-tight text-white md:text-[length:var(--name-d)]"
        >
          <span className="name-sheen block bg-clip-text text-transparent">{first}</span>
        </motion.div>
        {rest && (
          <motion.div
            initial={{ opacity: 0, y: 90 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.42 }}
            aria-hidden
            className="-mt-[5vw] flex justify-end font-heading text-[length:var(--name-m)] font-bold leading-[0.88] tracking-tight md:-mt-[2vw] md:text-[length:var(--name-d)]"
          >
            <span className="bg-gradient-to-r from-white via-white to-white/30 bg-clip-text text-transparent">
              {rest}
            </span>
          </motion.div>
        )}
      </div>

      {/* bottom copy — plain flow, no scroll-linked opacity/y.
          Title, bio and both CTAs stay fully opaque and scroll off together. */}
      <div className="relative z-20 flex flex-1 items-end">
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-end gap-8 px-5 pb-28 sm:px-6 md:gap-10 md:px-12 md:pb-36 lg:grid-cols-2">
          <div className="min-w-0">
            <motion.h1
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.9, ease: EASE }}
              className="font-heading text-balance text-[clamp(26px,7vw,30px)] font-bold leading-[1.08] md:text-[42px]"
            >
              <span className="sr-only">{hero.name} — </span>
              {hero.tagline}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.72, duration: 0.9, ease: EASE }}
              className="mt-4 max-w-[560px] font-heading text-[15px] font-light leading-[1.6] text-white/90 sm:text-[16px] md:mt-5 md:text-[19px]"
            >
              {hero.shortBio}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.8, ease: EASE }}
              className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-7 md:gap-4"
            >
              <MagneticButton
                href={`mailto:${contact.email}`}
                className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-[10px] border border-white/10 bg-[#111] px-7 py-4 text-[15px] font-medium transition-colors duration-300 hover:border-white/20 hover:bg-[#1b1b1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:text-[16px]"
              >
                <Mail size={17} className="shrink-0 text-orange-300" aria-hidden />
                Email me
              </MagneticButton>
              {secondary && (
                <MagneticButton
                  href={secondary.href}
                  target={secondary.external ? "_blank" : undefined}
                  className="shimmer-btn inline-flex min-h-[52px] items-center justify-center rounded-[10px] border border-white/10 bg-[#111] px-7 py-4 text-[15px] font-medium transition-colors duration-300 hover:border-white/20 hover:bg-[#1b1b1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:text-[16px]"
                >
                  <span className="book-shine">{secondary.label}</span>
                </MagneticButton>
              )}
            </motion.div>
          </div>

          <div className="min-w-0 lg:justify-self-end lg:text-right">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95, duration: 0.9 }}
              aria-hidden
              className="font-script -rotate-[4deg] text-[36px] leading-none text-white/90 sm:text-[44px] md:text-[58px]"
            >
              {hero.name}
            </motion.p>
          </div>
        </div>
      </div>

      {/* running banner — floats over the image's lower fade, below the
          CTAs, so it never feels like a separate section or container */}
      {strip.length > 0 && (
        <div className="absolute inset-x-0 bottom-0 z-10">
          <LogoStrip items={strip} />
        </div>
      )}
    </section>
  );
}

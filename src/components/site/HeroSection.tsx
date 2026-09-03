import type { ContactInfo, Hero } from "@/lib/types";
import { ArrowRight, Download } from "lucide-react";
import { ParallaxPortrait } from "./HeroPortrait";

/**
 * The opening title. Desktop and mobile are two compositions, not one scaled:
 * on md+ the copy lives inside the site's largest glass pane (.hero-pane) and
 * the signature light sweep crosses it on load, with the parallax portrait
 * layered beside it; below md there is no pane — a small glass medallion,
 * the name straight on the canvas, and full-width thumb-reach CTAs.
 *
 * The text choreography is pure CSS (SSR-first: it plays before hydration and
 * without JS): chips cascade → name rises word by word → the brass period
 * lands → bio and CTAs follow.
 */
export function HeroSection({
  hero,
  contact,
  workAnchor,
}: {
  hero: Hero;
  contact: ContactInfo;
  workAnchor?: string;
}) {
  const roles = hero.tagline
    .split(/\s*[,•·|]\s*/)
    .map((r) => r.trim())
    .filter(Boolean);

  const words = hero.name.replace(/\.+$/, "").split(/\s+/).filter(Boolean);
  const wordBase = 0.25;
  const wordStep = 0.09;
  const dotDelay = wordBase + words.length * wordStep + 0.12;

  const initials = hero.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("");

  return (
    <section id="top" className="relative px-4 sm:px-6 lg:px-8">
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 py-14 md:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:py-28">
        <div className="hero-pane glass-sweep min-w-0">
          {/* Sub-lg medallion — its own composition, not the desktop portrait shrunk. */}
          <div className="rise-in mb-7 lg:hidden">
            <div className="glass-chip flex h-20 w-20 items-center justify-center overflow-hidden rounded-full">
              {hero.photo.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={hero.photo.url} alt={hero.name} className="h-full w-full object-cover" />
              ) : (
                <span className="font-display text-2xl font-semibold text-accent-ink/70 select-none">
                  {initials}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {roles.map((role, i) => (
              <span
                key={i}
                className="glass-chip rise-in inline-flex max-w-full rounded-full px-3.5 py-1.5"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <span className="utility min-w-0 truncate whitespace-nowrap">{role}</span>
              </span>
            ))}
          </div>
          <h1
            className="font-display mt-6 text-5xl font-semibold tracking-[-0.01em] text-balance sm:text-6xl lg:text-7xl"
            aria-label={`${words.join(" ")}.`}
          >
            {words.map((w, i) => (
              <span key={i} aria-hidden className="word-mask">
                <span style={{ animationDelay: `${wordBase + i * wordStep}s` }}>{w}</span>
                {i < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
              </span>
            ))}
            <span
              aria-hidden
              className="dot-land text-accent"
              style={{ animationDelay: `${dotDelay}s` }}
            >
              .
            </span>
          </h1>
          <p
            className="rise-in mt-6 max-w-xl text-base leading-relaxed text-pretty text-muted md:text-lg"
            style={{ animationDelay: `${dotDelay + 0.1}s` }}
          >
            {hero.shortBio}
          </p>
          <div
            className="rise-in mt-9 flex flex-wrap items-center gap-3"
            style={{ animationDelay: `${dotDelay + 0.2}s` }}
          >
            {workAnchor && (
              <a
                href={workAnchor}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-bg transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.98] sm:w-auto"
              >
                View my work
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  strokeWidth={2}
                />
              </a>
            )}
            {contact.resumeUrl && (
              <a
                href={contact.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-chip group inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-ink transition-[filter,transform] duration-200 hover:brightness-125 active:scale-[0.98] sm:w-auto"
              >
                Download resume
                <Download
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5"
                  strokeWidth={2}
                />
              </a>
            )}
          </div>
        </div>

        {/* Desktop-only portrait, layered over the pane's edge for real depth. */}
        <div className="hidden lg:block lg:-ml-6">
          <ParallaxPortrait name={hero.name} photoUrl={hero.photo.url} />
        </div>
      </div>
    </section>
  );
}

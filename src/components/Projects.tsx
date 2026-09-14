"use client";

import { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { ProjectItem, ProjectVertical } from "@/lib/types";
import { PROJECT_VERTICALS } from "@/lib/types";
import { pad2 } from "@/lib/format";
import { GridLines, useIsMobile, useReveal } from "./ui";

function LaptopMock({
  p,
  href,
  onHoverChange,
}: {
  p: ProjectItem;
  href?: string;
  onHoverChange: (v: boolean) => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const hasCover = Boolean(p.coverImage.url);

  const screen = (
    <div className="relative aspect-[16/10] overflow-hidden bg-[#101013]">
      {hasCover ? (
        <>
          {/* loading shimmer while the cover fades in */}
          {!loaded && <div aria-hidden className="absolute inset-0 animate-pulse bg-white/[0.04]" />}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.coverImage.url}
            alt=""
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className={`h-full w-full object-cover object-top transition-all duration-700 ease-out group-hover:scale-[1.12] ${
              loaded ? "opacity-100 blur-0" : "scale-[1.02] opacity-0 blur-md"
            }`}
          />
        </>
      ) : (
        /* no cover yet — the screen carries the title as a text mock, like
           the reference laptops do, so the card never shows a broken image */
        <div className="flex h-full w-full flex-col justify-end bg-[radial-gradient(120%_90%_at_20%_0%,rgba(255,74,26,0.28),transparent_60%),linear-gradient(160deg,#1a1a1f,#0b0b0e)] p-5 transition-transform duration-700 ease-out group-hover:scale-[1.04] sm:p-6 lg:p-7">
          <p className="font-heading text-[11px] uppercase tracking-[0.18em] text-white/45">{p.vertical}</p>
          <p className="mt-2 line-clamp-3 font-heading text-[clamp(18px,3.4vw,26px)] font-semibold leading-[1.15] text-white/90 md:text-[21px] lg:text-[26px]">
            {p.title}
          </p>
        </div>
      )}
      {/* subtle hover shade so the preview pill pops */}
      <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
    </div>
  );

  return (
    <div
      className="relative overflow-hidden bg-[#0c0c0e] px-4 pt-6 sm:px-5 sm:pt-8 md:px-6 md:pt-8 lg:px-10 lg:pt-10"
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      {/* studio glow — dark card backdrop like the recording */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_0%,rgba(255,255,255,0.09),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-8 bottom-0 h-24 bg-black/60 blur-2xl" />

      {/* vertical pill — floating top-left over the backdrop */}
      <span className="absolute left-4 top-4 z-10 max-w-[calc(100%-2rem)] truncate rounded-md bg-white/[0.08] px-2.5 py-1 text-[12px] font-medium text-white/85 backdrop-blur-md">
        {p.vertical}
      </span>

      {/* laptop */}
      <div className="relative">
        <div className="relative overflow-hidden rounded-t-xl border border-white/10 border-b-0 bg-black shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]">
          {href ? (
            <a href={href} target="_blank" rel="noreferrer" tabIndex={-1} aria-hidden className="block">
              {screen}
            </a>
          ) : (
            screen
          )}
        </div>
        {/* laptop base */}
        <div className="relative mx-auto h-[10px] w-[96%] rounded-b-xl bg-gradient-to-b from-[#2b2b30] to-[#101012]" />
        <div className="mx-auto h-[4px] w-[14%] rounded-b-lg bg-[#333338]" />
        {/* desk shadow */}
        <div className="mx-auto mt-1 h-5 w-[80%] rounded-full bg-black/70 blur-xl" />
      </div>
    </div>
  );
}

function ProjectCard({ p, index }: { p: ProjectItem; index: number }) {
  const [previewHover, setPreviewHover] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const r = useReveal();
  const mobile = useIsMobile();
  // Cards sit in one column on phones, so the two-column stagger only applies from md.
  const row = Math.floor(index / 2);
  const delay = mobile ? 0 : (index % 2) * 0.12 + row * 0.06;
  const hidden = { opacity: 0, y: r.yBody + 16, scale: 0.96, filter: mobile ? "blur(6px)" : "blur(8px)" };

  // One primary action: the live product when it exists, else the case study.
  const primary = p.liveUrl
    ? { href: p.liveUrl, label: "View Project", tip: "Visit Live Project" }
    : p.caseStudyUrl
      ? { href: p.caseStudyUrl, label: "Read Case Study", tip: "Open Case Study" }
      : null;
  const secondaryCaseStudy = p.liveUrl && p.caseStudyUrl ? p.caseStudyUrl : null;
  const tags = (p.tags ?? []).filter((t) => t.trim());

  return (
    <motion.div
      ref={ref}
      initial={hidden}
      animate={inView ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : hidden}
      transition={{ duration: r.duration, delay, ease: r.ease }}
      className="min-w-0"
    >
      <article
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#141414] transition-all duration-500 hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] focus-within:border-white/25"
        onMouseLeave={() => {
          setPreviewHover(false);
          setBtnHover(false);
        }}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
        }}
      >
        {/* cursor-following preview pill — image zone only, hidden while
            the button tooltip is active. Only shown when there is somewhere
            to go. Centered above the cursor so it never clips at card edges. */}
        {primary && (
          <motion.div
            aria-hidden
            animate={{
              opacity: previewHover && !btnHover ? 1 : 0,
              scale: previewHover && !btnHover ? 1 : 0.85,
            }}
            transition={{ duration: 0.22 }}
            className="pointer-events-none absolute z-20 hidden -translate-x-1/2 -translate-y-[160%] whitespace-nowrap rounded-full bg-black/85 px-4 py-2 text-[13px] font-medium text-white shadow-xl backdrop-blur-md md:block"
            style={{ left: pos.x, top: pos.y }}
          >
            Click to Preview
          </motion.div>
        )}

        <LaptopMock p={p} href={primary?.href} onHoverChange={setPreviewHover} />

        <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-[#181818] px-4 py-4 sm:px-5 md:px-6">
          <div className="min-w-0 flex-1">
            <h4 className="line-clamp-2 font-heading text-[17px] font-semibold leading-snug text-white sm:text-[18px] md:text-[20px]">
              {p.title}
            </h4>
            <p className="truncate font-heading text-[13px] text-white/50">{p.vertical}</p>
          </div>
          {primary && (
            <a
              href={primary.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`${primary.label}: ${p.title}`}
              className="group/btn relative inline-flex min-h-[44px] shrink-0 items-center gap-1.5 overflow-visible rounded-lg border border-white/15 bg-white/[0.04] px-3.5 py-2.5 font-heading text-[13px] font-medium text-white transition-all duration-300 group-hover:border-white/35 group-hover:bg-white/[0.10] group-hover:shadow-[0_0_20px_-4px_rgba(255,255,255,0.25)] active:bg-white/[0.14] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-4 sm:text-[14px]"
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
            >
              {primary.label}
              {/* arrow swap — fires on card hover too (group-hover), not
                  just direct button hover: old slides out up-right, new
                  slides in from bottom-left */}
              <span className="relative grid size-[17px] place-items-center overflow-hidden" aria-hidden>
                <ArrowUpRight
                  size={17}
                  className="absolute transition-all duration-300 ease-out group-hover:-translate-y-4 group-hover:translate-x-4 group-hover:opacity-0"
                />
                <ArrowUpRight
                  size={17}
                  className="absolute translate-y-4 -translate-x-4 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                />
              </span>
              {/* tooltip — sits ABOVE the button (inside the card's
                  overflow bounds) so it is never clipped */}
              <motion.span
                aria-hidden
                animate={{ opacity: btnHover ? 1 : 0, y: btnHover ? 0 : 6 }}
                transition={{ duration: 0.2 }}
                className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/90 px-3.5 py-1.5 text-[12px] font-medium text-white shadow-xl backdrop-blur-md"
              >
                {primary.tip}
              </motion.span>
            </a>
          )}
        </div>

        {/* story — overview, outcome, tags; the card body the PM portfolio needs */}
        <div className="flex flex-1 flex-col gap-4 border-t border-white/10 bg-[#141414] px-4 py-5 sm:px-5 md:px-6 md:py-6">
          <p className="line-clamp-[9] break-words font-heading text-[14px] font-light leading-[1.7] text-white/70 sm:text-[15px] md:text-[16px]">
            {p.overview}
          </p>
          {p.resultsAndImpact && (
            <div>
              <p className="font-heading text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                Results &amp; impact
              </p>
              <p className="mt-2 line-clamp-[9] break-words font-heading text-[14px] font-light leading-[1.7] text-white/85 sm:text-[15px] md:text-[16px]">
                {p.resultsAndImpact}
              </p>
            </div>
          )}
          {(tags.length > 0 || secondaryCaseStudy) && (
            <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-3 pt-1">
              {tags.length > 0 && (
                <p className="flex min-w-0 flex-wrap gap-x-2 gap-y-2 font-heading text-[13px] text-white/60 md:text-[14px]">
                  {tags.map((t) => (
                    <span key={t} className="break-words border-l border-white/25 pl-3 first:border-l-0 first:pl-0">
                      # {t}
                    </span>
                  ))}
                </p>
              )}
              {secondaryCaseStudy && (
                <a
                  href={secondaryCaseStudy}
                  target="_blank"
                  rel="noreferrer"
                  className="-my-3 inline-flex min-h-[44px] items-center gap-1 rounded font-heading text-[13px] font-medium text-white/80 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white active:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:text-[14px]"
                >
                  Read case study <ArrowUpRight size={14} aria-hidden />
                </a>
              )}
            </div>
          )}
        </div>
      </article>
    </motion.div>
  );
}

/**
 * Projects, grouped by vertical. Each vertical is a titled run of the same
 * laptop-mock cards; verticals with no projects don't render at all — the
 * schema's five verticals stay manageable in the studio regardless.
 */
export function Projects({ items }: { items: ProjectItem[] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref as never,
    offset: ["start end", "end start"],
  });
  // ghost title drifts slower than the cards — parallax like the recording
  const ghostY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const ghostOpacity = useTransform(scrollYProgress, [0, 0.35, 0.8, 1], [0, 1, 1, 0.4]);

  // Non-empty verticals in the schema's order, each with the running card
  // offset so the entrance stagger continues across groups.
  const groups = PROJECT_VERTICALS.map((v) => ({
    vertical: v as ProjectVertical,
    items: items.filter((p) => p.vertical === v),
  }))
    .filter((g) => g.items.length > 0)
    .reduce<{ vertical: ProjectVertical; items: ProjectItem[]; start: number }[]>((acc, g) => {
      const prev = acc[acc.length - 1];
      const start = prev ? prev.start + prev.items.length : 0;
      return [...acc, { ...g, start }];
    }, []);

  return (
    <section
      id="projects"
      ref={ref}
      className="relative -mt-px scroll-mt-24 overflow-hidden bg-transparent px-4 pb-16 pt-10 sm:px-6 md:px-10 md:pb-20 md:pt-16"
    >
      {/* the cards' black stage — feathered top and bottom so it melts into
          whatever the shared canvas is doing on either side */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,#0a0a0c_10%,#0a0a0c_90%,transparent_100%)]"
      />
      <GridLines />
      <h2 className="sr-only">Projects</h2>
      <motion.span
        aria-hidden
        style={{ y: ghostY, opacity: ghostOpacity }}
        className="ghost-huge pointer-events-none absolute -top-4 left-0 text-[27vw] md:text-[15vw]"
      >
        Projects
      </motion.span>
      <div className="relative mx-auto max-w-[1440px] pt-[13vw] md:pt-[7.5vw]">
        {groups.map((g, gi) => {
          return (
            <div key={g.vertical} className={gi > 0 ? "mt-14 md:mt-20" : ""}>
              <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-white/15 pb-4 md:mb-6">
                <h3 className="text-balance font-heading text-[22px] leading-tight tracking-tight text-white sm:text-[26px] md:text-[34px]">
                  {g.vertical}
                  <sup className="ml-2 align-super text-[12px] font-normal text-white/50">
                    {pad2(gi + 1)}
                  </sup>
                </h3>
                <span className="shrink-0 font-heading text-[13px] tabular-nums text-white/50 md:text-[14px]">
                  {g.items.length} {g.items.length === 1 ? "project" : "projects"}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
                {g.items.map((p, i) => (
                  <ProjectCard key={p.id} p={p} index={g.start + i} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

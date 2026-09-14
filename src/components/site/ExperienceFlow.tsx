"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { useIsMobile } from "@/components/ui";

/**
 * The flowing line behind Experience — the reference's aurora gradient, but
 * as one deliberate path instead of a stretched scribble.
 *
 * Generated from the section's measured size, so it spans exactly the rows
 * that exist: add or remove entries in the studio and it re-flows, nothing
 * is tied to a count. Gentle S-bends with vertical tangents at each turn,
 * one bend per roughly a viewport-width of height (more on phones, so it
 * drifts rather than wiggles). Drawn on scroll via pathLength; the glow is a
 * second, wider low-alpha stroke — no SVG filters, so it stays cheap.
 */
export function ExperienceFlow({ target }: { target: React.RefObject<HTMLElement | null> }) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const mobile = useIsMobile();

  useEffect(() => {
    const el = target.current;
    if (!el) return;
    const measure = () => setSize({ w: Math.round(el.offsetWidth), h: Math.round(el.offsetHeight) });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [target]);

  const { scrollYProgress } = useScroll({
    target: target as never,
    offset: ["start 85%", "end 60%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });

  if (size.w === 0 || size.h === 0) return null;
  const d = flowPath(size.w, size.h, mobile);

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${size.w} ${size.h}`}
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
    >
      <defs>
        <linearGradient
          id="experience-flow"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="0"
          y2={size.h}
        >
          <stop offset="0%" stopColor="#34ffb5" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ffb03a" />
        </linearGradient>
      </defs>
      {/* faint track — the whole route, before it is drawn */}
      <path d={d} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      {/* soft halo */}
      <motion.path
        d={d}
        fill="none"
        stroke="url(#experience-flow)"
        strokeWidth={mobile ? 5 : 7}
        strokeLinecap="round"
        opacity={0.12}
        style={{ pathLength: progress }}
      />
      {/* the line */}
      <motion.path
        d={d}
        fill="none"
        stroke="url(#experience-flow)"
        strokeWidth={mobile ? 1.25 : 1.75}
        strokeLinecap="round"
        opacity={mobile ? 0.45 : 0.75}
        style={{ pathLength: progress }}
      />
    </svg>
  );
}

function flowPath(w: number, h: number, mobile: boolean): string {
  // Height each half-wave gets. Longer on phones (narrow + tall sections).
  const halfWave = Math.max(mobile ? w * 1.9 : w * 0.95, 520);
  const bends = Math.max(1, Math.round(h / halfWave));
  const amp = w * (mobile ? 0.34 : 0.42);
  const cx = w / 2;
  // Start a little above and end a little below the section so the line
  // reads as passing through it (the section clips its own overflow).
  const top = -h * 0.04;
  const bottom = h * 1.04;
  const segH = (bottom - top) / bends;
  const k = segH * 0.55; // pull of each bend's controls — vertical tangents at the turns

  let d = `M ${(cx - amp).toFixed(1)} ${top.toFixed(1)}`;
  for (let i = 0; i < bends; i++) {
    const ya = top + segH * i;
    const yb = ya + segH;
    const xa = i % 2 === 0 ? cx - amp : cx + amp;
    const xb = i % 2 === 0 ? cx + amp : cx - amp;
    d += ` C ${xa.toFixed(1)} ${(ya + k).toFixed(1)}, ${xb.toFixed(1)} ${(yb - k).toFixed(1)}, ${xb.toFixed(1)} ${yb.toFixed(1)}`;
  }
  return d;
}

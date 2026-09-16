"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useIsMobile } from "@/components/ui";

/**
 * The journey line: one flowing path that enters from beyond the page edge at
 * the Experience heading, drifts down behind Experience and Projects, and
 * leaves through the Tools heading — a quiet thread from what he has done, to
 * what he has built, to what he builds with.
 *
 * Nothing here knows the current content. The overlay finds the sections it
 * links by id, in the order they appear on the page, and measures them
 * against <main>; it re-measures whenever any of them (or the page) changes
 * size and re-discovers the chain when sections mount, unmount or reorder.
 * Add an Experience entry or a Project and the route simply stretches. Hidden
 * sections drop out of the chain; a chain that doesn't end at Tools ends near
 * its last section's bottom edge instead of a heading.
 *
 * The geometry is a slow wave with vertical tangents at each turn — denser
 * behind Experience, sparser behind the opaque Project cards — drawn on
 * scroll via pathLength. It sits at z-1: above every section's backdrop and
 * below every section's content (z-2), so text always wins. Reduced motion
 * shows the finished line.
 */

const CHAIN = ["experience", "projects", "tools"] as const;
/** How much route each section spends per pixel: lower = the line drifts more slowly there. */
const DENSITY: Record<string, number> = { experience: 1, projects: 0.72, tools: 1 };
/** The ghost section title inside a section — the line enters and leaves through these. */
const HEADING = ".ghost-huge";

type Stop = { id: string; top: number; bottom: number; headTop: number; headBottom: number };
type Layout = { top: number; height: number; width: number; stops: Stop[] };
type Pt = { x: number; y: number };

export function JourneyFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout | null>(null);
  const mobile = useIsMobile();
  const reduced = useReducedMotion();

  // Measure the linked sections against <main>, the overlay's positioned parent.
  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;
    let frame = 0;
    const watched = new Set<Element>();
    const ro = new ResizeObserver(() => schedule());

    function measure() {
      frame = 0;
      const stops: Stop[] = [];
      for (const id of CHAIN) {
        const section = document.getElementById(id);
        if (!(section instanceof HTMLElement) || !host!.contains(section)) continue;
        const head = section.querySelector<HTMLElement>(HEADING) ?? section;
        const top = offsetWithin(section, host!);
        const headTop = head === section ? top : top + offsetWithin(head, section);
        stops.push({
          id,
          top,
          bottom: top + section.offsetHeight,
          headTop,
          headBottom: headTop + head.offsetHeight,
        });
        if (!watched.has(section)) {
          watched.add(section);
          ro.observe(section);
        }
      }
      stops.sort((a, b) => a.top - b.top);
      setLayout((prev) => {
        if (stops.length === 0) return prev === null ? prev : null;
        const first = stops[0];
        const last = stops[stops.length - 1];
        const endsAtHeading = stops.length > 1 && last.id === "tools";
        const top = first.top;
        const bottom = endsAtHeading
          ? last.headBottom + (last.headBottom - last.headTop) * 0.7
          : last.bottom;
        const next: Layout = {
          top,
          height: Math.max(0, Math.round(bottom - top)),
          width: host!.clientWidth,
          stops,
        };
        return sameLayout(prev, next) ? prev : next;
      });
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(measure);
    }

    schedule();
    ro.observe(host);
    // Sections mount, unmount and reorder as the studio's draft changes.
    const mo = new MutationObserver(schedule);
    mo.observe(host, { childList: true });
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      mo.disconnect();
    };
  }, []);

  // Scroll progress of the overlay itself: 0 when its top reaches 85% down the
  // viewport, 1 when its bottom reaches 60% — so the tip leads the reader a
  // little. Measured directly, so a re-layout is picked up on the next scroll.
  const raw = useMotionValue(0);
  const progress = useSpring(raw, { stiffness: 90, damping: 24, mass: 0.4 });

  useEffect(() => {
    const el = ref.current;
    if (!el || !layout) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = vh * 0.6;
      const span = start - end + r.height;
      raw.set(span > 0 ? Math.min(1, Math.max(0, (start - r.top) / span)) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [layout, raw]);

  const d = layout ? journeyPath(layout, mobile) : "";
  const drawn = reduced ? 1 : progress;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 z-[1] overflow-hidden"
      style={{ top: layout?.top ?? 0, height: layout?.height ?? 0 }}
    >
      {layout && layout.height > 0 && (
        <svg
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          width={layout.width}
          height={layout.height}
          className="block"
        >
          <defs>
            <linearGradient
              id="journey-flow"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="0"
              y2={layout.height}
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
            stroke="url(#journey-flow)"
            strokeWidth={mobile ? 5 : 7}
            strokeLinecap="round"
            opacity={0.12}
            style={{ pathLength: drawn }}
          />
          {/* the line */}
          <motion.path
            d={d}
            fill="none"
            stroke="url(#journey-flow)"
            strokeWidth={mobile ? 1.25 : 1.75}
            strokeLinecap="round"
            opacity={mobile ? 0.4 : 0.75}
            style={{ pathLength: drawn }}
          />
        </svg>
      )}
    </div>
  );
}

/** Vertical offset of `el` inside `ancestor`, ignoring transforms (the Projects ghost title drifts). */
function offsetWithin(el: HTMLElement, ancestor: HTMLElement): number {
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor && node !== document.body) {
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return y;
}

function sameLayout(a: Layout | null, b: Layout): boolean {
  if (!a || a.top !== b.top || a.height !== b.height || a.width !== b.width) return false;
  if (a.stops.length !== b.stops.length) return false;
  return a.stops.every((s, i) => {
    const t = b.stops[i];
    return (
      s.id === t.id &&
      s.top === t.top &&
      s.bottom === t.bottom &&
      s.headTop === t.headTop &&
      s.headBottom === t.headBottom
    );
  });
}

const fmt = (n: number) => n.toFixed(1);

/**
 * The route, in overlay coordinates. Enter beyond the left edge at the first
 * heading, turn at alternating sides on the way down (an even number of turns,
 * first right, last left, so the exit sweeps the full width), and leave
 * beyond the right edge through the last heading. Turns are spaced by a
 * weighted height — Projects counts for less, so the line lingers behind the
 * cards rather than wiggling behind them — with the first and last pulled a
 * little towards the headings they answer to. Each piece is a Hermite
 * segment: vertical tangents at the turns, the straight line to the
 * neighbouring turn at both ends (so the sweeps never wobble). On phones the
 * turns sit in the side padding, so the line runs beside the text rather
 * than through it, and only the crossings pass behind a line or two.
 */
function journeyPath(l: Layout, mobile: boolean): string {
  const W = l.width;
  const stops = l.stops;
  const first = stops[0];
  const last = stops[stops.length - 1];
  const endsAtHeading = stops.length > 1 && last.id === "tools";
  const cx = W / 2;
  const amp = W * (mobile ? 0.46 : 0.4);
  const halfWave = mobile ? Math.max(W * 2.2, 560) : Math.max(W * 0.7, 480);
  const local = (abs: number) => abs - l.top;
  const headH = (s: Stop) => s.headBottom - s.headTop;

  const entry: Pt = { x: -W * 0.08, y: local(first.headTop) + headH(first) * 0.35 };
  const exit: Pt = endsAtHeading
    ? { x: W * 1.08, y: local(last.headBottom) + headH(last) * 0.25 }
    : { x: W * 1.08, y: local(last.bottom) - (mobile ? 48 : 96) };

  const waveTop = local(first.headBottom) + (mobile ? 32 : 48);
  const waveBottom = endsAtHeading
    ? local(last.headTop) - headH(last) * 0.5
    : exit.y - halfWave * 0.45;

  const pts: Pt[] = [entry];
  if (waveBottom - waveTop >= 160) {
    // Weighted vertical parameterisation: every section's share of the route
    // is its height × density; anything else between them counts fully.
    const cuts = new Set<number>([waveTop, waveBottom]);
    for (const s of stops) {
      for (const y of [local(s.top), local(s.bottom)]) {
        if (y > waveTop && y < waveBottom) cuts.add(y);
      }
    }
    const ys = [...cuts].sort((a, b) => a - b);
    const segs = ys.slice(1).map((b, i) => {
      const a = ys[i];
      const mid = (a + b) / 2;
      const s = stops.find((t) => local(t.top) <= mid && mid < local(t.bottom));
      return { a, b, w: (b - a) * (s ? (DENSITY[s.id] ?? 1) : 1) };
    });
    const total = segs.reduce((n, s) => n + s.w, 0);
    const yAt = (t: number): number => {
      let acc = 0;
      for (const s of segs) {
        if (t <= acc + s.w) return s.a + (s.b - s.a) * (s.w ? (t - acc) / s.w : 0);
        acc += s.w;
      }
      return waveBottom;
    };
    const n = 2 * Math.max(1, Math.round(total / (2 * halfWave)));
    const seg = total / n;
    const firstT = seg * 0.35;
    const step = (total - 2 * firstT) / (n - 1);
    for (let i = 0; i < n; i++) {
      pts.push({ x: i % 2 === 0 ? cx + amp : cx - amp, y: yAt(firstT + i * step) });
    }
  }
  pts.push(exit);

  const down: Pt = { x: 0, y: 1 };
  const lastIndex = pts.length - 1;
  let d = `M ${fmt(entry.x)} ${fmt(entry.y)}`;
  for (let i = 0; i < lastIndex; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const straight = norm({ x: p1.x - p0.x, y: p1.y - p0.y });
    const t0 = i === 0 ? straight : down;
    const t1 = i + 1 === lastIndex ? straight : down;
    // Pull of each control point: half the horizontal run for the diagonal
    // ends, a little over half the drop for the vertical turns (round bends).
    const k0 = i === 0 ? 0.45 * Math.abs(p1.x - p0.x) : 0.55 * Math.abs(p1.y - p0.y);
    const k1 = i + 1 === lastIndex ? 0.45 * Math.abs(p1.x - p0.x) : 0.55 * Math.abs(p1.y - p0.y);
    d += ` C ${fmt(p0.x + t0.x * k0)} ${fmt(p0.y + t0.y * k0)}, ${fmt(p1.x - t1.x * k1)} ${fmt(p1.y - t1.y * k1)}, ${fmt(p1.x)} ${fmt(p1.y)}`;
  }
  return d;
}

function norm(p: Pt): Pt {
  const len = Math.hypot(p.x, p.y) || 1;
  return { x: p.x / len, y: p.y / len };
}

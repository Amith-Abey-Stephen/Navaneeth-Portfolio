"use client";

import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";
import { useMotionCtx } from "./MotionProvider";

/**
 * The signature: one warm light source living behind the glass. It follows
 * the cursor on desktop and descends the page with scroll on touch; every
 * panel's backdrop blur refracts it, so the material visibly answers the
 * user without any per-panel wiring. Static under reduced motion.
 *
 * Everything here is transform-only (compositor work, no layout/paint), and
 * the blooms drift on the same 60s ambient cycle the old theme used.
 */
export function GlassBackdrop() {
  const { ok, fine } = useMotionCtx();

  // Light position as viewport fractions, smoothed through springs.
  const lx = useSpring(0.62, { stiffness: 40, damping: 20 });
  const ly = useSpring(0.28, { stiffness: 40, damping: 20 });

  useEffect(() => {
    if (!ok || !fine) return;
    const onMove = (e: PointerEvent) => {
      lx.set(e.clientX / window.innerWidth);
      ly.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [ok, fine, lx, ly]);

  // Touch: no cursor, so the light rides scroll position instead.
  const { scrollYProgress } = useScroll();
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!ok || fine) return;
    ly.set(0.15 + p * 0.7);
  });

  const x = useTransform(lx, (v) => `calc(${(v * 100).toFixed(2)}vw - 50%)`);
  const y = useTransform(ly, (v) => `calc(${(v * 100).toFixed(2)}vh - 50%)`);

  return (
    <div aria-hidden className="gl-scene">
      {/* Warm blooms give the glass something real to refract. */}
      <div
        className="ambient absolute -top-[20%] -right-[15%] h-[70vmax] w-[70vmax] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(201, 162, 106, 0.14) 0%, transparent 62%)",
        }}
      />
      <div
        className="ambient absolute -bottom-[25%] -left-[20%] h-[80vmax] w-[80vmax] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(133, 84, 41, 0.18) 0%, transparent 60%)",
          animationDuration: "75s",
          animationDelay: "-30s",
        }}
      />
      <div
        className="ambient absolute top-[30%] left-[10%] h-[50vmax] w-[50vmax] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(243, 233, 216, 0.05) 0%, transparent 65%)",
          animationDuration: "90s",
          animationDelay: "-55s",
        }}
      />
      {/* The living light. Under reduced motion it rests where a lamp would sit. */}
      <motion.div
        className="absolute top-0 left-0 h-[100vmax] w-[100vmax] rounded-full"
        style={{
          x: ok ? x : "calc(65vw - 50%)",
          y: ok ? y : "calc(22vh - 50%)",
          background:
            "radial-gradient(circle, rgba(222, 192, 141, 0.13) 0%, rgba(222, 192, 141, 0.05) 35%, transparent 65%)",
        }}
      />
      <div className="gl-grain" />
      <div className="gl-vignette" />
    </div>
  );
}

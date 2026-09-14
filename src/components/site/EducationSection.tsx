"use client";

import { motion } from "motion/react";
import type { EducationItem } from "@/lib/types";
import { pad2 } from "@/lib/format";
import { GridLines } from "@/components/ui";
import { GhostTitle } from "./GhostTitle";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Education as divided rows: the degree on the left, and on the right the
 * reference's black meta pill (institution · years) — the same pill the
 * Experience rows use, so the two sections read as one system.
 */
export function EducationSection({ items }: { items: EducationItem[] }) {
  return (
    <section
      id="education"
      className="relative scroll-mt-24 overflow-hidden bg-transparent px-5 pb-10 pt-6 sm:px-6 md:px-12 md:pt-10"
    >
      <GridLines />
      <GhostTitle>Education</GhostTitle>
      <div className="relative mx-auto mt-4 max-w-[1440px] md:mt-8">
        {items.map((e, i) => {
          const years = [e.startYear, e.endYear].filter(Boolean).join(" — ");
          return (
            <div
              key={e.id}
              className="group grid grid-cols-1 gap-4 border-b border-white/20 py-7 first:border-t sm:py-8 md:py-10 lg:grid-cols-2 lg:gap-12"
            >
              <motion.h3
                initial={{ opacity: 0, y: 56, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: EASE }}
                className="text-balance break-words font-heading text-[22px] leading-tight tracking-tight text-white transition-transform duration-500 sm:text-[26px] md:text-[34px] lg:group-hover:translate-x-2"
              >
                {e.degree}
                <sup className="ml-2 align-super text-[12px] font-normal text-white/50">{pad2(i + 1)}</sup>
              </motion.h3>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
                className="min-w-0 self-center"
              >
                <div className="inline-flex max-w-full flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl bg-black px-5 py-4 text-[14px] text-white/80 sm:text-[15px] md:px-6">
                  {e.institution && <span className="break-words font-medium text-white">{e.institution}</span>}
                  {e.institution && years && (
                    <span aria-hidden className="hidden h-1 w-1 rounded-full bg-white/25 sm:block" />
                  )}
                  {years && <span className="tabular-nums">{years}</span>}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

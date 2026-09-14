"use client";

import type { ProficiencyLevel, ToolItem } from "@/lib/types";
import { initials } from "@/lib/format";
import { GridLines, ScrollReveal } from "@/components/ui";
import { GhostTitle } from "./GhostTitle";

// Proficiency in the reference's own chip vocabulary: the cream active chip
// for Expert, the frosted chip for Intermediate, an outline for Beginner.
const LEVEL_CHIP: Record<ProficiencyLevel, string> = {
  Expert: "bg-[#e9e1d3] text-[#2a2018]",
  Intermediate: "bg-white/10 text-white/85",
  Beginner: "border border-white/15 text-white/60",
};

/**
 * Tools as the reference's bordered cell grid (the social strip): 2-up on
 * mobile, 4-up from md, hairline dividers that stay correct for any count.
 */
export function ToolsSection({ items }: { items: ToolItem[] }) {
  return (
    <section
      id="tools"
      className="relative scroll-mt-24 overflow-hidden bg-transparent px-5 pb-16 pt-6 sm:px-6 md:px-12 md:pb-24 md:pt-10"
    >
      <GridLines />
      <GhostTitle>Tools</GhostTitle>
      <ScrollReveal className="relative mx-auto mt-2 max-w-[1240px] md:mt-6">
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <ul className="-mb-px -mr-px grid grid-cols-2 md:grid-cols-4">
            {items.map((t) => (
              <li
                key={t.id}
                className="flex min-w-0 items-center gap-3 border-b border-r border-white/10 px-4 py-4 transition-colors hover:bg-white/[0.06] sm:px-5 md:py-5"
              >
                <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.06] font-heading text-[13px] font-semibold text-white/80">
                  {t.icon.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.icon.url} alt="" loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    initials(t.name, 1)
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-heading text-[15px] font-medium text-white sm:text-[16px]">
                    {t.name}
                  </span>
                  <span
                    className={`mt-1.5 inline-block rounded-md px-2 py-0.5 font-heading text-[11px] font-medium leading-[1.4] ${LEVEL_CHIP[t.level]}`}
                  >
                    {t.level}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </ScrollReveal>
    </section>
  );
}

"use client";

import { motion } from "motion/react";
import type { SkillGroup } from "@/lib/types";
import { pad2 } from "@/lib/format";
import { GridLines } from "@/components/ui";
import { GhostTitle } from "./GhostTitle";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Skill groups as the reference's divided rows: category on the left with
 * a superscript index, the skills on the right as the frosted tag chips.
 */
export function SkillsSection({ items }: { items: SkillGroup[] }) {
  return (
    <section
      id="skills"
      className="relative scroll-mt-24 overflow-hidden bg-transparent px-5 pb-10 pt-6 sm:px-6 md:px-12 md:pt-10"
    >
      <GridLines />
      <GhostTitle>Skills</GhostTitle>
      <div className="relative mx-auto mt-4 max-w-[1440px] md:mt-8">
        {items.map((g, i) => (
          <div
            key={g.id}
            className="group grid grid-cols-1 gap-4 border-b border-white/20 py-7 first:border-t sm:py-8 md:py-10 lg:grid-cols-2 lg:gap-12"
          >
            <motion.h3
              initial={{ opacity: 0, y: 56, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, ease: EASE }}
              className="text-balance break-words font-heading text-[26px] leading-tight tracking-tight text-white transition-transform duration-500 sm:text-[30px] md:text-[42px] lg:group-hover:translate-x-2"
            >
              {g.category}
              <sup className="ml-2 align-super text-[12px] font-normal text-white/50">{pad2(i + 1)}</sup>
            </motion.h3>
            <motion.ul
              initial={{ opacity: 0, y: 48, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, delay: 0.08, ease: EASE }}
              className="flex min-w-0 flex-wrap gap-2.5 self-center sm:gap-3"
            >
              {g.skills.filter((s) => s.trim()).map((s) => (
                <li
                  key={s}
                  className="max-w-full break-words rounded-md bg-white/10 px-3.5 py-2 font-heading text-[13px] text-white/80 sm:px-4 sm:py-2.5 sm:text-[14px]"
                >
                  {s}
                </li>
              ))}
            </motion.ul>
          </div>
        ))}
      </div>
    </section>
  );
}

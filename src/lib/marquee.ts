import type { SiteContent } from "./types";
import { renderableSections } from "./types";

/**
 * The hero's running banner ("company marquee") has one source of truth:
 * `settings.marquee` when the owner has set it in the studio, otherwise the
 * companies from the visible Experience section, deduplicated in page order —
 * exactly what the site showed before the field existed. The studio form and
 * the public site both go through these helpers so they can never disagree.
 */

/** Companies from the visible Experience section, first occurrence wins. */
export function experienceCompanies(content: SiteContent): string[] {
  const experience = renderableSections(content).find((s) => s.type === "experience");
  if (!experience || experience.type !== "experience") return [];
  const seen = new Set<string>();
  const names: string[] = [];
  for (const e of experience.items) {
    const name = e.company.trim();
    const key = name.toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    names.push(name);
  }
  return names;
}

/** True when the owner has customised the banner (even to an empty list). */
export function marqueeIsCustom(content: SiteContent): boolean {
  return Array.isArray(content.settings?.marquee);
}

/** The names the banner should show right now. */
export function marqueeNames(content: SiteContent): string[] {
  const custom = content.settings?.marquee;
  if (Array.isArray(custom)) return custom.map((n) => n.trim()).filter(Boolean);
  return experienceCompanies(content);
}

/** A company logo uploaded on an Experience entry with the same name, if any. */
export function marqueeLogo(content: SiteContent, name: string): string | undefined {
  const key = name.trim().toLowerCase();
  for (const s of content.sections) {
    if (s.type !== "experience") continue;
    const match = s.items.find((e) => e.company.trim().toLowerCase() === key && e.logo?.url);
    if (match) return match.logo!.url;
  }
  return undefined;
}

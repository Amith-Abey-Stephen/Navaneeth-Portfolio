// The single source of truth for content shape — build prompt §17, verbatim.
// The studio's forms and the public section components are both typed against
// these, so the two can never drift apart.

export type AspectRatio = "1:1" | "16:9" | "4:3";

export type ImageRef = {
  url: string;
  aspectRatio: AspectRatio;
};

export type ContactInfo = {
  email: string;
  phone?: string;
  linkedinUrl?: string;
  resumeUrl?: string;
};

export type Hero = {
  name: string; // max 60 chars
  tagline: string; // max 80 chars
  shortBio: string; // max 320 chars
  photo: ImageRef; // "1:1"
};

export type About = {
  heading: string; // max 100 chars
  body: string; // max 1500 chars; rendered as paragraphs split on blank lines
};

export type StatItem = {
  id: string;
  value: string; // max 12 chars — may be empty when the icon carries the meaning
  label: string; // max 40 chars
  icon?: ImageRef; // "1:1"
};

export type ExperienceItem = {
  id: string;
  company: string; // max 60 chars
  role: string; // max 60 chars
  startDate: string; // "YYYY-MM"
  endDate: string | "present";
  bullets: string[]; // max 4, each max 300 chars
  highlight?: string; // max 160 chars
  tags?: string[]; // max 6, each max 20 chars
  logo?: ImageRef; // "1:1"
};

export const PROJECT_VERTICALS = [
  "Product Creation",
  "Product Design",
  "Product Improvement",
  "Analytical Case Studies",
  "Product Teardowns",
] as const;

export type ProjectVertical = (typeof PROJECT_VERTICALS)[number];

export type ProjectItem = {
  id: string;
  vertical: ProjectVertical;
  title: string; // max 90 chars
  coverImage: ImageRef; // "16:9"
  overview: string; // max 600 chars
  resultsAndImpact?: string; // max 600 chars
  liveUrl?: string;
  caseStudyUrl?: string;
  tags?: string[]; // max 6, each max 20 chars
};

export const PROFICIENCY_LEVELS = ["Beginner", "Intermediate", "Expert"] as const;
export type ProficiencyLevel = (typeof PROFICIENCY_LEVELS)[number];

export type ToolItem = {
  id: string;
  name: string;
  icon: ImageRef; // "1:1"
  level: ProficiencyLevel;
};

export type SkillGroup = {
  id: string;
  category: string; // max 40 chars
  skills: string[]; // max 10, each max 40 chars
};

export type CertificationItem = {
  id: string;
  title: string; // max 90 chars
  issuer: string; // max 50 chars
  date?: string;
  credentialId?: string;
  credentialUrl?: string;
  badge?: ImageRef; // "1:1"
};

export type EducationItem = {
  id: string;
  degree: string;
  institution?: string;
  startYear: string;
  endYear: string;
};

export type Section =
  | { type: "about"; visible: boolean; order: number; data: About }
  | { type: "stats"; visible: boolean; order: number; items: StatItem[] }
  | { type: "experience"; visible: boolean; order: number; items: ExperienceItem[] }
  | { type: "projects"; visible: boolean; order: number; items: ProjectItem[] }
  | { type: "tools"; visible: boolean; order: number; items: ToolItem[] }
  | { type: "skills"; visible: boolean; order: number; items: SkillGroup[] }
  | { type: "certifications"; visible: boolean; order: number; items: CertificationItem[] }
  | { type: "education"; visible: boolean; order: number; items: EducationItem[] };

export type SectionType = Section["type"];

/**
 * Site-level settings added in the V2 pass. Every field is optional so documents
 * written before it existed keep loading unchanged; a missing `settings` means
 * "use the defaults" (no custom favicon, marquee derived from Experience).
 */
export type SiteSettings = {
  favicon?: ImageRef; // "1:1" — the browser-tab icon, follows draft → publish
  marquee?: string[]; // company names for the running banner; undefined → derived from Experience
};

export type SiteContent = {
  hero: Hero;
  contact: ContactInfo;
  sections: Section[];
  settings?: SiteSettings;
};

export type HistoryEntry = {
  version: number;
  publishedAt: string;
  content: SiteContent;
};

export type SiteDocument = {
  draft: SiteContent;
  published: SiteContent;
  version: number;
  publishedAt: string; // ISO timestamp
  history: HistoryEntry[]; // most recent 20 only
};

export const SECTION_LABELS: Record<SectionType, string> = {
  about: "About",
  stats: "Stats",
  experience: "Experience",
  projects: "Projects",
  tools: "Tools",
  skills: "Skills",
  certifications: "Certifications",
  education: "Education",
};

/** True when a section has nothing to show — such sections never render publicly. */
export function sectionIsEmpty(section: Section): boolean {
  if (section.type === "about") {
    return !section.data.heading.trim() && !section.data.body.trim();
  }
  return section.items.length === 0;
}

/** Visible, non-empty sections in configured order — the public render list. */
export function renderableSections(content: SiteContent): Section[] {
  return [...content.sections]
    .sort((a, b) => a.order - b.order)
    .filter((s) => s.visible && !sectionIsEmpty(s));
}

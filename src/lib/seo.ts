import type { DeveloperCredit, ProjectItem, Section, SiteContent } from "./types";
import { safeImageUrl, safeLinkUrl } from "./urls";

export const DEFAULT_DEVELOPER: DeveloperCredit = {
  enabled: true,
  name: "Amith Abey Stephen",
  role: "Developed by",
  siteUrl: "https://amith.site/",
  linkedinUrl: "https://www.linkedin.com/in/amith-abey-stephen/",
  githubUrl: "https://github.com/Amith-Abey-Stephen/",
};

export const DEFAULT_CANONICAL_URL = "https://thenavaneeth.com";
export const DEFAULT_TWITTER_HANDLE = "@Navaneethtalks";

export type EffectiveSeo = {
  title: string;
  description: string;
  canonicalUrl: string;
  twitterHandle: string;
  ogImageUrl: string | undefined;
  faviconUrl: string | undefined;
  developer: DeveloperCredit;
  keywords: string[];
};

/**
 * Returns all SEO values with intelligent defaults, falling back to hero & seed
 * data if not explicitly overridden in Studio.
 */
export function getEffectiveSeo(content: SiteContent): EffectiveSeo {
  const custom = content.settings?.seo;
  const hero = content.hero;

  const title = (custom?.metaTitle?.trim()) || `${hero.name} — ${hero.tagline}`;
  const description = (custom?.metaDescription?.trim()) || hero.shortBio;
  const canonicalUrl = safeLinkUrl(custom?.canonicalUrl) || DEFAULT_CANONICAL_URL;

  let twitterHandle = custom?.twitterHandle?.trim() || DEFAULT_TWITTER_HANDLE;
  if (!twitterHandle.startsWith("@") && !twitterHandle.startsWith("http")) {
    twitterHandle = `@${twitterHandle}`;
  }

  const ogImageUrl =
    safeImageUrl(custom?.ogImage?.url) ||
    safeImageUrl(hero.photo?.url);

  const faviconUrl = safeImageUrl(content.settings?.favicon?.url);

  const dev = custom?.developerCredit;
  const developer: DeveloperCredit = {
    enabled: dev?.enabled ?? DEFAULT_DEVELOPER.enabled,
    name: (dev?.name?.trim()) || DEFAULT_DEVELOPER.name,
    role: (dev?.role?.trim()) || DEFAULT_DEVELOPER.role,
    siteUrl: safeLinkUrl(dev?.siteUrl) || DEFAULT_DEVELOPER.siteUrl,
    linkedinUrl: safeLinkUrl(dev?.linkedinUrl) || DEFAULT_DEVELOPER.linkedinUrl,
    githubUrl: safeLinkUrl(dev?.githubUrl) || DEFAULT_DEVELOPER.githubUrl,
  };

  const keywords = getDerivedKeywords(content);

  return {
    title,
    description,
    canonicalUrl,
    twitterHandle,
    ogImageUrl,
    faviconUrl,
    developer,
    keywords,
  };
}

/**
 * Extracts high-relevance search keywords from the dynamic content so the site
 * ranks for product manager, case studies, specific skills, and the developer.
 */
export function getDerivedKeywords(content: SiteContent): string[] {
  const set = new Set<string>();

  // Base names & identity
  if (content.hero.name) {
    set.add(content.hero.name);
    const parts = content.hero.name.split(/\s+/);
    if (parts.length > 1) {
      set.add(`${content.hero.name} portfolio`);
      set.add(`${content.hero.name} product manager`);
    }
  }

  // Tagline keywords
  if (content.hero.tagline) {
    content.hero.tagline
      .split(/[,·|–—/-]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 2)
      .forEach((term) => set.add(term));
  }

  // Sections
  for (const s of content.sections) {
    if (!s.visible) continue;

    if (s.type === "projects") {
      for (const p of s.items) {
        if (p.vertical?.trim()) set.add(p.vertical.trim());
        if (p.tags) p.tags.forEach((t) => { if (t?.trim()) set.add(t.trim()); });
        // Add project title keywords if concise
        if (p.title.includes(":")) {
          const mainTitle = p.title.split(":")[0].trim();
          if (mainTitle) set.add(mainTitle);
        }
      }
    } else if (s.type === "tools") {
      for (const t of s.items) {
        if (t.name?.trim()) set.add(t.name.trim());
      }
    } else if (s.type === "skills") {
      for (const group of s.items) {
        if (group.category?.trim()) set.add(group.category.trim());
        for (const sk of group.skills) {
          if (sk?.trim()) set.add(sk.trim());
        }
      }
    } else if (s.type === "experience") {
      for (const exp of s.items) {
        if (exp.company?.trim()) set.add(exp.company.trim());
        if (exp.role?.trim()) set.add(exp.role.trim());
        if (exp.tags) exp.tags.forEach((t) => { if (t?.trim()) set.add(t.trim()); });
      }
    }
  }

  // Developer credit keywords for reciprocal developer SEO
  const dev = content.settings?.seo?.developerCredit ?? DEFAULT_DEVELOPER;
  if (dev.enabled && dev.name?.trim()) {
    set.add(dev.name.trim());
    set.add(`${dev.name.trim()} web developer`);
  }

  // Custom user keywords
  if (content.settings?.seo?.keywords) {
    for (const k of content.settings.seo.keywords) {
      if (k?.trim()) set.add(k.trim());
    }
  }

  return Array.from(set).filter((k) => k.length > 0);
}

/**
 * Generates an end-to-end Schema.org JSON-LD multi-entity graph linking
 * the WebSite, ProfilePage, Person, CreativeWorks (projects), and Developer.
 */
export function generateJsonLdGraph(content: SiteContent) {
  const seo = getEffectiveSeo(content);
  const hero = content.hero;
  const canonical = seo.canonicalUrl.replace(/\/+$/, "");

  // Collect sameAs social links
  const sameAs: string[] = [];
  if (content.contact.linkedinUrl) sameAs.push(content.contact.linkedinUrl);
  if (seo.twitterHandle) {
    const handleClean = seo.twitterHandle.replace(/^@/, "");
    sameAs.push(`https://x.com/${handleClean}`);
  }
  sameAs.push(canonical);

  // Developer entity
  const devSameAs: string[] = [];
  if (seo.developer.linkedinUrl) devSameAs.push(seo.developer.linkedinUrl);
  if (seo.developer.githubUrl) devSameAs.push(seo.developer.githubUrl);

  const developerEntity = seo.developer.enabled
    ? {
        "@type": "Person",
        name: seo.developer.name,
        url: seo.developer.siteUrl,
        jobTitle: "Software Engineer & Designer",
        ...(devSameAs.length > 0 ? { sameAs: devSameAs } : {}),
      }
    : undefined;

  // Find primary current role/company
  const expSection = content.sections.find((s) => s.type === "experience" && s.visible) as
    | (Section & { type: "experience" })
    | undefined;
  const currentJob = expSection?.items?.[0];

  // Find education
  const eduSection = content.sections.find((s) => s.type === "education" && s.visible) as
    | (Section & { type: "education" })
    | undefined;
  const primaryEdu = eduSection?.items?.[0];

  // Collect projects for ItemList
  const projectSection = content.sections.find((s) => s.type === "projects" && s.visible) as
    | (Section & { type: "projects" })
    | undefined;
  const projects: ProjectItem[] = projectSection?.items ?? [];

  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebSite",
      "@id": `${canonical}/#website`,
      url: canonical,
      name: `${hero.name} Portfolio`,
      description: seo.description,
      inLanguage: "en-US",
      ...(developerEntity ? { creator: developerEntity, publisher: developerEntity } : {}),
    },
    {
      "@type": "ProfilePage",
      "@id": `${canonical}/#profilepage`,
      url: canonical,
      name: seo.title,
      description: seo.description,
      isPartOf: { "@id": `${canonical}/#website` },
      mainEntity: { "@id": `${canonical}/#person` },
      ...(developerEntity ? { creator: developerEntity } : {}),
    },
    {
      "@type": "Person",
      "@id": `${canonical}/#person`,
      name: hero.name,
      jobTitle: hero.tagline,
      description: hero.shortBio,
      url: canonical,
      ...(seo.ogImageUrl ? { image: seo.ogImageUrl } : {}),
      email: `mailto:${content.contact.email}`,
      sameAs,
      knowsAbout: seo.keywords.slice(0, 25),
      ...(currentJob
        ? {
            worksFor: {
              "@type": "Organization",
              name: currentJob.company,
            },
          }
        : {}),
      ...(primaryEdu?.institution
        ? {
            alumniOf: {
              "@type": "EducationalOrganization",
              name: primaryEdu.institution,
            },
          }
        : {}),
    },
  ];

  if (projects.length > 0) {
    graph.push({
      "@type": "ItemList",
      "@id": `${canonical}/#projects`,
      name: `${hero.name} — Featured Projects & Case Studies`,
      itemListElement: projects.map((p, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "CreativeWork",
          name: p.title,
          description: p.overview,
          ...(p.liveUrl ? { url: p.liveUrl } : {}),
          ...(p.tags && p.tags.length > 0 ? { keywords: p.tags.join(", ") } : {}),
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

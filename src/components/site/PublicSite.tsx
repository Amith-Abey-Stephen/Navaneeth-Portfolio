import type { Section, SectionType, SiteContent } from "@/lib/types";
import { renderableSections, SECTION_LABELS } from "@/lib/types";
import { Navbar, type NavCta, type NavLink } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { AboutIntro } from "@/components/AboutIntro";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { SiteCanvas } from "@/components/SiteCanvas";
import { Preloader } from "@/components/Preloader";
import { CursorTrail } from "@/components/CursorTrail";
import type { StripItem } from "@/components/LogoStrip";
import { StatsSection } from "./StatsSection";
import { ExperienceSection } from "./ExperienceSection";
import { ToolsSection } from "./ToolsSection";
import { SkillsSection } from "./SkillsSection";
import { CertificationsSection } from "./CertificationsSection";
import { EducationSection } from "./EducationSection";
import { SiteProviders } from "./SiteProviders";

function renderSection(section: Section) {
  switch (section.type) {
    case "about":
      return <AboutIntro key="about" data={section.data} />;
    case "stats":
      return <StatsSection key="stats" items={section.items} />;
    case "experience":
      return <ExperienceSection key="experience" items={section.items} />;
    case "projects":
      return <Projects key="projects" items={section.items} />;
    case "tools":
      return <ToolsSection key="tools" items={section.items} />;
    case "skills":
      return <SkillsSection key="skills" items={section.items} />;
    case "certifications":
      return <CertificationsSection key="certifications" items={section.items} />;
    case "education":
      return <EducationSection key="education" items={section.items} />;
  }
}

// The pill nav holds five links like the reference (Home · three sections ·
// Contact). Which three: the first present in this priority, shown in page order.
const NAV_PRIORITY: SectionType[] = [
  "projects",
  "experience",
  "skills",
  "about",
  "tools",
  "certifications",
  "education",
  "stats",
];

/**
 * The one and only render path for the site. The public page feeds it
 * `published` content; the studio's live preview feeds it `draft`.
 * There is no second implementation that could drift.
 */
export function PublicSite({
  content,
  preloader = true,
}: {
  content: SiteContent;
  preloader?: boolean;
}) {
  const { hero, contact } = content;
  const sections = renderableSections(content);
  const present = new Set(sections.map((s) => s.type));

  const middle = NAV_PRIORITY.filter((t) => present.has(t)).slice(0, 3);
  const links: NavLink[] = [
    { id: "hero", href: "#hero", label: "Home" },
    ...sections
      .filter((s) => middle.includes(s.type))
      .map((s) => ({
        id: s.type,
        href: `#${s.type}`,
        label: s.type === "projects" ? "Work" : SECTION_LABELS[s.type],
      })),
    { id: "contact", href: "#contact", label: "Contact" },
  ];
  const cta: NavCta = contact.resumeUrl
    ? { href: contact.resumeUrl, label: "Download Resume", external: true }
    : { href: `mailto:${contact.email}`, label: "Email me" };
  const brand = hero.name.trim().split(/\s+/)[0] || hero.name;

  // The hero's running banner: the companies from Experience (deduplicated).
  const strip: StripItem[] = [];
  const experience = sections.find((s) => s.type === "experience");
  if (experience && experience.type === "experience") {
    const seen = new Set<string>();
    for (const e of experience.items) {
      const key = e.company.trim().toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      strip.push({ label: e.company.trim(), src: e.logo?.url || undefined });
    }
  }

  return (
    <SiteProviders>
      {preloader && <Preloader name={hero.name} subtitle={hero.tagline} />}
      <CursorTrail />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[95] focus:rounded-full focus:bg-[#f2eee7] focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-black"
      >
        Skip to content
      </a>
      <div className="relative min-h-screen bg-[#070708] text-white">
        {/* single continuous background canvas — all sections sit transparent over it */}
        <SiteCanvas />
        <div className="relative">
          <Navbar links={links} brand={brand} cta={cta} />
          <main id="main">
            <Hero hero={hero} contact={contact} strip={strip} />
            {sections.map(renderSection)}
            <Contact contact={contact} />
          </main>
          <Footer name={hero.name} contact={contact} />
        </div>
      </div>
    </SiteProviders>
  );
}

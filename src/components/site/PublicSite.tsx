import type { Section, SectionType, SiteContent } from "@/lib/types";
import { renderableSections, SECTION_LABELS } from "@/lib/types";
import { marqueeLogo, marqueeNames } from "@/lib/marquee";
import { sanitizeContent } from "@/lib/urls";
import { Navbar, type NavCta, type NavLink } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { AboutIntro } from "@/components/AboutIntro";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { SiteCanvas } from "@/components/SiteCanvas";
import { Preloader } from "@/components/Preloader";
import type { StripItem } from "@/components/LogoStrip";
import { StatsSection } from "./StatsSection";
import { ExperienceSection } from "./ExperienceSection";
import { ToolsSection } from "./ToolsSection";
import { SkillsSection } from "./SkillsSection";
import { CertificationsSection } from "./CertificationsSection";
import { EducationSection } from "./EducationSection";
import { JourneyFlow } from "./JourneyFlow";
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
  content: raw,
  preloader = true,
}: {
  content: SiteContent;
  preloader?: boolean;
}) {
  // Every owner-typed URL passes one gate before it can become an href or src.
  const content = sanitizeContent(raw);
  const { hero } = content;
  // Only the channels the site actually shows reach the client components —
  // a legacy phone number stays in the stored document but never in the page.
  const contact = {
    email: content.contact.email,
    linkedinUrl: content.contact.linkedinUrl,
    resumeUrl: content.contact.resumeUrl,
  };
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
  // The nav's one CTA is the resume. No resume URL in the studio → no CTA,
  // never a placeholder link.
  const resumeUrl = contact.resumeUrl?.trim();
  const cta: NavCta | null = resumeUrl ? { href: resumeUrl, label: "Resume", external: true } : null;
  const brand = hero.name.trim().split(/\s+/)[0] || hero.name;

  // The hero's running banner: the studio's company list, or — until the
  // owner sets one — the companies from Experience (see lib/marquee).
  const strip: StripItem[] = marqueeNames(content).map((name) => ({
    label: name,
    src: marqueeLogo(content, name),
  }));

  return (
    <SiteProviders>
      {preloader && <Preloader name={hero.name} subtitle={hero.tagline} />}
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
          <main id="main" className="relative">
            {/* the journey line: Experience → Projects → Tools, behind the sections' content */}
            <JourneyFlow />
            <Hero hero={hero} contact={contact} strip={strip} />
            {sections.map(renderSection)}
            <Contact contact={contact} />
          </main>
          <Footer name={hero.name} contact={contact} settings={content.settings} />
        </div>
      </div>
    </SiteProviders>
  );
}

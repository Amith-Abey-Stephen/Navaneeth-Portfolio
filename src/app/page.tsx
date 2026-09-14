import type { Metadata } from "next";
import { PublicSite } from "@/components/site/PublicSite";
import { getPublishedSite } from "@/lib/published";

// Rendered on every request so a publish shows up immediately.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getPublishedSite();
  const title = `${content.hero.name} — ${content.hero.tagline}`;
  // The favicon is part of the published content, so a draft change in the
  // studio never reaches the tab until the owner publishes. No upload yet →
  // no icon tag at all (the browser's default), never an invented asset.
  const favicon = content.settings?.favicon?.url;
  return {
    title,
    description: content.hero.shortBio,
    openGraph: { title, description: content.hero.shortBio, type: "profile" },
    twitter: { card: "summary", title, description: content.hero.shortBio },
    ...(favicon ? { icons: { icon: [{ url: favicon }], apple: [{ url: favicon }] } } : {}),
  };
}

export default async function HomePage() {
  const { content } = await getPublishedSite();

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: content.hero.name,
    jobTitle: content.hero.tagline,
    description: content.hero.shortBio,
    email: `mailto:${content.contact.email}`,
    ...(content.contact.linkedinUrl ? { sameAs: [content.contact.linkedinUrl] } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <PublicSite content={content} />
    </>
  );
}

import type { Metadata } from "next";
import { PublicSite } from "@/components/site/PublicSite";
import { getPublishedSite } from "@/lib/published";
import { generateJsonLdGraph, getEffectiveSeo } from "@/lib/seo";

// Rendered on every request so a publish shows up immediately.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getPublishedSite();
  const seo = getEffectiveSeo(content);

  const metadata: Metadata = {
    metadataBase: new URL(seo.canonicalUrl),
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: seo.canonicalUrl,
    },
    authors: [
      ...(seo.developer.enabled
        ? [{ name: seo.developer.name, url: seo.developer.siteUrl }]
        : []),
      { name: content.hero.name, url: seo.canonicalUrl },
    ],
    creator: seo.developer.enabled ? seo.developer.name : content.hero.name,
    publisher: content.hero.name,
    category: "Portfolio",
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.canonicalUrl,
      siteName: `${content.hero.name} Portfolio`,
      locale: "en_US",
      type: "profile",
      ...(seo.ogImageUrl
        ? {
            images: [
              {
                url: seo.ogImageUrl,
                width: 1200,
                height: 630,
                alt: seo.title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: seo.ogImageUrl ? "summary_large_image" : "summary",
      title: seo.title,
      description: seo.description,
      creator: seo.twitterHandle,
      site: seo.twitterHandle,
      ...(seo.ogImageUrl ? { images: [seo.ogImageUrl] } : {}),
    },
    other: {
      ...(seo.developer.enabled
        ? {
            developer: seo.developer.name,
            "developer:url": seo.developer.siteUrl,
            ...(seo.developer.linkedinUrl ? { "developer:linkedin": seo.developer.linkedinUrl } : {}),
            ...(seo.developer.githubUrl ? { "developer:github": seo.developer.githubUrl } : {}),
          }
        : {}),
    },
    ...(seo.faviconUrl
      ? { icons: { icon: [{ url: seo.faviconUrl }], apple: [{ url: seo.faviconUrl }] } }
      : {}),
  };

  return metadata;
}

function jsonForScript(value: unknown): string {
  return JSON.stringify(value).replace(/[<>&]/g, (c) =>
    c === "<" ? "\\u003c" : c === ">" ? "\\u003e" : "\\u0026",
  );
}

export default async function HomePage() {
  const { content } = await getPublishedSite();
  const jsonLd = generateJsonLdGraph(content);

  return (
    <>
      <script
        type="application/ld+json"
        // JSON is not HTML-safe: a "</script>" inside a content field would end
        // the tag. Escaping the three delimiters keeps it valid JSON and inert.
        dangerouslySetInnerHTML={{ __html: jsonForScript(jsonLd) }}
      />
      <PublicSite content={content} />
    </>
  );
}


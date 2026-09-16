import type { ContactInfo, SiteSettings } from "@/lib/types";
import { DEFAULT_DEVELOPER } from "@/lib/seo";

export function Footer({
  name,
  contact,
  settings,
}: {
  name: string;
  contact: ContactInfo;
  settings?: SiteSettings;
}) {
  // The same ContactInfo the hero, nav and contact section read — the phone
  // number is deliberately never one of these links.
  const links = [
    { label: "Email", href: `mailto:${contact.email}` },
    contact.linkedinUrl ? { label: "LinkedIn", href: contact.linkedinUrl, external: true } : null,
    contact.resumeUrl ? { label: "Resume", href: contact.resumeUrl, external: true } : null,
  ].filter((l): l is { label: string; href: string; external?: boolean } => Boolean(l));

  const dev = settings?.seo?.developerCredit ?? DEFAULT_DEVELOPER;

  return (
    <footer className="relative overflow-hidden bg-transparent pb-6 pt-8 md:pb-8 md:pt-10">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-center gap-x-6 gap-y-1 px-5 font-heading text-[13px] text-white/45 sm:px-6 sm:text-[14px] md:justify-between md:gap-x-8 md:px-12">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target={l.external ? "_blank" : undefined}
            rel={l.external ? "noreferrer" : undefined}
            className="inline-flex min-h-[44px] items-center rounded px-2 transition-colors hover:text-white active:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            {l.label}
          </a>
        ))}
      </div>
      <p
        aria-hidden
        className="pointer-events-none mx-auto mt-2 max-w-full select-none overflow-hidden whitespace-nowrap text-center font-heading text-[15vw] font-bold leading-[0.9] tracking-tight text-white/[0.09] sm:text-[16vw] md:mt-4 md:text-[13vw] lg:text-[11vw]"
      >
        {name}
      </p>
      <div className="mt-4 flex flex-col items-center justify-center gap-2 px-5 text-center font-heading text-[12px] leading-relaxed text-white/35 sm:flex-row sm:gap-3">
        <span>© {new Date().getFullYear()} {name}. All rights reserved.</span>
        {dev.enabled && (
          <>
            <span className="hidden text-white/20 sm:inline" aria-hidden>
              •
            </span>
            <span className="inline-flex flex-wrap items-center justify-center gap-1.5">
              <span>{dev.role || "Developed by"}</span>
              <a
                href={dev.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white/70 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white hover:decoration-white/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {dev.name}
              </a>
              {(dev.linkedinUrl || dev.githubUrl) && (
                <span className="inline-flex items-center gap-1 text-white/45">
                  (
                  {dev.linkedinUrl && (
                    <a
                      href={dev.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-white"
                    >
                      LinkedIn
                    </a>
                  )}
                  {dev.linkedinUrl && dev.githubUrl && <span aria-hidden>·</span>}
                  {dev.githubUrl && (
                    <a
                      href={dev.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-white"
                    >
                      GitHub
                    </a>
                  )}
                  )
                </span>
              )}
            </span>
          </>
        )}
      </div>
    </footer>
  );
}


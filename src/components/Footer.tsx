import type { ContactInfo } from "@/lib/types";

export function Footer({ name, contact }: { name: string; contact: ContactInfo }) {
  // The same ContactInfo the hero, nav and contact section read — the phone
  // number is deliberately never one of these links.
  const links = [
    { label: "Email", href: `mailto:${contact.email}` },
    contact.linkedinUrl ? { label: "LinkedIn", href: contact.linkedinUrl, external: true } : null,
    contact.resumeUrl ? { label: "Resume", href: contact.resumeUrl, external: true } : null,
  ].filter((l): l is { label: string; href: string; external?: boolean } => Boolean(l));

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
      <p className="mt-4 break-words px-5 text-center font-heading text-[12px] leading-relaxed text-white/30">
        © {new Date().getFullYear()} {name}. All rights reserved.
      </p>
    </footer>
  );
}

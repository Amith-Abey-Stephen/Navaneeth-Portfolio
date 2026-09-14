import { site } from "@/data/content";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-transparent pb-6 pt-10 md:pb-8">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-center gap-x-8 gap-y-2 px-5 font-heading text-[13px] text-white/45 sm:px-6 sm:text-[14px] md:justify-between md:px-12">
        <span>Brand Design</span>
        <span>UI Design</span>
        <a
          href="https://rohitanand.gumroad.com/"
          target="_blank"
          rel="noreferrer"
          className="rounded transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          Framer Templates
        </a>
      </div>
      <h2
        aria-hidden
        className="pointer-events-none mx-auto mt-4 max-w-full select-none overflow-hidden whitespace-nowrap text-center font-heading text-[15vw] font-bold leading-[0.9] tracking-tight text-white/[0.09] sm:text-[16vw] md:text-[13vw] lg:text-[11vw]"
      >
        Rohit Anand
      </h2>
      <p className="mt-4 break-words px-5 text-center font-heading text-[12px] leading-relaxed text-white/30">
        © {new Date().getFullYear()} {site.name} — Built with Next.js • {site.email}
      </p>
    </footer>
  );
}

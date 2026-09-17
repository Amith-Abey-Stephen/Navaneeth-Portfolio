"use client";

const PALETTE_GLOWS: Record<
  string,
  {
    gradient: string;
    wash1: string;
    wash2: string;
    wash3: string;
    wash4: string;
    wash5: string;
  }
> = {
  default: {
    gradient:
      "linear-gradient(to bottom, #000000 0%, #0b0404 4%, #ff6a1f 7.5%, #e8490d 9.5%, #7a1e05 11.5%, #3a0f06 13%, #160706 15%, #0a0a0c 17%, #0a0a0c 52%, #2a1216 56%, #c0808a 60%, #5c222a 64%, #0b0b0e 68%, #4a1508 71%, #8a2a10 74%, #2a0d08 77%, #141014 79%, #8e2434 82%, #9c2a3a 83.5%, #431318 86%, #0a0507 91%, #000000 95%, #000000 100%)",
    wash1: "bg-[#ff7a2a]/25",
    wash2: "bg-[#e8490d]/20",
    wash3: "bg-[#ff5a1a]/15",
    wash4: "bg-[#c26a76]/25",
    wash5: "bg-[#a8323e]/20",
  },
  graphite: {
    gradient:
      "linear-gradient(to bottom, #000000 0%, #090a0c 6%, #334155 10%, #1e293b 14%, #0f172a 18%, #0a0b0d 52%, #1e293b 60%, #0f172a 68%, #1e293b 76%, #0a0b0d 92%, #000000 100%)",
    wash1: "bg-[#94a3b8]/20",
    wash2: "bg-[#64748b]/15",
    wash3: "bg-[#475569]/15",
    wash4: "bg-[#94a3b8]/15",
    wash5: "bg-[#334155]/20",
  },
  midnight: {
    gradient:
      "linear-gradient(to bottom, #000000 0%, #030712 5%, #0284c7 9%, #0369a1 12%, #075985 15%, #040711 50%, #0c4a6e 60%, #040711 70%, #1d4ed8 78%, #040711 92%, #000000 100%)",
    wash1: "bg-[#38bdf8]/25",
    wash2: "bg-[#0284c7]/20",
    wash3: "bg-[#2563eb]/18",
    wash4: "bg-[#38bdf8]/15",
    wash5: "bg-[#1e40af]/20",
  },
  emerald: {
    gradient:
      "linear-gradient(to bottom, #000000 0%, #021a0f 5%, #059669 9%, #047857 12%, #064e3b 15%, #040d08 50%, #064e3b 60%, #040d08 70%, #059669 78%, #040d08 92%, #000000 100%)",
    wash1: "bg-[#34d399]/25",
    wash2: "bg-[#10b981]/20",
    wash3: "bg-[#059669]/18",
    wash4: "bg-[#34d399]/15",
    wash5: "bg-[#064e3b]/22",
  },
  "warm-clay": {
    gradient:
      "linear-gradient(to bottom, #000000 0%, #170d05 5%, #d97706 9%, #b45309 12%, #78350f 15%, #0d0a08 50%, #92400e 60%, #0d0a08 70%, #b45309 78%, #0d0a08 92%, #000000 100%)",
    wash1: "bg-[#fbbf24]/22",
    wash2: "bg-[#f59e0b]/20",
    wash3: "bg-[#d97706]/16",
    wash4: "bg-[#f59e0b]/18",
    wash5: "bg-[#78350f]/20",
  },
  "editorial-crimson": {
    gradient:
      "linear-gradient(to bottom, #000000 0%, #160408 5%, #e11d48 9%, #be123c 12%, #881337 15%, #0a0607 50%, #9f1239 60%, #0a0607 70%, #be123c 78%, #0a0607 92%, #000000 100%)",
    wash1: "bg-[#fda4af]/22",
    wash2: "bg-[#f43f5e]/20",
    wash3: "bg-[#e11d48]/16",
    wash4: "bg-[#be123c]/20",
    wash5: "bg-[#881337]/22",
  },
};

/**
 * Atmospheric background canvas for the whole page.
 * Respects the selected color palette token washes.
 */
export function SiteCanvas({ palette = "default" }: { palette?: string }) {
  const glows = PALETTE_GLOWS[palette] ?? PALETTE_GLOWS.default;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0" style={{ background: glows.gradient }} />
      {/* soft washes — all feathered, never hard-edged */}
      <div
        className={`absolute left-1/2 top-[7%] h-[30vh] w-[90vw] -translate-x-1/2 rounded-full ${glows.wash1} blur-[80px] md:blur-[130px]`}
      />
      <div
        className={`absolute left-1/2 top-[12.5%] h-[24vh] w-[90vw] -translate-x-1/2 rounded-full ${glows.wash2} blur-[80px] md:blur-[120px]`}
      />
      <div
        className={`absolute left-[62%] top-[72%] h-[34vh] w-[60vw] -translate-x-1/2 rounded-full ${glows.wash3} blur-[80px] md:blur-[130px]`}
      />
      <div
        className={`absolute left-1/2 top-[59%] h-[30vh] w-[85vw] -translate-x-1/2 rounded-full ${glows.wash4} blur-[80px] md:blur-[130px]`}
      />
      <div
        className={`absolute left-1/2 top-[83%] h-[26vh] w-[80vw] -translate-x-1/2 rounded-full ${glows.wash5} blur-[80px] md:blur-[130px]`}
      />
    </div>
  );
}

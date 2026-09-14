/**
 * The site's section label: a giant ghost word (like "Projects" / "Contact"
 * in the reference) plus a screen-reader heading. Long words size down so
 * "Certifications" fits the 1440 column the way "Contact" does.
 */
export function GhostTitle({ children }: { children: string }) {
  const long = children.length > 9;
  return (
    <>
      <h2 className="sr-only">{children}</h2>
      <p
        aria-hidden
        className={`ghost-huge relative overflow-hidden px-4 text-center ${
          long
            ? "text-[16.5vw] sm:text-[17vw] md:text-[9.6vw]"
            : "text-[22vw] sm:text-[24vw] md:text-[13vw]"
        }`}
      >
        {children}
      </p>
    </>
  );
}

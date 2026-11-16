"use client";

import { useEffect } from "react";
import { ErrorScene } from "@/components/ErrorScene";
import "./globals.css";

/** The last line of defence: if even the root layout fails, the same friendly page still shows (in the system font — the layout's web font is exactly what may have failed). */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <html lang="en">
      <body className="bg-[#f5f0e6] text-[#121211]">
        <ErrorScene reset={reset} digest={error.digest} />
      </body>
    </html>
  );
}

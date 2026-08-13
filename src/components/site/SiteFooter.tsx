"use client";

import type { ContactInfo } from "@/lib/types";
import { ArrowUpRight, Check, Copy, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { AnimatedHeading, Magnetic, Rise } from "./motion/primitives";
import { GoldDot } from "./shared";

function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — the mailto button still works.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="glass-chip inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-ink transition-[filter,transform] duration-200 hover:brightness-125 active:scale-[0.98] sm:w-auto"
    >
      {copied ? (
        <Check className="h-4 w-4 text-success" strokeWidth={2} />
      ) : (
        <Copy className="h-4 w-4" strokeWidth={2} />
      )}
      {copied ? "Copied" : "Copy email"}
      <span aria-live="polite" className="sr-only">
        {copied ? "Email address copied" : ""}
      </span>
    </button>
  );
}

export function SiteFooter({ contact, name }: { contact: ContactInfo; name: string }) {
  const year = new Date().getFullYear();
  return (
    <footer
      id="contact"
      className="relative mt-16 scroll-mt-24 overflow-hidden border-t border-line px-5 sm:px-6 lg:px-8 md:mt-24"
    >
      {/* Bookends the hero's warmth: a brass glow pooling at the page's end. */}
      <div
        aria-hidden
        className="ambient absolute -bottom-48 -left-40 h-[520px] w-[520px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(201,162,106,0.16) 0%, transparent 65%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl py-16 md:py-24">
        <Rise y={10}>
          <p className="utility flex items-center gap-2 !text-accent-ink">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
            Contact
          </p>
        </Rise>
        <h2 className="font-display mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
          {/* The only place the period speaks twice: it lands, then rings once. */}
          <AnimatedHeading text="Let's talk" ring />
        </h2>
        <Rise delay={0.25}>
          {/* Mobile gets stacked, full-width, thumb-height actions; from sm up they flow inline. */}
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Magnetic>
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-bg transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.98] sm:w-auto"
              >
                <Mail className="h-4 w-4" strokeWidth={2} />
                {contact.email}
              </a>
            </Magnetic>
            <CopyEmail email={contact.email} />
            {contact.phone && (
              <a
                href={`tel:${contact.phone.replace(/\s/g, "")}`}
                className="glass-chip inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-ink transition-[filter,transform] duration-200 hover:brightness-125 active:scale-[0.98] sm:w-auto"
              >
                <Phone className="h-4 w-4" strokeWidth={2} />
                {contact.phone}
              </a>
            )}
            {contact.linkedinUrl && (
              <a
                href={contact.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-chip inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-ink transition-[filter,transform] duration-200 hover:brightness-125 active:scale-[0.98] sm:w-auto"
              >
                LinkedIn
                <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
              </a>
            )}
            {contact.resumeUrl && (
              <a
                href={contact.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-chip inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-ink transition-[filter,transform] duration-200 hover:brightness-125 active:scale-[0.98] sm:w-auto"
              >
                Resume
                <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
              </a>
            )}
          </div>
        </Rise>
        <Rise delay={0.35}>
          <div className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
            <p className="text-sm text-muted">
              © {year} <GoldDot text={name} />
            </p>
            <a
              href="#top"
              className="text-sm font-medium text-muted transition-colors duration-200 hover:text-ink"
            >
              Back to top ↑
            </a>
          </div>
        </Rise>
      </div>
    </footer>
  );
}

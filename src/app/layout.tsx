import type { Metadata } from "next";
import { Fraunces, Inter, Schibsted_Grotesk, Spline_Sans_Mono } from "next/font/google";
import "./globals.css";

// Inter serves only the studio chrome; the public site's glass theme uses
// Fraunces (display) / Schibsted Grotesk (body) / Spline Sans Mono (utility).
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
});
const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted",
  display: "swap",
});
const splineMono = Spline_Sans_Mono({
  subsets: ["latin"],
  variable: "--font-spline-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Navaneeth C L — Associate Product Manager",
    template: "%s · Navaneeth C L",
  },
  description:
    "Portfolio of Navaneeth C L — Associate Product Manager, Ex-Founder, CS Engineer. Building products people enjoy that deliver real results.",
  openGraph: {
    title: "Navaneeth C L — Associate Product Manager",
    description:
      "Product manager portfolio: growth outcomes, shipped products, and case studies across product creation, design, and strategy.",
    type: "profile",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Navaneeth C L — Associate Product Manager",
    description:
      "Product manager portfolio: growth outcomes, shipped products, and case studies.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${schibsted.variable} ${splineMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}

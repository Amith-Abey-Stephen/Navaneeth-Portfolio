import type { Metadata } from "next";
import { Inter, Inter_Tight, Great_Vibes } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/LenisProvider";
import { CursorTrail } from "@/components/CursorTrail";
import { Preloader } from "@/components/Preloader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans-next",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-display-next",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script-next",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rohit Anand — Brand & Product Designer",
  description:
    "With a decade of experience, I'm a Brand designer turned UI designer with a strong background in design psychology, specializing in SaaS and B2B brands. 2200+ projects for UNICEF, Panasonic, David Bowie.",
  openGraph: {
    type: "website",
    title: "Rohit Anand — Brand & Product Designer",
    description:
      "I turn ideas into meaningful products. 11 years, 2200+ projects, Framer development, branding, UI/UX.",
    url: "https://portfolioone.framer.ai/",
    images: [
      "https://framerusercontent.com/images/OddaxilXD250xuNchKWZsLQEAiM.png",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rohit Anand — Brand & Product Designer",
    description: "I turn ideas into meaningful products.",
    images: [
      "https://framerusercontent.com/images/OddaxilXD250xuNchKWZsLQEAiM.png",
    ],
  },
  icons: {
    icon: [
      {
        url: "https://framerusercontent.com/images/natDIFhGYWBHS2DovQbtBRcxb8.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "https://framerusercontent.com/images/zWx95oeoMnFgXk7BeqK4l1Aj62A.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable} ${greatVibes.variable}`}
    >
      <body className="bg-[#09090b] text-white antialiased">
        <LenisProvider>
          <Preloader />
          <CursorTrail />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}

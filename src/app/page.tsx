import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { AboutIntro } from "@/components/AboutIntro";
import { Projects } from "@/components/Projects";
import { Journey } from "@/components/Journey";
import { Gallery } from "@/components/Gallery";
import { Quote, About } from "@/components/About";
import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { SiteCanvas } from "@/components/SiteCanvas";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#070708] text-white">
      {/* single continuous background canvas — all sections sit transparent over it */}
      <SiteCanvas />
      <div className="relative">
        <Navbar />
        <Hero />
        <AboutIntro />
        <Projects />
        <Journey />
        <Gallery />
        <Quote />
        <About />
        <Testimonials />
        <Faq />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}

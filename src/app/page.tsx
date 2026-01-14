import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-accent-foreground relative">
      <ParticleBackground />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Portfolio />
        <Services />
        <WhyUs />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}

import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { AIExec } from "@/components/landing/AIExec";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black">
      <Nav />
      <Hero />
      <Features />
      <AIExec />
      {/* Additional sections can be added here */}
      <Footer />
    </main>
  );
}

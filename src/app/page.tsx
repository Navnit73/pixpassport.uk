import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import UploadCard from "@/components/UploadCard";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";

export default function HomePage() {
  return (
    <>
      <JsonLd />

      <Navbar />

      <main className="flex-1">
        <Hero />
        <UploadCard />
        <HowItWorks />
        <Features />
        <Pricing />
        <FAQ />
      </main>

      <Footer />
    </>
  );
}

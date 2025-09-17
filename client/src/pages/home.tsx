import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import FeatureChecklist from "@/components/feature-checklist";
import Stats from "@/components/stats";
import Benefits from "@/components/benefits";
import Features from "@/components/features";
import Security from "@/components/security";
import Testimonials from "@/components/testimonials";
import CustomerStory from "@/components/customer-story";
import FAQ from "@/components/faq";
import CTABanner from "@/components/cta-banner";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <FeatureChecklist />
      <Stats />
      <Benefits />
      <Features />
      <Security />
      <Testimonials />
      <CustomerStory />
      <FAQ />
      <CTABanner />
      <Footer />
    </div>
  );
}

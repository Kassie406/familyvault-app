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
import { MessageCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <div className="gold-divider"></div>
      <FeatureChecklist />
      <div className="gold-divider"></div>
      <Stats />
      <div className="gold-divider"></div>
      <Benefits />
      <div className="gold-divider"></div>
      <Features />
      <div className="gold-divider"></div>
      <Security />
      <div className="gold-divider"></div>
      <Testimonials />
      <div className="gold-divider"></div>
      <CustomerStory />
      <div className="gold-divider"></div>
      <FAQ />
      <CTABanner />
      <Footer />
      
      {/* Chat Bot */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          data-testid="button-chat"
          className="cta-button rounded-full p-4 shadow-2xl"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

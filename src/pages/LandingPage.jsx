import Hero from "./landing/Hero";
import Features from "./landing/Features";
import HowItWorks from "./landing/HowItWorks";
import Testimonials from "./landing/Testimonials";
import Pricing from "./landing/Pricing";
import CTABanner from "./landing/CTABanner";
import Footer from "./landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <CTABanner />
      <Footer />
    </div>
  );
};

export default Index;

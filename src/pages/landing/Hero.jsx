import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import heroDashboard from "/assets/hero-dashboard.jpg";

const Hero = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#001f3f] via-[#000814] to-[#000] text-gray-100">
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* --- Left Text Section --- */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 text-sm text-cyan-300 font-medium">
              <Zap className="w-4 h-4 text-cyan-300" />
              <span>Powered by Deriv Integration</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
              Automated Trading.{" "}
              <span className="text-cyan-400 drop-shadow-[0_0_10px_#00ffff60]">
                Simplified.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed">
              MrChalohFx Traders gives you the power of Deriv with advanced
              bots, AI-driven analytics, and copy trading tools — all in one
              intuitive platform built for serious traders.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => scrollToSection("pricing")}
                className="group bg-cyan-500 hover:bg-cyan-400 text-[#001f3f] font-bold px-8 py-3 rounded-xl transition-all text-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/40"
              >
                Get Started
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                onClick={() => scrollToSection("pricing")}
                className="border border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                Login with Deriv
              </Button>
            </div>
          </div>

          {/* --- Right Image Section --- */}
          <div className="relative animate-fade-in-up animation-delay-200">
            <div className="absolute -inset-6 bg-cyan-500/10 blur-3xl rounded-full"></div>
            <img
              src={heroDashboard}
              alt="MrChalohFx Trading Dashboard"
              className="relative rounded-2xl border border-cyan-400/20 shadow-2xl hover:shadow-cyan-500/30 transition-all duration-500"
            />
          </div>
        </div>
      </div>

      {/* Bottom Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none"></div>
    </section>
  );
};

export default Hero;

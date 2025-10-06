import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Zap } from "lucide-react";

const Pricing = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section
      id="pricing"
      className="py-24 relative bg-gradient-to-b from-[#01040C] via-[#030A1A] to-[#020617] text-white"
    >
      {/* Cyan glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,255,0.1)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Simple <span className="text-cyan-400">Pricing</span>
          </h2>
          <p className="text-xl text-cyan-100/70 max-w-2xl mx-auto">
            Start free, upgrade when you're ready
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Free Tier */}
          <Card className="p-8 bg-[#0B1120]/60 border border-cyan-900 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-2 text-cyan-300">Free</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">$0</span>
                  <span className="text-cyan-200/70">/month</span>
                </div>
              </div>

              <ul className="space-y-3 text-cyan-100/80">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <span>Access to all trading tools</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <span>Basic bot builder</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <span>Free bot library</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <span>Charts & indicators</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <span>3 free Elite bot trials</span>
                </li>
              </ul>

              <Button
                variant="outline"
                size="lg"
                className="w-full border-cyan-500 text-cyan-300 hover:bg-cyan-500/10"
                onClick={scrollToTop}
              >
                Get Started Free
              </Button>
            </div>
          </Card>

          {/* Starter Tier */}
          <Card className="p-8 bg-[#0B1120]/60 border border-cyan-900 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-2 text-cyan-300">
                  Starter
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">$9</span>
                  <span className="text-cyan-200/70">/month</span>
                </div>
              </div>

              <ul className="space-y-3 text-cyan-100/80">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <span>All Free features</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <span>Basic strategy backtesting</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <span>1 active bot</span>
                </li>
              </ul>

              <Button
                variant="outline"
                size="lg"
                className="w-full border-cyan-500 text-cyan-300 hover:bg-cyan-500/10"
                onClick={scrollToTop}
              >
                Get Starter
              </Button>
            </div>
          </Card>

          {/* Pro Tier */}
          <Card className="p-8 bg-[#0B1120]/60 border border-cyan-900 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-2 text-cyan-300">Pro</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">$29</span>
                  <span className="text-cyan-200/70">/month</span>
                </div>
              </div>

              <ul className="space-y-3 text-cyan-100/80">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <span>All Starter features</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <span>Up to 5 active bots</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <span>Copy trading access</span>
                </li>
              </ul>

              <Button
                variant="outline"
                size="lg"
                className="w-full border-cyan-500 text-cyan-300 hover:bg-cyan-500/10"
                onClick={scrollToTop}
              >
                Get Pro
              </Button>
            </div>
          </Card>

          {/* Premium Tier */}
          <Card className="p-8 bg-[#0B1120]/60 border-2 border-cyan-500 relative overflow-hidden shadow-xl hover:scale-105 transition-all duration-300 backdrop-blur-sm">
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-500 text-black text-sm font-semibold">
                <Zap className="w-3 h-3" />
                Popular
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-2 text-cyan-300">
                  Premium
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-cyan-400">$49</span>
                  <span className="text-cyan-200/70">/month</span>
                </div>
              </div>

              <ul className="space-y-3 text-cyan-100/80">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <span className="font-semibold">
                    Everything in Pro, plus:
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <span>Unlimited Elite Speedbots</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <span>Advanced analytics & reports</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <span>Priority support</span>
                </li>
              </ul>

              <Button
                variant="hero"
                size="lg"
                className="w-full text-black bg-cyan-400 hover:bg-cyan-300"
                onClick={scrollToTop}
              >
                Upgrade to Premium
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Pricing;

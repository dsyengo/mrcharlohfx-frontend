import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Zap } from "lucide-react";

const Pricing = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  return (
    <section id="pricing" className="py-24 relative bg-gradient-to-b from-[#01040C] via-[#030A1A] to-[#020617] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,255,0.1)_0%,transparent_70%)] pointer-events-none"></div>
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">Simple <span className="text-cyan-400">Pricing</span></h2>
          <p className="text-xl text-cyan-100/70 max-w-2xl mx-auto">Start free, upgrade when you're ready</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {[
            { name: "Free", price: "$0", badge: null },
            { name: "Starter", price: "$9", badge: null },
            { name: "Pro", price: "$29", badge: null },
            { name: "Premium", price: "$49", badge: "Popular" },
          ].map((plan) => (
            <Card key={plan.name} className={`p-8 bg-[#0B1120]/60 ${plan.badge ? 'border-2 border-cyan-500' : 'border border-cyan-900'} hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm relative`}>
              {plan.badge && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-500 text-black text-sm font-semibold">
                    <Zap className="w-3 h-3" />
                    {plan.badge}
                  </span>
                </div>
              )}
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-cyan-300">{plan.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    <span className="text-cyan-200/70">/month</span>
                  </div>
                </div>
                <ul className="space-y-3 text-cyan-100/80">
                  {[
                    "Access to all trading tools",
                    "Basic bot builder",
                    "Free bot library",
                    "Charts & indicators",
                    plan.name !== 'Free' && "Copy trading access",
                  ].filter(Boolean).map((line) => (
                    <li key={String(line)} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-cyan-400 mt-0.5" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" size="lg" className="w-full border-cyan-500 text-cyan-300 hover:bg-cyan-500/10" onClick={scrollToTop}>
                  {plan.badge ? 'Upgrade to Premium' : `Get ${plan.name}`}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;



import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  { name: "James K.", role: "Day Trader", quote: "MrChalohFx changed the way I trade—super easy to use!", avatar: "JK" },
  { name: "Alice W.", role: "Crypto Investor", quote: "The bots here outperformed my manual trading.", avatar: "AW" },
  { name: "Mark L.", role: "Professional Trader", quote: "I love the copy trading feature, it's totally hands-free.", avatar: "ML" },
  { name: "Sarah P.", role: "Forex Enthusiast", quote: "Best trading platform I've used. The analytics are incredible!", avatar: "SP" },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="relative py-24 bg-[#030014] text-white overflow-hidden">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-cyan-500/20 rounded-full blur-[160px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-400/10 rounded-full blur-[120px]" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">Trusted by Traders</h2>
          <p className="text-lg text-cyan-100/80 max-w-2xl mx-auto">See what our community has to say</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {testimonials.map((t) => (
            <Card key={t.name} className="p-6 bg-gradient-to-b from-[#0b0f26]/70 to-[#050817]/60 border border-cyan-500/30 rounded-2xl backdrop-blur-sm shadow-[0_0_25px_rgba(6,182,212,0.2)] hover:shadow-[0_0_40px_rgba(6,182,212,0.35)] transition-all duration-500 hover:scale-[1.03] group space-y-5">
              <div className="flex justify-start">
                <Quote className="w-8 h-8 text-cyan-400/70 group-hover:text-cyan-300 transition-colors duration-300" />
              </div>
              <p className="text-cyan-50 italic leading-relaxed text-[15px]">“{t.quote}”</p>
              <div className="flex items-center gap-3 pt-4 border-t border-cyan-500/30">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400/30 to-blue-500/20 flex items-center justify-center font-bold text-cyan-300 border border-cyan-400/40 shadow-inner">{t.avatar}</div>
                <div>
                  <p className="font-semibold text-cyan-100">{t.name}</p>
                  <p className="text-sm text-cyan-300/70">{t.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;



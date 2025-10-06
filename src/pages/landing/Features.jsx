import { Bot, BarChart3, Users, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Bot,
    title: "Bot Builder",
    description:
      "Build trading bots with drag & drop. No coding required—just strategy.",
  },
  {
    icon: TrendingUp,
    title: "Free & Premium Bots",
    description:
      "Test free bots or unlock elite speedbots for maximum performance.",
  },
  {
    icon: BarChart3,
    title: "Charts & Analysis",
    description:
      "TradingView-style charts with advanced indicators and real-time data.",
  },
  {
    icon: Users,
    title: "Copy Trading",
    description:
      "Follow top traders automatically. Let the experts trade for you.",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="py-24 bg-gradient-to-b from-[#000814] via-[#001f3f] to-[#000] text-gray-100 relative overflow-hidden"
    >
      {/* Subtle glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,255,255,0.06),_transparent_70%)]"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 space-y-5 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Everything You Need to{" "}
            <span className="text-cyan-400 drop-shadow-[0_0_10px_#00ffff60]">
              Trade Smarter
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Powerful, intuitive tools designed for both beginners and expert
            traders.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group p-8 rounded-2xl bg-[#001528]/80 border border-cyan-400/10 hover:border-cyan-400/40 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-cyan-500/20 backdrop-blur-md"
            >
              <div className="w-16 h-16 rounded-xl bg-cyan-400/10 flex items-center justify-center mb-6 group-hover:bg-cyan-400/20 transition-all duration-300">
                <feature.icon className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
